
'use server';
import { classifyImage, type ClassifyImageInput, type ClassifyImageOutput } from '@/ai/flows/classify-image-flow';

export async function classifyImageAction(input: ClassifyImageInput): Promise<ClassifyImageOutput> {
  try {
    const result = await classifyImage(input);
    if (!result || !result.classification || !result.explanation || typeof result.entropy !== 'number') {
      throw new Error("AI failed to return a complete analysis.");
    }
    return result;
  } catch (error) {
    console.error("Error in classifyImageAction:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to classify image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while classifying the image. Please try again.");
  }
}
