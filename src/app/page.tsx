'use client';

import { useState } from 'react';
import { Shield, Cpu, Zap, DollarSign, Layers, Copy, Check } from 'lucide-react';

interface ArbitrageMetrics {
  raw_token_footprint: number;
  optimized_token_footprint: number;
  compression_efficiency_ratio: string;
  enterprise_savings_matrix: Record<string, string>;
}

interface CompilerResponse {
  high_context_prompt: string;
  low_token_prompt: string;
  metrics: ArbitrageMetrics;
  security_logs: { pii_elements_masked: number; injection_flags_tripped: boolean };
}

export default function AxonStripDashboard() {
  const [rawInput, setRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompilerResponse | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const executeCompilation = async () => {
    if (!rawInput.trim()) return;
    setLoading(true);
    try {
      const apiHost = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
      const targetEndpoint = `${apiHost}/api/v1/compile`;
      
      const res = await fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: rawInput })
      });
      
      if (!res.ok) throw new Error('Middleware calculation failure.');
      const data: CompilerResponse = await res.json();
      setResult(data);
    } catch (err) {
      alert('Operational exception trace: Make sure backend endpoint parameters are alive.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="max-w-7xl mx-auto border-b border-slate-800 pb-4 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            AXON-STRIP // PROMPT COMPILER
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wide mt-1">
            SYSTEM SPECIFICATION MATRIX • STABLE RELEASE V2.0.0
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs border border-slate-800 bg-slate-900/50 px-4 py-2 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-400">MIDDLEWARE STATUS: OPERATIONAL</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-lg">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Source Data Ingress
            </h2>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste raw, unoptimized prompt text block here..."
              className="w-full h-64 bg-slate-950/80 border border-slate-800 rounded p-3 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <button
              onClick={executeCompilation}
              disabled={loading || !rawInput.trim()}
              className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 text-sm font-black uppercase tracking-wider py-3 rounded hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 transition-all duration-200"
            >
              {loading ? 'Compiling Code Vector...' : 'Execute Structural Compilation'}
            </button>
          </div>

          {result && (
            <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-lg font-mono text-xs flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" /> Arbitrage Calculations
              </h2>
              <div className="grid grid-cols-2 gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-slate-500 block">RAW PAYLOAD:</span>
                  <span className="text-sm font-bold text-slate-300">{result.metrics.raw_token_footprint} Tokens</span>
                </div>
                <div>
                  <span className="text-slate-500 block">COMPRESSED:</span>
                  <span className="text-sm font-bold text-cyan-400">{result.metrics.optimized_token_footprint} Tokens</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">COMPRESSION EFFICIENCY RATIO:</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {result.metrics.compression_efficiency_ratio} Reduction
                </span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
                <span className="text-slate-500 block mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> ENTERPRISE 1M SAVINGS:
                </span>
                {Object.entries(result.metrics.enterprise_savings_matrix).map(([model, savings]) => (
                  <div key={model} className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-900 rounded">
                    <span className="text-slate-400 uppercase text-[10px]">{model}:</span>
                    <span className="font-bold text-emerald-400">{savings}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="lg:col-span-8 flex flex-col gap-6">
          {!result ? (
            <div className="h-[480px] border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center p-12 text-center bg-slate-900/5">
              <Layers className="w-8 h-8 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-400">System Pipeline Idle</h3>
              <p className="text-xs text-slate-600 font-mono mt-1 max-w-xs mx-auto">
                Submit raw prompt strings on the input console to trigger compilation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <header className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-bold text-cyan-400 tracking-widest flex items-center gap-1.5 font-mono">
                      <Zap className="w-3.5 h-3.5" /> LOW-TOKEN SHORTHAND
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.low_token_prompt, 'low_token')}
                      className="text-slate-500 hover:text-slate-300 p-1"
                    >
                      {copiedSection === 'low_token' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </header>
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-[440px] overflow-y-auto bg-slate-950/50 p-3 border border-slate-900 rounded">
                    {result.low_token_prompt}
                  </pre>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <header className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-bold text-indigo-400 tracking-widest flex items-center gap-1.5 font-mono">
                      <Layers className="w-3.5 h-3.5" /> HIGH-CONTEXT ARCHITECTURE
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.high_context_prompt, 'high_context')}
                      className="text-slate-500 hover:text-slate-300 p-1"
                    >
                      {copiedSection === 'high_context' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </header>
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-[440px] overflow-y-auto bg-slate-950/50 p-3 border border-slate-900 rounded">
                    {result.high_context_prompt}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
