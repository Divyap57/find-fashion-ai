import { useState, useRef, useCallback } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
}

export const WebcamCapture = ({ onCapture }: WebcamCaptureProps) => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsActive(true);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        onCapture(imageData);
        stopWebcam();
      }
    }
  }, [onCapture, stopWebcam]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!isActive ? (
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
            <Camera className="w-12 h-12 text-accent" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Take a Photo</p>
            <p className="text-muted-foreground text-sm mb-4">
              Use your camera to search for fashion items
            </p>
          </div>
          <Button variant="accent" size="lg" onClick={startWebcam}>
            <Camera className="w-5 h-5 mr-2" />
            Open Camera
          </Button>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto"
          />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
            <Button
              variant="destructive"
              size="icon"
              className="w-14 h-14 rounded-full"
              onClick={stopWebcam}
            >
              <X className="w-6 h-6" />
            </Button>
            <Button
              variant="hero"
              size="icon"
              className="w-16 h-16 rounded-full"
              onClick={captureImage}
            >
              <Camera className="w-8 h-8" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
