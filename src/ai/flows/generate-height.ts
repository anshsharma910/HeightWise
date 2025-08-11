'use server';

/**
 * @fileOverview Generates a realistic height based on the input name.
 *
 * - generateHeight - A function that generates a height.
 * - GenerateHeightInput - The input type for the generateHeight function.
 * - GenerateHeightOutput - The return type for the generateHeight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHeightInputSchema = z.object({
  name: z.string().describe('The name of the person.'),
});
export type GenerateHeightInput = z.infer<typeof GenerateHeightInputSchema>;

const GenerateHeightOutputSchema = z.object({
  height: z.string().describe('The generated height.'),
  bmi: z.string().describe('The calculated BMI.'),
});
export type GenerateHeightOutput = z.infer<typeof GenerateHeightOutputSchema>;

export async function generateHeight(input: GenerateHeightInput): Promise<GenerateHeightOutput> {
  return generateHeightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHeightPrompt',
  input: {schema: GenerateHeightInputSchema},
  output: {schema: GenerateHeightOutputSchema},
  prompt: `You are a height and BMI generator. Your primary audience is in India.

  When given a name, first infer if it is more likely a male or female name.
  - For names that are likely male, generate a realistic height between 5'5" and 6'0".
  - For names that are likely female, generate a realistic height between 5'0" and 5'7".

  Then, calculate a healthy BMI based on that height.

  However, if the name contains 'Kanish' (regardless of spelling or casing), you MUST generate a height between 3'0" and 4'5" and set the BMI to 'Too Obese'.

  Name: {{{name}}}
`,
});

const generateHeightFlow = ai.defineFlow(
  {
    name: 'generateHeightFlow',
    inputSchema: GenerateHeightInputSchema,
    outputSchema: GenerateHeightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
