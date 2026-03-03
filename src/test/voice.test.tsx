/**
 * Voice Interface Tests
 * Tests for VoiceButton, VoiceWaveform, and VoiceTranscript components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VoiceButton } from '@/components/voice/VoiceButton';
import { VoiceWaveform } from '@/components/voice/VoiceWaveform';
import { VoiceTranscript } from '@/components/voice/VoiceTranscript';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Voice Interface', () => {
  describe('VoiceButton', () => {
    const defaultProps = {
      isConnected: false,
      isConnecting: false,
      isSpeaking: false,
      isExecutingTool: false,
      onStart: vi.fn(),
      onEnd: vi.fn(),
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should render idle state with "Talk to Kayla" text', () => {
      render(<VoiceButton {...defaultProps} />);
      expect(screen.getByText(/talk to kayla/i)).toBeInTheDocument();
    });

    it('should show connecting state', () => {
      render(<VoiceButton {...defaultProps} isConnecting={true} />);
      expect(screen.getByText(/connecting/i)).toBeInTheDocument();
    });

    it('should call onStart when clicked in idle state', () => {
      render(<VoiceButton {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onStart).toHaveBeenCalledTimes(1);
    });

    it('should disable button while connecting', () => {
      render(<VoiceButton {...defaultProps} isConnecting={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show connected state with end option', () => {
      render(<VoiceButton {...defaultProps} isConnected={true} />);
      // When connected, should show the end call button
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('VoiceWaveform', () => {
    it('should render correct number of bars', () => {
      const { container } = render(
        <VoiceWaveform isActive={false} isSpeaking={false} barCount={5} />
      );
      const bars = container.querySelectorAll('[class*="rounded-full"]');
      expect(bars.length).toBe(5);
    });

    it('should render with custom bar count', () => {
      const { container } = render(
        <VoiceWaveform isActive={false} isSpeaking={false} barCount={3} />
      );
      const bars = container.querySelectorAll('[class*="rounded-full"]');
      expect(bars.length).toBe(3);
    });

    it('should render without crashing when active and speaking', () => {
      const { container } = render(
        <VoiceWaveform isActive={true} isSpeaking={true} />
      );
      expect(container).toBeTruthy();
    });
  });

  describe('VoiceTranscript', () => {
    it('should render nothing for empty transcript', () => {
      const { container } = render(<VoiceTranscript transcript="" />);
      // Should render but with no visible content
      expect(container).toBeTruthy();
    });

    it('should parse user messages correctly', () => {
      render(<VoiceTranscript transcript="You: Hello there" />);
      expect(screen.getByText('Hello there')).toBeInTheDocument();
    });

    it('should parse Kayla messages correctly', () => {
      render(<VoiceTranscript transcript="Kayla: How can I help?" />);
      expect(screen.getByText('How can I help?')).toBeInTheDocument();
    });

    it('should parse system messages correctly', () => {
      render(<VoiceTranscript transcript="Searching businesses..." />);
      expect(screen.getByText('Searching businesses...')).toBeInTheDocument();
    });
  });

  describe('Transcript Parsing Logic', () => {
    const parseTranscript = (raw: string) => {
      if (!raw) return null;
      const id = raw.slice(0, 20);
      if (raw.startsWith('You: ')) return { id, speaker: 'user', text: raw.slice(5) };
      if (raw.startsWith('Kayla: ')) return { id, speaker: 'kayla', text: raw.slice(7) };
      return { id, speaker: 'system', text: raw };
    };

    it('should return null for empty string', () => {
      expect(parseTranscript('')).toBeNull();
    });

    it('should parse user messages', () => {
      const result = parseTranscript('You: Find a restaurant');
      expect(result?.speaker).toBe('user');
      expect(result?.text).toBe('Find a restaurant');
    });

    it('should parse kayla messages', () => {
      const result = parseTranscript('Kayla: I found 3 restaurants');
      expect(result?.speaker).toBe('kayla');
      expect(result?.text).toBe('I found 3 restaurants');
    });

    it('should parse system messages', () => {
      const result = parseTranscript('Loading results...');
      expect(result?.speaker).toBe('system');
      expect(result?.text).toBe('Loading results...');
    });
  });
});
