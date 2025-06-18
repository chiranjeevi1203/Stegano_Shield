
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, UploadCloud, FileText, BarChart2, Info, AlertCircle } from 'lucide-react';
// import { getEnhancedPromptAction } from '@/app/actions'; // Removed as prompts are removed
// import type { EnhancePromptInput } from '@/ai/flows/enhance-prompt-for-malware-classification'; // Removed
import type { AnalysisResult } from '@/types';
import { useToast } from "@/hooks/use-toast";

export default function SteganoShieldAppClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  // Removed originalPrompt and enhancementInstructions states
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a valid image file (e.g., PNG, JPG, GIF).",
        });
        return;
      }
      setImageFile(file);
      setAnalysisResult(null); // Reset previous results
      setError(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!imageFile) {
      setError("Please select an image file.");
      toast({ variant: "destructive", title: "Error", description: "Please select an image file." });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // const aiInput: EnhancePromptInput = { originalPrompt, enhancementInstructions }; // Removed
      // const aiOutput = await getEnhancedPromptAction(aiInput); // Removed

      // Mock other analysis data
      const fileSizeInMB = (imageFile.size / (1024 * 1024)).toFixed(2);
      const entropy = parseFloat((Math.random() * (7.9 - 6.5) + 6.5).toFixed(2)); // Typical range for images
      const classification = Math.random() > 0.6 ? 'Potential Steganography' : 'Benign';
      
      const metadata = [
        { label: "Dimensions", value: imagePreviewUrl ? await getImageDimensions(imagePreviewUrl) : "N/A" },
        { label: "Color Depth", value: "24-bit (mocked)" },
        { label: "Compression Type", value: "Lossless (mocked)" },
      ];
      
      setAnalysisResult({
        fileName: imageFile.name,
        fileSize: `${fileSizeInMB} MB`,
        fileType: imageFile.type,
        imagePreviewUrl: imagePreviewUrl!,
        mockedEntropy: entropy,
        mockedMetadata: metadata,
        mockedClassification: classification,
        // enhancedPrompt: aiOutput.enhancedPrompt, // Removed
      });

    } catch (e: any) {
      const errorMessage = e.message || "An unknown error occurred during analysis.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImageDimensions = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => resolve(`${img.naturalWidth}x${img.naturalHeight}`);
      img.onerror = () => resolve("N/A");
      img.src = url;
    });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-secondary/50">
          <CardTitle className="font-headline text-2xl flex items-center"><UploadCloud className="mr-2 h-6 w-6 text-primary" />Upload Image for Analysis</CardTitle>
          <CardDescription>Select an image file to analyze for potential steganography.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Label htmlFor="image-upload" className="text-xl font-medium sr-only">Upload Image</Label>
              <div className="w-full max-w-lg flex flex-col items-center">
                <Input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="w-full h-16 text-lg p-4 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                  aria-describedby="image-upload-hint" 
                />
                <p id="image-upload-hint" className="text-sm text-muted-foreground mt-2">Max 5MB. Supported formats: PNG, JPG, GIF.</p>
              </div>
              {imagePreviewUrl && (
                <div className="mt-6 border rounded-lg p-4 bg-card w-full max-w-lg">
                  <p className="text-base font-medium mb-3 text-center">Image Preview:</p>
                  <Image src={imagePreviewUrl} alt="Image preview" width={400} height={400} className="rounded-md object-contain mx-auto max-h-[350px] shadow-sm" data-ai-hint="abstract geometric" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/50 p-6 flex justify-center">
            <Button type="submit" disabled={isLoading || !imageFile} className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 px-8">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
                </>
              ) : (
                "Start Analysis"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && !isLoading && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && !isLoading && (
        <Card className="shadow-xl mt-8 overflow-hidden">
          <CardHeader className="bg-secondary/50">
            <CardTitle className="font-headline text-2xl flex items-center"><FileText className="mr-2 h-6 w-6 text-primary" />Analysis Results</CardTitle>
            <CardDescription>Detailed report of the image analysis.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-2 text-center">Analyzed Image</h3>
              <Image src={analysisResult.imagePreviewUrl} alt={analysisResult.fileName} width={400} height={400} className="rounded-lg object-contain mx-auto max-h-[400px] shadow-md border" data-ai-hint="security data" />
              <div className="mt-4 text-sm space-y-1">
                <p><strong>File Name:</strong> {analysisResult.fileName}</p>
                <p><strong>File Size:</strong> {analysisResult.fileSize}</p>
                <p><strong>File Type:</strong> {analysisResult.fileType}</p>
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-border/70 flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Steganography Assessment (Mocked)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Card className="p-4 bg-card">
                        <p className="text-sm text-muted-foreground">Shannon Entropy</p>
                        <p className="text-2xl font-bold text-primary">{analysisResult.mockedEntropy}</p>
                    </Card>
                    <Card className="p-4 bg-card">
                        <p className="text-sm text-muted-foreground">Classification</p>
                        <p className={`text-2xl font-bold ${analysisResult.mockedClassification === 'Benign' ? 'text-success' : 'text-destructive'}`}>{analysisResult.mockedClassification}</p>
                    </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-border/70 flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />Image Metadata (Mocked)</h3>
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Property</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.mockedMetadata?.map((meta, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{meta.label}</TableCell>
                        <TableCell>{meta.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Removed Enhanced AI Prompt section */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
