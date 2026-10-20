import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ClinicalHelpConversationProvider, useClinicalHelpConversation } from '@/pages/health/ClinicalHelpConversation';

const mock = vi.hoisted(() => ({
  sendMessage: vi.fn().mockResolvedValue(undefined), stop: vi.fn().mockResolvedValue(undefined), setMessages: vi.fn(), clearError: vi.fn(),
  callbacks: null as null | { onFinish: (args: unknown) => void; onError: (e: Error) => void; transport: { prepareSendMessagesRequest: () => { body: unknown } } },
  authCallback: null as null | ((event: string, session: { user: { id: string } } | null) => void),
}));
vi.mock('@ai-sdk/react', () => ({ useChat: (options: typeof mock.callbacks) => {
  mock.callbacks = options;
  return { messages: [], status: 'ready', sendMessage: mock.sendMessage, stop: mock.stop, setMessages: mock.setMessages, clearError: mock.clearError };
} }));
vi.mock('ai', () => ({ DefaultChatTransport: class { constructor(options: object) { Object.assign(this, options); } } }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: {
  getSession: vi.fn(),
  onAuthStateChange: (callback: typeof mock.authCallback) => { mock.authCallback = callback; return { data: { subscription: { unsubscribe: vi.fn() } } }; },
} } }));
function Probe() {
  const chat = useClinicalHelpConversation();
  return <><button onClick={() => chat?.ask({ topics: ['notes'], intent: 'steps' }, 'workspace')}>Ask</button><button onClick={() => void chat?.clear()}>Clear</button><span>{chat?.status}</span></>;
}
afterEach(() => { cleanup(); vi.clearAllMocks(); mock.stop.mockResolvedValue(undefined); });
describe('one unsaved private product conversation', () => {
  it('continues beyond forty answers with bounded verified context only', async () => {
    render(<ClinicalHelpConversationProvider><Probe /></ClinicalHelpConversationProvider>);
    for (let i = 0; i < 45; i++) {
      fireEvent.click(screen.getByText('Ask'));
      act(() => mock.callbacks?.onFinish({ message: { parts: [{ type: 'data-receipt', data: { text: 'Fictional product answer', proof: 'a'.repeat(64) } }] }, isAbort: false, isError: false }));
    }
    expect(mock.sendMessage).toHaveBeenCalledTimes(45);
    const body = mock.callbacks?.transport.prepareSendMessagesRequest().body as { turns: unknown[] };
    expect(body.turns).toHaveLength(40);
  });
  it('permits retry after a failed turn without forwarding the incomplete turn', () => {
    render(<ClinicalHelpConversationProvider><Probe /></ClinicalHelpConversationProvider>);
    fireEvent.click(screen.getByText('Ask'));
    act(() => mock.callbacks?.onError(new Error('offline')));
    fireEvent.click(screen.getByText('Ask'));
    expect(mock.sendMessage).toHaveBeenCalledTimes(2);
    const body = mock.callbacks?.transport.prepareSendMessagesRequest().body as { turns: unknown[] };
    expect(body.turns).toHaveLength(1);
  });
  it('sends only selections, never SDK messages or arbitrary typed input', () => {
    render(<ClinicalHelpConversationProvider><Probe /></ClinicalHelpConversationProvider>);
    fireEvent.click(screen.getByText('Ask'));
    expect(mock.callbacks?.transport.prepareSendMessagesRequest()).toEqual({ body: { surface: 'workspace', turns: [{ selection: { topics: ['notes'], intent: 'steps' } }] } });
  });
  it('preserves same-user sign-in notifications but clears on account change', async () => {
    render(<ClinicalHelpConversationProvider><Probe /></ClinicalHelpConversationProvider>);
    act(() => mock.authCallback?.('INITIAL_SESSION', { user: { id: 'one' } }));
    act(() => mock.authCallback?.('SIGNED_IN', { user: { id: 'one' } }));
    expect(mock.stop).not.toHaveBeenCalled();
    act(() => mock.authCallback?.('SIGNED_IN', { user: { id: 'two' } }));
    await waitFor(() => expect(mock.setMessages).toHaveBeenCalledWith([]));
    expect(mock.clearError).toHaveBeenCalledOnce();
  });
  it('blocks a new question until cancellation finishes and ignores late receipts', async () => {
    let release: (() => void) | undefined;
    mock.stop.mockImplementationOnce(() => new Promise<void>(resolve => { release = resolve; }));
    render(<ClinicalHelpConversationProvider><Probe /></ClinicalHelpConversationProvider>);
    fireEvent.click(screen.getByText('Ask'));
    fireEvent.click(screen.getByText('Clear'));
    act(() => mock.callbacks?.onFinish({ message: { parts: [{ type: 'data-receipt', data: { text: 'late', proof: 'invalid' } }] }, isAbort: false, isError: false }));
    fireEvent.click(screen.getByText('Ask'));
    expect(mock.sendMessage).toHaveBeenCalledOnce();
    await act(async () => { release?.(); });
    fireEvent.click(screen.getByText('Ask'));
    expect(mock.sendMessage).toHaveBeenCalledTimes(2);
    expect(mock.callbacks?.transport.prepareSendMessagesRequest()).toEqual({ body: { surface: 'workspace', turns: [{ selection: { topics: ['notes'], intent: 'steps' } }] } });
  });
  it('stops the current response when the private provider unmounts', () => {
    const view = render(<ClinicalHelpConversationProvider><Probe /></ClinicalHelpConversationProvider>);
    fireEvent.click(screen.getByText('Ask'));
    view.unmount();
    expect(mock.stop).toHaveBeenCalledOnce();
  });
});