
'use server';
/**
 * @fileOverview A flow for generating custom programming challenges.
 *
 * - generateChallenge - A function that takes user preferences and returns a complete challenge object.
 * - GenerateChallengeInput - The input type for the generateChallenge function.
 * - GenerateChallengeOutput - The return type for the generateChallenge function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TestCaseSchema = z.object({
    input: z.array(z.string()).describe('An array of inputs for the function. Each argument must be represented as a string. For example, for inputs (5, ["a"]), the array should be ["5", "[\\"a\\"]"].'),
    expected: z.string().describe('The expected output for the given input, represented as a string. For example, for a boolean `true`, use `"true"`. For a number `123`, use `"123"`.')
});

const ExampleSchema = z.object({
    input: z.string().describe('A string representing an example input for the user.'),
    output: z.string().describe('A string representing the corresponding example output.')
});

const GenerateChallengeInputSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(['python']), // For now, only python
  topic: z.string().optional().describe('An optional topic or theme for the challenge, like "string manipulation" or "dynamic programming".'),
  existingTitles: z.array(z.string()).optional().describe('A list of challenge titles that have already been generated, to avoid duplication.')
});
export type GenerateChallengeInput = z.infer<typeof GenerateChallengeInputSchema>;

const GenerateChallengeOutputSchema = z.object({
    id: z.string().describe("A unique placeholder ID for the challenge, e.g., 'custom-python-12345'. This will be overwritten."),
    numericId: z.number().describe('A unique numeric ID. For custom challenges, this can be a large random number > 1000.'),
    type: z.enum(['python']).describe("The challenge language, which must be 'python'."),
    title: z.string().describe('A short, descriptive title for the challenge in Brazilian Portuguese.'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    description: z.string().describe('A clear, didactic, and concise description of the challenge in Brazilian Portuguese. Make it engaging, maybe with a small story or real-world context.'),
    starterCode: z.string().describe('A string containing the starter code for the user, including a comment placeholder like "# Seu código aqui".'),
    starterFunctionName: z.string().describe('The name of the function the user needs to complete.'),
    testCases: z.array(TestCaseSchema).min(3).describe('An array of at least 3 diverse test cases to validate the user\'s solution.'),
    solution: z.string().describe('The complete, correct solution code in Python.'),
    solutionHint: z.string().describe('A short, helpful hint for the user in Brazilian Portuguese.'),
    example: ExampleSchema.describe('A simple example of an input and its expected output to guide the user.'),
    explanation: z.string().describe('A detailed, human-like, and didactic explanation in Brazilian Portuguese. It should start with the reasoning (like a teacher would), then the tools/code, explain the code step-by-step, and finally discuss common wrong approaches and why they are wrong in a clear, pedagogical way. Use Markdown for formatting, including ```python code blocks.')
});
export type GenerateChallengeOutput = z.infer<typeof GenerateChallengeOutputSchema>;

export async function generateChallenge(input: GenerateChallengeInput): Promise<GenerateChallengeOutput> {
  return generateChallengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChallengePrompt',
  input: { schema: GenerateChallengeInputSchema },
  output: { schema: GenerateChallengeOutputSchema },
  prompt: `You are an expert programming challenge creator for a platform called StreakCode. Your task is to generate a new, high-quality programming challenge based on the user's request. The entire output MUST be in Brazilian Portuguese and formatted as a single JSON object that strictly follows the provided output schema.

  **DIFFICULTY GUIDELINES:**
  - **easy**: Suitable for beginners. Should cover fundamental concepts like basic loops, conditionals, and operations on lists or strings. The solution should be straightforward.
  - **medium**: Requires knowledge of common data structures (dictionaries, sets) or simple algorithms. The problem may require multiple steps or a bit more logical thinking.
  - **hard**: Involves more complex algorithms (e.g., dynamic programming, graph traversals, sliding window), requires deep understanding of data structures, or has tricky edge cases that need careful handling.

  User Request:
  - Language: {{{language}}}
  - Difficulty: {{{difficulty}}}
  {{#if topic}}- Topic: {{{topic}}}{{/if}}

  {{#if existingTitles}}
  **IMPORTANT - AVOID DUPLICATION:** Do not create a challenge that is the same as or very similar to any of the following already existing titles:
  {{#each existingTitles}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  **CRITICAL INSTRUCTIONS:**

  1.  **JSON Structure:** The output must be a single, valid JSON object matching the output schema. Do not add any text before or after the JSON object.
  2.  **Language:** All text content (title, description, explanation, hint, etc.) must be in Brazilian Portuguese.
  3.  **Unique IDs:** Generate a unique string for \`id\` like 'custom-python-...' and a random numericId > 1000.
  4.  **Content Quality:** The challenge must be interesting and well-defined. The description and explanation are the most important parts.
      *   **\`description\`**: Make it very clear and didactic. If possible, frame it with a small, engaging story or a real-world problem.
      *   **\`explanation\`**: This needs to be exceptionally good, like a mini-tutorial. Follow this structure precisely:
          *   **Raciocínio:** Start by explaining the core logic and thinking process to solve the problem, as if you were a teacher.
          *   **Código e Ferramentas:** Describe the language features or tools that will be used.
          *   **Code Block:** Provide the solution code inside a Markdown block (\`\`\`python ... \`\`\`).
          *   **Abordagens Erradas Comuns:** Discuss common pitfalls or incorrect solutions and explain clearly why they are wrong. This is very important for learning.
  5.  **Test Cases:** Provide at least 3 diverse test cases, including edge cases. All values inside the 'input' array and the 'expected' field must be STRINGS. If the value is complex (like a list or boolean), serialize it to a string (e.g., "true", "[1, 2, 3]").

  Generate the challenge now.
  `,
});

function createSlug(title: string, numericId: number): string {
    const slugBase = title
        .toLowerCase()
        // Handle Brazilian Portuguese characters
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        // Remove invalid characters
        .replace(/[^\w\s-]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/--+/g, '-');
    
    return `${slugBase}-${numericId}`;
}


const generateChallengeFlow = ai.defineFlow(
  {
    name: 'generateChallengeFlow',
    inputSchema: GenerateChallengeInputSchema,
    outputSchema: GenerateChallengeOutputSchema,
  },
  async (input) => {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const { output } = await prompt(input);
        
        if (output) {
          // Override the ID with a slug-based one for cleaner URLs
          output.id = `custom-${createSlug(output.title, output.numericId)}`;
          return output;
        }

        console.warn(`Attempt ${attempt} of ${maxAttempts} to generate challenge failed: AI returned null or invalid output.`);

      } catch (error) {
        console.error(`Attempt ${attempt} of ${maxAttempts} failed with error:`, error);
        if (attempt === maxAttempts) {
          // On the last attempt, re-throw the error to be caught by the client.
          throw new Error(`Failed to generate challenge after ${maxAttempts} attempts. Last error: ${error}`);
        }
      }
    }
    // This line should be unreachable if the loop logic is correct, but as a fallback:
    throw new Error(`Failed to generate challenge after ${maxAttempts} attempts.`);
  }
);
