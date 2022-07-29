import { RefObject, useCallback, useEffect, useRef } from 'react';

import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill';

export interface Code {
  format: string;
  rawValue: string;
  orientation: number;
  quality: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  cornerPoints: [
    {
      x: number;
      y: number;
    },
    {
      x: number;
      y: number;
    },
    {
      x: number;
      y: number;
    },
    {
      x: number;
      y: number;
    }
  ];
}

export interface Scanner {
  start: () => Promise<Code[]>;
  stop: () => void;
  sleep: () => Promise<NodeJS.Timeout>;
}

export default function useScanner(camera: RefObject<HTMLVideoElement>, interval = 500): Scanner {
  const barcodeDetector = useRef<BarcodeDetectorPolyfill>();

  const abortController = useRef<AbortController>();

  const sleep = useCallback(async (): Promise<NodeJS.Timeout> => {
    if (abortController.current && abortController.current.signal.aborted) {
      alert('Scanning aborted');
      return Promise.reject('aborted');
    }

    return new Promise((resolve) => setTimeout(resolve, interval));
  }, [interval]);

  const start = useCallback(async (): Promise<Code[]> => {
    abortController.current = new AbortController();

    if (!camera.current || !barcodeDetector.current) {
      return Promise.reject('Camera is not available');
    }

    // Detect the barcode in the picture.
    return barcodeDetector.current
      .detect(camera.current)
      .then((barcodes) => {
        if (abortController.current && abortController.current.signal.aborted) {
          return Promise.reject('Scan aborted');
        }

        if (!barcodes.length) {
          return Promise.reject('No barcode found');
        }

        return barcodes as Code[];
      })
      .catch(() => {
        if (abortController.current && abortController.current.signal.aborted) {
          return Promise.reject('Scan aborted');
        }

        // Sleep before retrying.
        return sleep().then(() => start());
      });
  }, [camera, barcodeDetector, sleep]);

  const stop = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const configureDetector = useCallback(async () => {
    const formats = await BarcodeDetectorPolyfill.getSupportedFormats();

    barcodeDetector.current = new BarcodeDetectorPolyfill({
      formats: formats.filter((format) => format.match(/(^ean)|(^qr)/i)),
    });
  }, []);

  useEffect(() => {
    configureDetector().then(() => start());

    return () => {
      stop();
    };
  }, []);

  return {
    sleep,
    start,
    stop,
  };
}
