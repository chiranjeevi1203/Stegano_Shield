
export interface AnalysisResult {
  fileName: string;
  fileSize: string;
  fileType: string;
  imagePreviewUrl: string;
  classification: string; 
  explanation: string;
  entropy: number;
  metadata: { label: string; value: string | number }[];
}
