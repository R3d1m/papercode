import { HandwrittenSample } from '../data/sampleHandwritten';

export interface OCRProgressEvent {
  step: 'preprocessing' | 'binarization' | 'line_detection' | 'syntax_correction' | 'done';
  percent: number;
  activeLineIndex?: number;
  message: string;
}

export function simulateOCRScan(
  sample: HandwrittenSample,
  onProgress: (evt: OCRProgressEvent) => void
): Promise<{ cleanedCode: string; confidence: number }> {
  return new Promise((resolve) => {
    onProgress({ step: 'preprocessing', percent: 15, message: 'Correcting angle & mobile camera perspective distortion...' });

    setTimeout(() => {
      onProgress({ step: 'binarization', percent: 35, message: 'Filtering notebook paper ruled blue lines and ink graphite...' });
      
      setTimeout(() => {
        onProgress({ step: 'line_detection', percent: 60, activeLineIndex: 1, message: 'Segmenting handwritten code characters and indentation blocks...' });

        setTimeout(() => {
          onProgress({ step: 'syntax_correction', percent: 88, message: 'Applying AST error-correction to indentation, colons & brackets...' });

          setTimeout(() => {
            onProgress({ step: 'done', percent: 100, message: 'Code cleanly extracted! Ready to execute in mobile IDE.' });
            resolve({
              cleanedCode: sample.rawCode,
              confidence: 96.8
            });
          }, 350);
        }, 400);
      }, 400);
    }, 350);
  });
}
