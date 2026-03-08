
'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating AI-powered conversation starters
 * for matched users in a dating app, based on shared interests and profile information.
 *
 * - generateConversationStarters - A function that triggers the AI to suggest conversation starters.
 * - AIConversationStarterInput - The input type for the generateConversationStarters function.
 * - AIConversationStarterOutput - The return type for the generateConversationStarters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileSchema = z.object({
  name: z.string().describe('The name of the user.'),
  bio: z.string().optional().describe('A short biography of the user.'),
  interests: z.array(z.string()).optional().describe('A list of interests for the user.'),
});

const AIConversationStarterInputSchema = z.object({
  currentUserProfile: UserProfileSchema.describe('The profile of the current user initiating the conversation.'),
  matchedUserProfile: UserProfileSchema.describe('The profile of the user they have matched with.'),
  sharedInterests: z.array(z.string()).describe('A list of interests that are common between the current user and the matched user.'),
});
export type AIConversationStarterInput = z.infer<typeof AIConversationStarterInputSchema>;

const AIConversationStarterOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3-5 unique, engaging, and personalized conversation starters.'),
});
export type AIConversationStarterOutput = z.infer<typeof AIConversationStarterOutputSchema>;

export async function generateConversationStarters(
  input: AIConversationStarterInput
): Promise<AIConversationStarterOutput> {
  return aiConversationStarterFlow(input);
}

const conversationStarterPrompt = ai.definePrompt({
  name: 'conversationStarterPrompt',
  input: {schema: AIConversationStarterInputSchema},
  output: {schema: AIConversationStarterOutputSchema},
  prompt: `You are an AI assistant for a dating app named Lunara, designed to help users start engaging conversations with their matches.
Your goal is to generate 3-5 unique, engaging, and personalized conversation starters based on the provided profiles and shared interests.
Make the suggestions friendly, intriguing, and easy to respond to. Avoid generic or overly personal questions. Focus on fostering a genuine connection.

Here is the information about the two matched users:

Current User:
Name: {{{currentUserProfile.name}}}
{{#if currentUserProfile.bio}}Bio: {{{currentUserProfile.bio}}}{{/if}}
{{#if currentUserProfile.interests}}Interests: {{#each currentUserProfile.interests}} - {{{this}}}
{{/each}}{{/if}}

Matched User:
Name: {{{matchedUserProfile.name}}}
{{#if matchedUserProfile.bio}}Bio: {{{matchedUserProfile.bio}}}{{/if}}
{{#if matchedUserProfile.interests}}Interests: {{#each matchedUserProfile.interests}} - {{{this}}}
{{/each}}{{/if}}

{{#if sharedInterests}}
Shared Interests: {{#each sharedInterests}} - {{{this}}}
{{/each}}
{{/if}}

Please generate 3-5 conversation starters as a JSON array of strings, for example:
{
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}
`,
});

const aiConversationStarterFlow = ai.defineFlow(
  {
    name: 'aiConversationStarterFlow',
    inputSchema: AIConversationStarterInputSchema,
    outputSchema: AIConversationStarterOutputSchema,
  },
  async (input) => {
    const {output} = await conversationStarterPrompt(input);
    return output!;
  }
);
