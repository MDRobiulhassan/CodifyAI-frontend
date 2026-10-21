import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../types';
import { api } from '../api';
import { useAuth } from '../auth';
import { toast } from './Toast';
import { Send, Sparkles, Loader2, User as UserIcon, CornerDownLeft, Square } from 'lucide-react';

interface ChatPanelProps {
  projectId: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const QUICK_PROMPTS = [
  'Add a dark mode toggle',
  'Make it responsive',
  'Add a contact form',
  'Improve the design',
];

export function ChatPanel({ projectId, messages, setMessages }: ChatPanelProps) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || sending) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput('');
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await api.streamChat(
        { message: text.trim(), projectId },
        (chunk) => {
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last && last.role === 'assistant') {
              copy[copy.length - 1] = { ...last, content: last.content + chunk };
            }
            return copy;
          });
        },
        controller.signal
      );
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.role === 'assistant' && !last.content) {
            copy[copy.length - 1] = { ...last, content: 'Sorry, something went wrong. Please try again.' };
          }
          return copy;
        });
        toast('error', 'Chat request failed.');
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full bg-cream-100">
      <div className="flex items-center gap-2 px-4 h-11 border-b border-cream-200 text-sm font-medium text-charcoal-700">
        <Sparkles size={15} className="text-charcoal-500" /> Chat
        <span className="ml-auto text-xs text-charcoal-400">{messages.length} messages</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
            <div className="w-12 h-12 rounded-full bg-cream-200 text-charcoal-500 grid place-items-center mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-semibold text-charcoal-700">Start building</h3>
            <p className="mt-1.5 text-sm text-charcoal-400 max-w-xs">
              Describe what you want to build or change. CodifyAI will generate the code and update the preview.
            </p>
            <div className="mt-5 flex flex-col gap-2 w-full max-w-xs">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-left text-sm rounded-md bg-cream-50 border border-cream-200 px-3 py-2 text-charcoal-600 hover:border-charcoal-700/40 hover:text-charcoal-700 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} userName={user?.name} />
        ))}
      </div>

      <div className="border-t border-cream-200 p-3">
        <div className="card flex items-end gap-2 focus-within:ring-2 focus-within:ring-link-400/40 transition">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Describe a change or new feature…"
            rows={1}
            className="flex-1 bg-transparent border-0 outline-none resize-none text-sm text-charcoal-700 placeholder:text-charcoal-400 py-1.5 px-1 max-h-32"
            style={{ minHeight: 36 }}
          />
          {sending ? (
            <button onClick={stop} className="btn-ghost bg-red-600 text-cream-50 border-red-600 px-3 py-2 text-sm shrink-0">
              <Square size={14} /> Stop
            </button>
          ) : (
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="btn-dark px-3 py-2 text-sm shrink-0"
            >
              <Send size={15} />
            </button>
          )}
        </div>
        <p className="mt-2 text-[11px] text-charcoal-400 flex items-center gap-1 px-1">
          <CornerDownLeft size={11} /> Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message, userName }: { message: ChatMessage; userName?: string }) {
  const isUser = message.role === 'user';
  const isStreaming = !isUser && message.content === '';
  const initials = (userName || 'You').split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full grid place-items-center shrink-0 text-xs font-semibold ${
        isUser ? 'bg-charcoal-600 text-cream-50' : 'bg-charcoal-700 text-cream-50 shadow-btn-dark'
      }`}>
        {isUser ? (initials || 'U') : <Sparkles size={14} />}
      </div>
      <div className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-charcoal-700/[0.06] text-charcoal-700 rounded-tr-sm'
          : 'bg-cream-200 text-charcoal-700 rounded-tl-sm'
      }`}>
        {isStreaming ? (
          <span className="flex items-center gap-2 text-charcoal-400">
            <Loader2 size={14} className="animate-spin" /> Generating…
          </span>
        ) : (
          <FormattedContent content={message.content} />
        )}
      </div>
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.replace(/```(\w+)?\n?/, '').replace(/```$/, '').split('\n');
          return (
            <pre key={i} className="bg-charcoal-800 rounded-lg p-3 overflow-x-auto scrollbar-thin text-xs font-mono text-cream-100 border border-charcoal-800">
              <code>{lines.join('\n')}</code>
            </pre>
          );
        }
        return <p key={i} className="whitespace-pre-wrap">{renderInline(part)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith('`') && p.endsWith('`') ? (
      <code key={i} className="bg-cream-200 rounded px-1.5 py-0.5 text-xs font-mono text-charcoal-600">{p.slice(1, -1)}</code>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export const _u = UserIcon;
