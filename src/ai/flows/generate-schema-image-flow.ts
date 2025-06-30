'use server';
/**
 * @fileOverview A flow for generating database schema images.
 *
 * - generateSchemaImage - A function that takes a schema description and returns an image data URI.
 * - GenerateSchemaImageInput - The input type for the generateSchemaImage function.
 * - GenerateSchemaImageOutput - The return type for the generateSchemaImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSchemaImageInputSchema = z.string().describe('A text description of the database schema, including tables, columns, types, and relationships.');
export type GenerateSchemaImageInput = z.infer<typeof GenerateSchemaImageInputSchema>;

const GenerateSchemaImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image of the database schema as a data URI."),
});
export type GenerateSchemaImageOutput = z.infer<typeof GenerateSchemaImageOutputSchema>;

export async function generateSchemaImage(input: GenerateSchemaImageInput): Promise<GenerateSchemaImageOutput> {
  return generateSchemaImageFlow(input);
}

const generateSchemaImageFlow = ai.defineFlow(
  {
    name: 'generateSchemaImageFlow',
    inputSchema: GenerateSchemaImageInputSchema,
    outputSchema: GenerateSchemaImageOutputSchema,
  },
  async (schemaDescription) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a clean, professional database schema diagram based on the following description. The diagram should be similar to an entity-relationship diagram (ERD). 
      
      - Use simple rectangular boxes for tables.
      - List column names and their data types within each box.
      - The background should be black (#000000) and the tables/text should be white or light gray.
      - Do not draw relationship lines between the tables, just display the tables themselves, spaced out nicely.
      - The image should be clear and easy to read.

      Schema Description:
      ---
      ${schemaDescription}
      ---
      `,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageDataUri: media.url };
  }
);
