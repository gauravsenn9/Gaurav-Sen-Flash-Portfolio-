import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, X, Zap } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };
const starters = [
  'Walk me through WorkRadar.',
  'How did you approach Zepto basket growth?',
  'Tell me about a tough product trade-off.',
  'How do you prioritise features?',
];

export function FlashAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { list.current?.scrollTo(0, list.current.scrollHeight); }, [msgs]);
  useEffect(() => { if (open && !busy) box.current?.focus(); }, [open, busy]);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, [open]);

  async function send(text: string) {
    const q = text.trim(); if (!q || busy) return;
    const next = [...msgs, { role: 'user' as const, content: q }];
    setMsgs([...next, { role: 'assistant', content: '' }]); setInput(''); setBusy(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) });
      if (!res.ok || !res.body) throw new Error(res.status === 402 || res.status === 429 ? 'Flash AI is busy right now. Please try again shortly.' : (await res.text()) || 'Something went wrong.');
      const reader = res.body.getReader(); const dec = new TextDecoder(); let out = '';
      for (;;) { const { done, value } = await reader.read(); if (done) break; out += dec.decode(value, { stream: true }); setMsgs([...next, { role: 'assistant', content: out }]); }
      if (!out) setMsgs([...next, { role: 'assistant', content: 'I could not answer that one — feel free to book a call with me.' }]);
    } catch (e) {
      setMsgs([...next, { role: 'assistant', content: `⚠️ ${e instanceof Error ? e.message : 'Something went wrong.'}` }]);
    } finally { setBusy(false); }
  }

  return <>
    {!open && <button className="flash-launch" onClick={() => setOpen(true)} aria-label="Open Flash AI chat"><Zap size={18} fill="currentColor"/> Ask Flash AI</button>}
    {open && <section className="flash-panel" role="dialog" aria-label="Flash AI — chat with Gaurav">
      <header className="flash-head"><span className="flash-badge"><Zap size={16} fill="currentColor"/></span><div><strong>Flash AI</strong><small>Answers as Gaurav, from his case studies</small></div><button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18}/></button></header>
      <div className="flash-list" ref={list} aria-live="polite">
        {!msgs.length && <div className="flash-empty"><p>Hi, I’m Gaurav. Ask me anything about my product work — like an interviewer would.</p><div className="flash-chips">{starters.map(s => <button key={s} onClick={() => send(s)}>{s}</button>)}</div></div>}
        {msgs.map((m, i) => <div key={i} className={`flash-msg ${m.role}`}>{m.content ? (m.role === 'assistant' ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content) : <span className="flash-typing">Thinking…</span>}</div>)}
      </div>
      <form className="flash-form" onSubmit={e => { e.preventDefault(); send(input); }}>
        <textarea ref={box} value={input} rows={1} placeholder="Ask a product question…" aria-label="Your question" onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}/>
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send"><Send size={16}/></button>
      </form>
    </section>}
  </>;
}
