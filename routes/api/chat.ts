import { createFileRoute } from '@tanstack/react-router';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import projects from '@/data/projects.json';
import site from '@/data/site.json';
import profile from '@/data/profile.json';

const knowledge = JSON.stringify(
  (projects as Array<Record<string, unknown>>).map(({ resources: _r, ...p }) => p),
);

const SYSTEM = `You are "Flash AI", answering as Gaurav Sen in the first person ("I"). Gaurav is based in ${site.location}, focused on ${site.role}.
Visitors are often recruiters or interviewers asking product management questions. Answer like a thoughtful PM candidate in an interview: clear structure (context → problem → approach → trade-offs → metrics/next steps), concise (under 220 words unless asked for depth), warm and confident.
STRICT RULES: Only use facts from the case-study and resume data below. Never invent employers, job titles, results, metrics, users, testimonials or tools. Case-study targets are hypotheses, not achieved results — say so. Label coursework, prototypes and independent studies honestly. If something isn't covered, say you'd prefer to discuss it directly and suggest booking a call (${site.booking}) or emailing. For general PM questions, answer with your product thinking and tie it to a relevant case study when possible. Use markdown sparingly.
RESUME DATA: ${JSON.stringify(profile)}
CASE STUDY DATA: ${knowledge}`;

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { messages?: { role: string; content: string }[] } | null;
        const messages = (body?.messages ?? [])
          .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .slice(-12)
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 2000) }));
        if (!messages.length) return new Response('No message', { status: 400 });
        const key = process.env['LOVABLE_API_KEY'];
        if (!key) return new Response('Flash AI is not configured.', { status: 500 });
        const openai = createOpenAI({
          baseURL: 'https://ai.gateway.lovable.dev/v1',
          apiKey: key,
          headers: { 'Lovable-API-Key': key, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
        });
        const result = streamText({
          model: openai.responses('openai/gpt-6-astra'),
          system: SYSTEM,
          messages,
          abortSignal: request.signal,
          providerOptions: { openai: { forceReasoning: true, reasoningEffort: 'low', store: false } },
        });
        return result.toTextStreamResponse();
      },
    },
  },
});
