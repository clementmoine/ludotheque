import { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';

import useScanner from 'hooks/useScanner';

import type { Code } from 'hooks/useScanner';

export interface CameraProps {
  className?: string;
  onClose?: () => void;
  onScan?: (codes: Code[]) => void;
}

export interface CameraRef {
  start: () => void;
  stop: () => void;
  next: () => void;
  isAvailable: boolean;
  element: HTMLVideoElement | null;
}

const Camera = forwardRef<CameraRef, CameraProps>((props, ref) => {
  const { className, onClose, onScan } = props;

  const videoRef = useRef<HTMLVideoElement>(null);

  const source = useRef<string>();

  const scanner = useScanner(videoRef);

  // Check if the browser supports the getUserMedia API
  const isAvailable = useMemo(
    () => navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function',
    []
  );

  // Start the video stream.
  const start = useCallback(
    (deviceId?: string) => {
      if (!isAvailable) {
        return;
      }

      // Destroy the old stream if it exists.
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Contraints the video stream.
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      // Get the asked device if it exists or the default environment device when available.
      const constraints = deviceId
        ? { video: { deviceId: { exact: deviceId } } }
        : {
            video: {
              facingMode: 'environment',
            },
            audio: false,
          };

      navigator.mediaDevices.getUserMedia(constraints).then((stream: MediaStream) => {
        // Keep the stream deviceId source.
        source.current = stream.getVideoTracks()[0].getSettings().deviceId;

        if (videoRef.current) {
          // Attributes for the video element.
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          videoRef.current.playsInline = true;

          // Set the stream to the video element.
          videoRef.current.srcObject = stream;

          // When the video is loaded, start the scanner.
          videoRef.current.onloadedmetadata = () => {
            scanner.start().then((codes) => {
              if (onScan) onScan(codes);
            });
          };
        }
      });
    },
    [isAvailable, onScan, scanner]
  );

  // Stop the video stream.
  const stop = useCallback(() => {
    scanner.stop();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (onClose) onClose();
  }, []);

  // Switch to the next camera.
  const next = useCallback(() => {
    if (!isAvailable) {
      return;
    }

    // Get the list of available devices.
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      // List of available video input devices.
      const deviceIds = devices.reduce((acc, device) => {
        if (device.kind === 'videoinput') {
          acc.push(device.deviceId);
        }

        return acc;
      }, [] as string[]);

      // Check there is another camera to switch to.
      // If the current deviceId is the last one, switch to the first one.
      if (source.current && deviceIds.length > 1) {
        source.current = deviceIds[(deviceIds.indexOf(source.current) + 1) % deviceIds.length];

        start(source.current);
      }
    });
  }, [start, isAvailable]);

  // Start the video stream when the component is mounted.
  useLayoutEffect(() => {
    start();

    return () => {
      stop();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    start,
    stop,
    next,
    isAvailable,
    element: videoRef.current,
  }));

  if (!isAvailable) {
    return null;
  }

  return <video className={className} ref={videoRef} muted autoPlay playsInline onDoubleClick={next} />;
});

Camera.displayName = 'Camera';

export default Camera;
