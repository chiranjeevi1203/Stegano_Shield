export interface AnalysisResult {
  fileName: string;
  fileSize: string;
  fileType: string;
  imagePreviewUrl: string;
  mockedEntropy?: number;
  mockedMetadata?: { label: string; value: string | number }[];
  mockedClassification?: 'Benign' | 'Potential Steganography';
  // enhancedPrompt?: string; // Removed this field
}
