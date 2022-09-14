import { RefObject, useCallback, useEffect, useRef } from 'react';

import useDetector from './useDetector';

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
  const barcodeDetector = useDetector();

  const abortController = useRef<AbortController>();

  const sleep = useCallback(async (): Promise<NodeJS.Timeout> => {
    return await new Promise((resolve, reject) =>
      setTimeout((callback) => {
        if (abortController.current && abortController.current.signal.aborted) {
          return reject('aborted');
        }

        resolve(callback);
      }, interval)
    );
  }, [interval]);

  const start = useCallback(async (): Promise<Code[] | undefined> => {
    abortController.current = new AbortController();

    if (!camera.current) {
      return Promise.reject('Camera is not available');
    }

    // Detect the barcode in the picture.
    return barcodeDetector
      .detect(camera.current)
      .then((codes) => {
        if (abortController.current?.signal.aborted) {
          return Promise.reject('Scan aborted');
        }

        if (!codes.length) {
          return Promise.reject('No code found');
        }

        return codes as Code[];
      })
      .catch(() => {
        if (abortController.current?.signal.aborted) {
          return Promise.reject('Scan aborted');
        }

        // Sleep before retrying.
        return sleep().then(() => start());
      })
      .catch(() => {
        return undefined;
      });
  }, [camera, barcodeDetector, sleep]);

  const stop = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, [start, stop]);

  return {
    sleep,
    start,
    stop,
  };
}
