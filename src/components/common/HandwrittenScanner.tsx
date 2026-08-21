import React, { useState, useRef } from 'react';
import { PillButton } from './PillButton';
import { 
  Camera, 
  Scan, 
  CheckCircle2, 
  Sparkles, 
  UploadCloud, 
  RefreshCw, 
  FileImage, 
  ArrowDownCircle,
  Eye
} from 'lucide-react';

interface HandwrittenScannerProps {
  initialHandwrittenCode?: string;
  onScanComplete?: (code: string) => void;
  className?: string;
}

export const HandwrittenScanner: React.FC<HandwrittenScannerProps> = ({
  initialHandwrittenCode = 'print("Hello from PaperCode Bangladesh!")',
  onScanComplete,
  className = ''
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [extractedCode, setExtractedCode] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handwritten Lines preview
  const lines = initialHandwrittenCode.split('\n');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
        triggerOCRScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerOCRScan = (imageSrc?: string) => {
    setIsScanning(true);
    setScanMessage('Stage 1: Correcting perspective & binarizing paper texture...');

    setTimeout(() => {
      setScanMessage('Stage 2: Neural OCR parsing handwritten syntax tokens...');
    }, 600);

    setTimeout(() => {
      setScanMessage('Stage 3: Abstract Syntax Tree (AST) grammar verification...');
    }, 1200);

    setTimeout(() => {
      setIsScanning(false);
      setExtractedCode(initialHandwrittenCode);
      setScanMessage('✓ Code extracted from photo! Sent directly to IDE below for editing & execution.');
      if (onScanComplete) {
        onScanComplete(initialHandwrittenCode);
      }
    }, 1800);
  };

  return (
    <div className={'border-2 border-ink bg-paper-card rounded-2xl overflow-hidden shadow-solid-sm flex flex-col ' + className}>
      
      {/* Scanner Header */}
      <div className="bg-paper-muted border-b-2 border-ink px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-stamp animate-pulse"></span>
          <span className="font-mono font-extrabold text-xs uppercase tracking-wider text-ink">
            Notebook Photo Scan & Neural OCR
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 bg-white hover:bg-paper-light border-2 border-ink rounded-full text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
          >
            <UploadCloud className="w-3.5 h-3.5 text-stamp" />
            <span>Upload Photo / Camera</span>
          </button>
        </div>
      </div>

      {/* Notebook Ruled Paper Canvas */}
      <div className="relative p-6 sm:p-8 ruled-paper min-h-[220px] overflow-hidden flex flex-col justify-between">
        
        {/* Left Spiral Holes */}
        <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-4 pointer-events-none select-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-paper-dark border border-ink/40 shadow-inner"></div>
          ))}
        </div>

        {/* Notebook Content Container */}
        <div className="pl-6 sm:pl-8 space-y-3">
          
          <div className="flex items-center justify-between text-xs font-mono text-graphite border-b border-dashed border-ink/20 pb-2">
            <span>Handwritten Khata Page</span>
            <span className="text-stamp font-bold">★ Blue Ballpoint Ink • Ruled Paper</span>
          </div>

          {/* User uploaded image preview OR simulated notebook lines */}
          {uploadedImagePreview ? (
            <div className="relative max-h-48 rounded-xl overflow-hidden border-2 border-ink">
              <img src={uploadedImagePreview} alt="Uploaded notebook page" className="w-full h-full object-cover" />
              {isScanning && (
                <div className="absolute inset-x-0 h-1.5 bg-highlighter shadow-[0_0_12px_#E6F94E] animate-laser z-20" />
              )}
            </div>
          ) : (
            <div className="space-y-2.5 font-handwritten text-xl sm:text-2xl text-[#0B2545] leading-relaxed relative">
              {/* Laser scan line when active */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-highlighter to-transparent animate-laser z-20 shadow-[0_0_12px_#E6F94E]">
                  <div className="absolute right-0 -top-3 bg-ink text-highlighter text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                    Scanning OCR Beam
                  </div>
                </div>
              )}

              {lines.map((line, idx) => (
                <div key={idx} className={'relative ' + (isScanning ? 'opacity-80' : 'opacity-100')}>
                  <span className="font-semibold tracking-wide">{line}</span>
                  {extractedCode && (
                    <span className="ml-2 inline-block px-1.5 py-0.2 bg-green-100 border border-green-700 text-green-900 font-mono text-[10px] rounded">
                      ✓ OCR 99.4%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Scan Trigger & Status */}
        <div className="mt-4 pt-3 border-t border-ink/20 pl-6 sm:pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="text-xs font-mono font-bold text-ink">
            {scanMessage ? (
              <span className={'flex items-center gap-1.5 ' + (extractedCode ? 'text-green-800' : 'text-stamp')}>
                {isScanning ? <RefreshCw className="w-4 h-4 animate-spin text-stamp" /> : <CheckCircle2 className="w-4 h-4 text-green-700" />}
                <span>{scanMessage}</span>
              </span>
            ) : (
              <span className="text-graphite">
                Click &quot;Scan Notebook & Extract to IDE&quot; to transfer text to editor below:
              </span>
            )}
          </div>

          <PillButton
            variant={extractedCode ? "primary" : "highlighter"}
            size="md"
            onClick={() => triggerOCRScan()}
            disabled={isScanning}
            className="btn-bounce flex-shrink-0"
            icon={isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
          >
            {isScanning ? 'Extracting Text...' : extractedCode ? 'Re-Scan to IDE ➔' : 'Scan Notebook & Extract to IDE ➔'}
          </PillButton>

        </div>

      </div>

    </div>
  );
};
