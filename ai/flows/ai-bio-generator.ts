
'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating a dating profile biography.
 *
 * - generateAIBio - A function that handles the AI-powered biography generation process.
 * - AIBioGeneratorInput - The input type for the generateAIBio function.
 * - AIBioGeneratorOutput - The return type for the generateAIBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIBioGeneratorInputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('A list of keywords or themes to include in the bio.'),
  interests: z
    .array(z.string())
    .describe('A list of user interests to incorporate into the bio.'),
  bioLength: z
    .enum(['short', 'medium', 'long'])
    .describe('The desired length of the generated biography (short, medium, or long).'),
});
export type AIBioGeneratorInput = z.infer<typeof AIBioGeneratorInputSchema>;

const AIBioGeneratorOutputSchema = z.object({
  generatedBio: z.string().describe('The AI-generated dating profile biography.'),
});
export type AIBioGeneratorOutput = z.infer<typeof AIBioGeneratorOutputSchema>;

export async function generateAIBio(
  input: AIBioGeneratorInput
): Promise<AIBioGeneratorOutput> {
  return aiBioGeneratorFlow(input);
}

const aiBioGeneratorPrompt = ai.definePrompt({
  name: 'aiBioGeneratorPrompt',
  input: {schema: AIBioGeneratorInputSchema},
  output: {schema: AIBioGeneratorOutputSchema},
  prompt: `You are a professional dating profile writer. Your goal is to create an engaging and appealing dating profile biography based on the provided keywords and interests. Make it sound genuine and attractive, tailored for a dating app called Lunara.

Here are some details about the user:
Keywords: {{#each keywords}}- {{{this}}}\n{{/each}}
Interests: {{#each interests}}- {{{this}}}\n{{/each}}
Desired Length: {{{bioLength}}}

Please generate a compelling dating profile biography.`,
});

const aiBioGeneratorFlow = ai.defineFlow(
  {
    name: 'aiBioGeneratorFlow',
    inputSchema: AIBioGeneratorInputSchema,
    outputSchema: AIBioGeneratorOutputSchema,
  },
  async input => {
    const {output} = await aiBioGeneratorPrompt(input);
    return output!;
  }
);
