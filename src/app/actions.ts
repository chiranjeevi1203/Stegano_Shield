'use server';
import { enhancePrompt, type EnhancePromptInput, type EnhancePromptOutput } from '@/ai/flows/enhance-prompt-for-malware-classification';

export async function getEnhancedPromptAction(input: EnhancePromptInput): Promise<EnhancePromptOutput> {
  try {
    // Add a small delay to simulate network latency for better UX feedback
    // await new Promise(resolve => setTimeout(resolve, 1500)); 
    const result = await enhancePrompt(input);
    if (!result || !result.enhancedPrompt) {
      throw new Error("AI failed to return an enhanced prompt.");
    }
    return result;
  } catch (error) {
    console.error("Error in getEnhancedPromptAction:", error);
    // It's better to throw a more specific error or a structured error object
    if (error instanceof Error) {
      throw new Error(`Failed to enhance prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while enhancing the prompt. Please try again.");
  }
}
