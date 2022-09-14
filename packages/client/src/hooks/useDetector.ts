import { useMemo, useRef } from 'react';

import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill';

export default function useDetector(): BarcodeDetectorPolyfill {
  const detector = useRef<BarcodeDetectorPolyfill>(new BarcodeDetectorPolyfill());

  return useMemo(() => detector.current, []);
}
