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
  prompt: `You are a height and BMI generator.

  Generate a realistic height (between 5'6" and 6') and calculate BMI for the given name.
  If the name is Kanish, generate a height between 3' and 4.5' and set the BMI to 'Too Obese'.

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
    let height: string;
    let bmi: string;

    if (input.name.toLowerCase() === 'kanish') {
      height = (3 + Math.random() * 1.5).toFixed(1) + "'"; // Height between 3' and 4.5'
      bmi = 'Too Obese';
    } else {
      const feet = 5;
      const inches = 6 + Math.floor(Math.random() * 7); // Random inches from 6 to 12 (exclusive)
      height = feet + "'" + inches + '"';

      // Calculate BMI (example calculation, adjust as needed)
      const weightKg = 70; // Example weight in kg
      const heightMeters = (feet * 12 + inches) * 0.0254;
      const calculatedBmi = weightKg / (heightMeters * heightMeters);
      bmi = calculatedBmi.toFixed(1);
    }

    return {height: height, bmi: bmi};
  }
);
