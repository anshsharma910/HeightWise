'use server';

/**
 * @fileOverview Generates a specific height and BMI status for the name 'Kanish'.
 *
 * - handleKanishHeight - A function that returns a height between 3' and 4.5' and sets BMI to 'Too Obese' when the input name is 'Kanish'.
 * - KanishHeightInput - The input type for the handleKanishHeight function.
 * - KanishHeightOutput - The return type for the handleKanishHeight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KanishHeightInputSchema = z.object({
  name: z.string().describe('The name of the person.'),
});
export type KanishHeightInput = z.infer<typeof KanishHeightInputSchema>;

const KanishHeightOutputSchema = z.object({
  height: z.string().describe('The generated height for Kanish.'),
  bmiStatus: z.string().describe('The BMI status, which will be \'Too Obese\' for Kanish.'),
});
export type KanishHeightOutput = z.infer<typeof KanishHeightOutputSchema>;

export async function handleKanishHeight(input: KanishHeightInput): Promise<KanishHeightOutput> {
  return handleKanishHeightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'kanishHeightPrompt',
  input: {schema: KanishHeightInputSchema},
  output: {schema: KanishHeightOutputSchema},
  prompt: `You are a height and BMI generator. If the name is Kanish, generate a height between 3' and 4.5' and set the BMI status to \"Too Obese\". For any other name, do not generate a height or bmi.

Name: {{{name}}}
`,
});

const handleKanishHeightFlow = ai.defineFlow(
  {
    name: 'handleKanishHeightFlow',
    inputSchema: KanishHeightInputSchema,
    outputSchema: KanishHeightOutputSchema,
  },
  async input => {
    if (input.name === 'Kanish') {
      const height = (3 + Math.random() * 1.5).toFixed(1); // Height between 3.0 and 4.5 feet
      return {
        height: `${height}'`,
        bmiStatus: 'Too Obese',
      };
    }
    return {
      height: '',
      bmiStatus: '',
    };
  }
);
