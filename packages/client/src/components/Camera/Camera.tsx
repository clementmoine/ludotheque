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
      const initialConstraints = deviceId
        ? // Ask an exact deviceId
          { video: { deviceId: { exact: deviceId } }, audio: false }
        : {
            // Ask a device
            video: {
              width: 100,
              height: 100,
              frameRate: { min: 8, max: 60 },
              facingMode: 'environment',
            },
            audio: false,
          };

      navigator.mediaDevices.getUserMedia(initialConstraints).then((stream: MediaStream) => {
        // Get the track from current stream
        const track = stream.getTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        // Get device capabilities
        const capabilities = track.getCapabilities();

        // Ideal constraints for the device
        const idealConstraints: Partial<Record<keyof MediaTrackConstraints, number>> = {
          frameRate: 120,
          height: 4096,
          width: 4096,
        };

        // Get the optimal device constraints from device capability against ideal constraints
        const optimalConstraints = (
          Object.keys(idealConstraints) as Array<keyof MediaTrackConstraints>
        ).reduce((acc, constraintName) => {
          if (constraintName in capabilities) {
            const idealValue = idealConstraints[constraintName];
            const capability = capabilities[constraintName as keyof MediaTrackCapabilities];

            if (
              capability &&
              idealValue &&
              typeof capability !== 'string' &&
              typeof capability !== 'boolean' &&
              'min' in capability &&
              'max' in capability &&
              capability.min &&
              capability.max
            ) {
              acc[constraintName] = Math.max(capability.min, Math.min(capability.max, idealValue)) as any;
            }
          }

          return acc;
        }, track.getConstraints());

        // Apply optimal constraints
        track.applyConstraints(optimalConstraints);

        // Keep the stream deviceId source.
        source.current = videoTrack.getSettings().deviceId;

        if (videoRef.current) {
          // Attributes for the video element.
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          videoRef.current.playsInline = true;

          // Set the stream to the video element.
          videoRef.current.srcObject = stream;

          // When the video is loaded, start the scanner.
          scanner.start().then((codes) => {
            if (onScan) onScan(codes);
          });
        }
      });
    },
    [isAvailable, onScan, scanner]
  );

  // Stop the video stream.
  const stop = useCallback(() => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks() || [];

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
    }

    scanner.stop();

    if (onClose) onClose();
  }, [onClose, scanner]);

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
