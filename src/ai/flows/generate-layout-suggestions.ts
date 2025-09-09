'use server';

/**
 * @fileOverview A layout suggestion AI agent.
 *
 * - generateLayoutSuggestions - A function that handles the layout suggestion process.
 * - GenerateLayoutSuggestionsInput - The input type for the generateLayoutSuggestions function.
 * - GenerateLayoutSuggestionsOutput - The return type for the generateLayoutSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLayoutSuggestionsInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired layout.'),
});
export type GenerateLayoutSuggestionsInput = z.infer<typeof GenerateLayoutSuggestionsInputSchema>;

const GenerateLayoutSuggestionsOutputSchema = z.object({
  layoutSuggestion: z.string().describe('An HTML layout suggestion based on the prompt.'),
});
export type GenerateLayoutSuggestionsOutput = z.infer<typeof GenerateLayoutSuggestionsOutputSchema>;

export async function generateLayoutSuggestions(input: GenerateLayoutSuggestionsInput): Promise<GenerateLayoutSuggestionsOutput> {
  return generateLayoutSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLayoutSuggestionsPrompt',
  input: {schema: GenerateLayoutSuggestionsInputSchema},
  output: {schema: GenerateLayoutSuggestionsOutputSchema},
  prompt: `You are an expert web designer. Your task is to generate clean, modern, and responsive HTML code for a web layout based on a given prompt.
The HTML should be self-contained and use Tailwind CSS classes for styling. Do not include any external stylesheets or JavaScript.
Ensure the layout is aesthetically pleasing and functional.

Prompt: {{{prompt}}}

Respond with only the raw HTML code for the layout. Do not include markdown or any other text.`,
});

const generateLayoutSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateLayoutSuggestionsFlow',
    inputSchema: GenerateLayoutSuggestionsInputSchema,
    outputSchema: GenerateLayoutSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
