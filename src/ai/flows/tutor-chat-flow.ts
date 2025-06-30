
'use server';
/**
 * @fileOverview A flow for an AI tutor that helps users with programming challenges.
 *
 * - tutorChat - A function that acts as an AI programming tutor.
 * - TutorChatInput - The input type for the tutorChat function.
 * - TutorChatOutput - The return type for the tutorChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { ChatMessage } from '@/types';

// We don't need to define the full Challenge schema again for the AI,
// a simpler object is enough for the prompt context.
const ChallengeContextSchema = z.object({
  title: z.string(),
  description: z.string(),
  starterCode: z.string(),
  solutionHint: z.string().optional(),
});

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const TutorChatInputSchema = z.object({
  challenge: ChallengeContextSchema,
  question: z.string().describe("The user's latest question for the tutor."),
  history: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
});
export type TutorChatInput = z.infer<typeof TutorChatInputSchema>;

const TutorChatOutputSchema = z.string().describe("The tutor's response.");
export type TutorChatOutput = z.infer<typeof TutorChatOutputSchema>;

export async function tutorChat(input: TutorChatInput): Promise<TutorChatOutput> {
  return tutorChatFlow(input);
}

const tutorChatFlow = ai.defineFlow(
  {
    name: 'tutorChatFlow',
    inputSchema: TutorChatInputSchema,
    outputSchema: TutorChatOutputSchema,
  },
  async (input) => {
    const conversationHistory = input.history.length > 6 ? input.history.slice(-6) : input.history;

    const baseSystemPrompt = `You are an expert programming tutor for a platform called StreakCode. Your role is to help users solve a specific programming challenge by guiding them, not by giving them the answer.

**CHALLENGE CONTEXT:**
- **Title:** ${input.challenge.title}
- **Description:** ${input.challenge.description}
- **Starter Code:** \`\`\`python
${input.challenge.starterCode}\`\`\`
${input.challenge.solutionHint ? `- **Hint:** ${input.challenge.solutionHint}`: ''}

**CRITICAL RULES:**
1.  **GUIDE, DON'T SOLVE:** Never provide the full solution code. Instead, explain concepts, point out flaws in their logic, or ask leading questions to help the user think for themselves.
2.  **STAY ON TOPIC:** Only answer questions directly related to the provided programming challenge. If the user asks about something else, politely steer them back to the challenge.
3.  **LANGUAGE:** All your responses must be in Brazilian Portuguese.
4.  **TONE:** Be encouraging, patient, and concise.
`;

    // Flatten the history into a string to pass as part of the system prompt.
    // This is more robust than passing a complex object to the 'prompt' field.
    const historyText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Tutor'}: ${msg.content}`)
      .join('\n');
    
    const fullSystemPrompt = `${baseSystemPrompt}

Here is the conversation history so far. Use it to inform your next response.
${historyText}
`;

    const { text } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: fullSystemPrompt,
        prompt: input.question, // The main prompt is just the user's latest question.
        config: {
            safetySettings: [
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            ],
        },
    });

    return text || 'Desculpe, não consegui pensar em uma resposta. Você pode tentar reformular a pergunta?';
  }
);
