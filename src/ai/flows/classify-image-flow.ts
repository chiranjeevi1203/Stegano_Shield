
'use server';
/**
 * @fileOverview A Genkit flow to classify an image for potential steganography or malware artifacts.
 *
 * - classifyImage - A function that handles the image classification process.
 * - ClassifyImageInput - The input type for the classifyImage function.
 * - ClassifyImageOutput - The return type for the classifyImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an image to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyImageInput = z.infer<typeof ClassifyImageInputSchema>;

const ClassifyImageOutputSchema = z.object({
  classification: z
    .string()
    .describe(
      'The classification of the image (e.g., "Benign", "Potential Steganography", "Suspected Malware Artifacts").'
    ),
  explanation: z
    .string()
    .describe('A brief explanation for the classification decision.'),
  entropy: z
    .number()
    .describe(
      'A simulated Shannon entropy score for the image data (typically between 0 and 8).'
    ),
});
export type ClassifyImageOutput = z.infer<typeof ClassifyImageOutputSchema>;

export async function classifyImage(input: ClassifyImageInput): Promise<ClassifyImageOutput> {
  return classifyImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyImagePrompt',
  input: {schema: ClassifyImageInputSchema},
  output: {schema: ClassifyImageOutputSchema},
  prompt: `You are an expert security analyst specializing in detecting steganography and visual malware artifacts in images.
Analyze the provided image and determine its classification.

Image to analyze: {{media url=photoDataUri}}

Based on your analysis of the image's visual patterns, textures, and any unusual data distributions (simulated):
1.  Provide a 'classification': "Benign" if it appears normal, "Potential Steganography" if you detect subtle anomalies indicative of hidden data, or "Suspected Malware Artifacts" if visual patterns resemble those seen in malware-as-image datasets.
2.  Provide a brief 'explanation' detailing the key visual characteristics that led to your classification.
3.  Estimate a plausible Shannon 'entropy' score for the image. Benign images usually have lower to moderate entropy (e.g., 4.0-7.5). Images with highly random data due to encryption or compression, or hidden data, might exhibit higher entropy (e.g., >7.5). Provide a value between 0.0 and 8.0.

Return ONLY the JSON object with the fields: classification, explanation, and entropy.
`,
});

const classifyImageFlow = ai.defineFlow(
  {
    name: 'classifyImageFlow',
    inputSchema: ClassifyImageInputSchema,
    outputSchema: ClassifyImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to provide a classification for the image.');
    }
    // Ensure entropy is a number, provide a default if LLM fails to generate a valid one.
    if (typeof output.entropy !== 'number' || isNaN(output.entropy)) {
        output.entropy = parseFloat((Math.random() * (7.9 - 6.5) + 6.5).toFixed(2)); // Fallback entropy
    } else {
        output.entropy = parseFloat(output.entropy.toFixed(2));
    }

    // Basic validation for classification
    const validClassifications = ["Benign", "Potential Steganography", "Suspected Malware Artifacts"];
    if (!validClassifications.includes(output.classification)) {
        output.classification = "Benign"; // Fallback classification
        output.explanation = "AI failed to provide a valid classification type. Defaulting to Benign.";
    }

    return output;
  }
);
