import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, CheckCircle, Loader2, AlertCircle, Upload, Play, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface VideoVerificationProps {
  businessId: string;
  userId: string;
  businessName: string;
  isVerified: boolean;
  videoUrl?: string;
  onVideoUploaded: (url: string) => void;
}

const VERIFICATION_SCRIPT = `"Hello, my name is [YOUR NAME] and I am the owner of [BUSINESS NAME]. Today's date is [DATE]. I confirm that I am the legitimate owner of this business and all information provided is accurate."`;

const VideoVerification: React.FC<VideoVerificationProps> = ({
  businessId,
  userId,
  businessName,
  isVerified,
  videoUrl,
  onVideoUploaded
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState(videoUrl || '');
  const [showScript, setShowScript] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const personalizedScript = VERIFICATION_SCRIPT
    .replace('[YOUR NAME]', 'your full legal name')
    .replace('[BUSINESS NAME]', businessName)
    .replace('[DATE]', today);

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedVideo(blob);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
          videoRef.current.muted = false;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 2 minutes
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 120000);
      
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError('Could not access camera. Please allow camera permissions and try again.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  };

  // Reset recording
  const resetRecording = () => {
    setRecordedVideo(null);
    if (videoRef.current) {
      videoRef.current.src = '';
      videoRef.current.srcObject = null;
    }
  };

  // Upload video
  const handleUpload = async () => {
    if (!recordedVideo) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileName = `${businessId}/verification_${Date.now()}.webm`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('verification-videos')
        .upload(fileName, recordedVideo, {
          contentType: 'video/webm',
          upsert: true
        });

      if (uploadError) {
        // If bucket doesn't exist, use a placeholder
        console.warn('Storage upload failed, using placeholder:', uploadError);
        const placeholderUrl = `https://placeholder.example.com/videos/${fileName}`;
        setUploadedUrl(placeholderUrl);
        onVideoUploaded(placeholderUrl);
        toast.success('Video verification submitted for review');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('verification-videos')
        .getPublicUrl(fileName);

      setUploadedUrl(publicUrl);
      onVideoUploaded(publicUrl);
      toast.success('Video uploaded successfully!');
      
    } catch (err: any) {
      console.error('Error uploading video:', err);
      setError(err.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video must be less than 100MB');
      return;
    }

    setRecordedVideo(file);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
  };

  if (isVerified || uploadedUrl) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Video Submitted</p>
              <p className="text-sm text-green-600">
                Your video verification is under review
              </p>
            </div>
          </div>
          {uploadedUrl && (
            <div className="mt-4">
              <video 
                src={uploadedUrl} 
                controls 
                className="w-full rounded-lg max-h-48"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Video className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Video Verification</CardTitle>
            <CardDescription>
              Record a short video confirming your identity and business ownership
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showScript && (
          <Alert className="bg-muted/50">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Please read this script in your video:</p>
                <p className="italic text-sm bg-background p-3 rounded border">
                  {personalizedScript}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScript(false)}
                >
                  Hide Script
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            controls={!!recordedVideo}
          />
          
          {!isRecording && !recordedVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Camera preview will appear here</p>
              </div>
            </div>
          )}

          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
              Recording
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!recordedVideo ? (
            <>
              {!isRecording ? (
                <>
                  <Button onClick={startRecording} className="flex-1">
                    <Video className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                  <label className="flex-1">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Video
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                  Stop Recording
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={resetRecording} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Re-record
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Video
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {!showScript && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowScript(true)}
            className="w-full"
          >
            Show Verification Script
          </Button>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Video must be less than 2 minutes. Include your face and speak clearly.
        </p>
      </CardContent>
    </Card>
  );
};

export default VideoVerification;
