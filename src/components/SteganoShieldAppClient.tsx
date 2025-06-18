
'use client';

import { useState, useEffect, type FormEvent, useRef, type DragEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FileText, BarChart2, Info, AlertCircle, UploadCloud, ImageIcon, X } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { classifyImageAction } from '@/app/actions';

export default function SteganoShieldAppClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let objectUrl: string | null = null;
    if (imageFile) {
      objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
    } else {
      setImagePreviewUrl(null);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageFile]);

  const processFile = (file: File | null | undefined) => {
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 100MB.",
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
    setAnalysisResult(null); 
    setError(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
     if (fileInputRef.current) { // ensure input value is updated for consistency if needed
      const dataTransfer = new DataTransfer();
      if (file) dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearImageAndResults = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      const dataUri = await fileToDataUri(imageFile);
      const classificationResponse = await classifyImageAction({ photoDataUri: dataUri });
      
      const fileSizeInMB = (imageFile.size / (1024 * 1024)).toFixed(2);
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
        classification: classificationResponse.classification,
        explanation: classificationResponse.explanation,
        entropy: classificationResponse.entropy,
        metadata: metadata,
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
        <CardHeader className="bg-card">
          <CardTitle className="font-headline text-2xl flex items-center"><UploadCloud className="mr-3 h-7 w-7 text-primary" />Upload Image for Analysis</CardTitle>
          <CardDescription>Select or drag and drop an image file (up to 100MB) to analyze its properties for potential hidden data or malware artifacts.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="relative">
              <div
                className={cn(
                  "w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-6 transition-colors duration-200 ease-in-out group",
                  isDraggingOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/70 hover:bg-muted/50",
                  imageFile ? "border-primary bg-primary/5 cursor-default" : "cursor-pointer"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver} 
                onDragLeave={handleDragLeave}
                onClick={!imageFile ? triggerFileInput : undefined} 
                role={!imageFile ? "button" : undefined}
                tabIndex={!imageFile ? 0 : undefined}
                aria-label="Image upload drop zone"
              >
                <Input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden"
                  ref={fileInputRef}
                  aria-hidden="true"
                />
                {!imageFile && (
                  <>
                    <ImageIcon className={cn("h-16 w-16 mb-4 text-muted-foreground group-hover:text-primary/70")} aria-hidden="true" />
                    <p className="text-lg text-foreground">
                      Drag an image here or{' '}
                      <span className="font-semibold text-primary hover:underline">
                        upload a file
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Max 100MB. PNG, JPG, GIF.</p>
                  </>
                )}
                 {imagePreviewUrl && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image src={imagePreviewUrl} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" data-ai-hint="uploaded image" />
                  </div>
                )}
              </div>
              {imageFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 text-destructive hover:text-destructive/80 rounded-full z-10"
                    onClick={handleClearImageAndResults}
                    aria-label="Clear selected image"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
            </div>


            {imageFile && !imagePreviewUrl && (
              <div className="mt-6 text-center text-muted-foreground">Loading preview...</div>
            )}

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
              <h3 className="text-lg font-semibold mb-2 text-center pb-1 border-b border-border/70">Analyzed Image</h3>
              <Image src={analysisResult.imagePreviewUrl} alt={analysisResult.fileName} width={400} height={400} className="rounded-lg object-contain mx-auto max-h-[300px] shadow-md border" data-ai-hint="security data" />
              <div className="mt-4 text-sm space-y-1">
                <p><strong>File Name:</strong> {analysisResult.fileName}</p>
                <p><strong>File Size:</strong> {analysisResult.fileSize}</p>
                <p><strong>File Type:</strong> {analysisResult.fileType}</p>
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-border/70 flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Steganography & Malware Assessment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Card className="p-4 bg-card">
                        <p className="text-sm text-muted-foreground">Shannon Entropy</p>
                        <p className="text-2xl font-bold text-primary">{analysisResult.entropy.toFixed(2)}</p>
                    </Card>
                    <Card className="p-4 bg-card">
                        <p className="text-sm text-muted-foreground">Classification</p>
                        <p className={`text-2xl font-bold ${analysisResult.classification === 'Benign' ? 'text-success' : 'text-destructive'}`}>{analysisResult.classification}</p>
                    </Card>
                </div>
                 <Card className="mt-4 p-4 bg-card">
                    <p className="text-sm text-muted-foreground">Analyst Explanation</p>
                    <p className="text-md text-foreground mt-1">{analysisResult.explanation}</p>
                </Card>
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
                    {analysisResult.metadata?.map((meta, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{meta.label}</TableCell>
                        <TableCell>{meta.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
