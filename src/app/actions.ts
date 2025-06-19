
'use server';
import { classifyImage, type ClassifyImageInput, type ClassifyImageOutput } from '@/ai/flows/classify-image-flow';

export async function classifyImageAction(input: ClassifyImageInput): Promise<ClassifyImageOutput> {
  try {
    const result = await classifyImage(input);
    if (!result || !result.classification || !result.explanation || typeof result.entropy !== 'number') {
      console.error("Error in classifyImageAction: AI returned incomplete analysis. Full result:", JSON.stringify(result));
      throw new Error("AI failed to return a complete analysis. Please check server logs on Vercel for more details.");
    }
    return result;
  } catch (error: any) {
    // Log the full error structure for better debugging on Vercel
    console.error("Full error in classifyImageAction:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

    let specificMessage = "An underlying error occurred during image analysis.";
    if (error.message) {
      specificMessage = error.message;
    }
    
    // Check for common Vercel/API key issues patterns in the error message
    if (typeof specificMessage === 'string' && (specificMessage.toLowerCase().includes("api key") || specificMessage.toLowerCase().includes("quota") || specificMessage.toLowerCase().includes("permission") || specificMessage.toLowerCase().includes("authentication"))) {
        specificMessage = `An API or permissions error occurred: ${specificMessage}. Please verify your Google AI API key and permissions in Vercel environment variables. Also, check Vercel server logs.`;
    } else {
        specificMessage = `Analysis failed: ${specificMessage}. Check Vercel server logs for more details (e.g., regarding API keys, model access, or other configurations).`;
    }
    
    throw new Error(specificMessage);
  }
}
