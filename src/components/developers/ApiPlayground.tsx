import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Loader2, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
}

interface ApiPlaygroundProps {
  apiName: string;
  baseUrl: string;
  endpoint: Endpoint;
}

type ResponseStatus = 'idle' | 'loading' | 'success' | 'error';

const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ apiName, baseUrl, endpoint }) => {
  const [apiKey, setApiKey] = useState('');
  const [requestBody, setRequestBody] = useState(JSON.stringify(endpoint.request, null, 2));
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<ResponseStatus>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [useSandbox, setUseSandbox] = useState(true);

  const handleExecute = async () => {
    if (!useSandbox && !apiKey.trim()) {
      toast.error('Please enter your API key or use Sandbox mode');
      return;
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch {
      toast.error('Invalid JSON in request body');
      return;
    }

    setStatus('loading');
    setResponse(null);
    setLatency(null);
    setHttpStatus(null);

    const startTime = performance.now();

    if (useSandbox) {
      // Simulate API call with mock response
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setHttpStatus(200);
      setResponse(JSON.stringify(endpoint.response, null, 2));
      setStatus('success');
      toast.success('Sandbox request completed');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(parsedBody),
      });

      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setHttpStatus(res.status);

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));

      if (res.ok) {
        setStatus('success');
        toast.success('Request completed successfully');
      } else {
        setStatus('error');
        toast.error(`Request failed with status ${res.status}`);
      }
    } catch (error) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setStatus('error');
      setResponse(
        JSON.stringify(
          {
            error: 'Network error',
            message: error instanceof Error ? error.message : 'Failed to connect to API',
          },
          null,
          2
        )
      );
      toast.error('Failed to connect to API');
    }
  };

  const resetToDefault = () => {
    setRequestBody(JSON.stringify(endpoint.request, null, 2));
    setResponse(null);
    setStatus('idle');
    setLatency(null);
    setHttpStatus(null);
  };

  return (
    <Card className="glass-card border-mansablue/30 bg-gradient-to-br from-mansablue/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mansablue/20 rounded-lg border border-mansablue/30">
              <Zap className="h-5 w-5 text-mansablue" />
            </div>
            <div>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                Interactive Playground
                {useSandbox && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-xs">
                    Sandbox Mode
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-white/60">
                Test this endpoint live in your browser
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseSandbox(!useSandbox)}
            className={`border-white/20 ${
              useSandbox ? 'text-amber-400 hover:bg-amber-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            {useSandbox ? 'Using Sandbox' : 'Using Live API'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input (only for live mode) */}
        {!useSandbox && (
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-white/80">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="1325_live_xxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-slate-900/80 border-white/20 text-white placeholder:text-white/40 font-mono"
            />
            <p className="text-xs text-white/50">
              Your API key is not stored. Get your key from the{' '}
              <a href="/developers/dashboard" className="text-mansablue hover:underline">
                Dashboard
              </a>
            </p>
          </div>
        )}

        {useSandbox && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-amber-400 text-sm">
              <strong>Sandbox Mode:</strong> Returns mock responses without making real API calls. 
              No API key required. Switch to Live mode to test with real data.
            </p>
          </div>
        )}

        {/* Request Body Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="request-body" className="text-white/80">
              Request Body
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefault}
              className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
            >
              Reset to Default
            </Button>
          </div>
          <Textarea
            id="request-body"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="bg-slate-900/80 border-white/20 text-emerald-400 font-mono text-sm min-h-[150px] resize-y"
            placeholder="Enter JSON request body..."
          />
        </div>

        {/* Execute Button */}
        <Button
          onClick={handleExecute}
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-mansablue to-mansablue-light hover:from-mansablue-light hover:to-mansablue text-white font-semibold"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Execute {endpoint.method} {endpoint.path}
            </>
          )}
        </Button>

        {/* Response Section */}
        {(response || status === 'loading') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white/80">Response</Label>
              <div className="flex items-center gap-3">
                {httpStatus !== null && (
                  <Badge
                    className={
                      httpStatus >= 200 && httpStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }
                  >
                    {httpStatus >= 200 && httpStatus < 300 ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {httpStatus}
                  </Badge>
                )}
                {latency !== null && (
                  <Badge variant="outline" className="border-white/20 text-white/60">
                    <Clock className="h-3 w-3 mr-1" />
                    {latency}ms
                  </Badge>
                )}
              </div>
            </div>
            <ScrollArea className="h-auto max-h-64">
              <pre
                className={`rounded-lg p-4 text-sm overflow-x-auto border ${
                  status === 'error'
                    ? 'bg-red-950/50 border-red-500/30'
                    : 'bg-slate-900/80 border-white/10'
                }`}
              >
                <code className={status === 'error' ? 'text-red-400' : 'text-mansablue-light'}>
                  {response || 'Loading...'}
                </code>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiPlayground;
