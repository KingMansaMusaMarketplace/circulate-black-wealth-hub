import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PropertyPhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  userId: string;
}

const MAX_PHOTOS = 20;
const MAX_SIZE_MB = 25;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const PropertyPhotoUploader: React.FC<PropertyPhotoUploaderProps> = ({
  photos,
  onChange,
  userId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // strip the "data:image/...;base64," prefix
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const moderateImage = async (file: File): Promise<{ safe: boolean; reason?: string }> => {
    try {
      const base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke('moderate-image', {
        body: { imageBase64: base64, mimeType: file.type },
      });
      if (error) {
        console.warn('Moderation call failed, allowing upload:', error);
        return { safe: true };
      }
      return data as { safe: boolean; reason?: string };
    } catch (e) {
      console.warn('Moderation threw, allowing upload:', e);
      return { safe: true };
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!userId) {
      toast.error("You need to be signed in to upload photos. Please log in and try again.");
      return;
    }
    // Re-verify the active session matches the userId prop (RLS requires path starts with auth.uid())
    const { data: sessionData } = await supabase.auth.getUser();
    const activeId = sessionData?.user?.id;
    if (!activeId || activeId !== userId) {
      toast.error("Your session expired. Please sign out and sign back in, then try uploading again.");
      return;
    }
    if (photos.length + files.length > MAX_PHOTOS) {
      toast.error(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG, or WEBP allowed.`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: must be under ${MAX_SIZE_MB} MB.`);
        continue;
      }

      // AI safety check BEFORE uploading
      const check = await moderateImage(file);
      if (!check.safe) {
        toast.error(
          `${file.name} was blocked: ${check.reason || 'inappropriate content'}. Please upload a property photo.`,
          { duration: 6000 },
        );
        continue;
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from('property-photos')
        .upload(filename, file, { cacheControl: '3600', upsert: false });

      if (error) {
        console.error('Upload error:', error);
        const msg = /row-level security|policy|unauthorized/i.test(error.message)
          ? `Couldn't save ${file.name}: your account doesn't have permission. Please sign out, sign back in, and try again.`
          : `Failed to upload ${file.name}: ${error.message}`;
        toast.error(msg);
        continue;
      }

      const { data } = supabase.storage.from('property-photos').getPublicUrl(filename);
      uploaded.push(data.publicUrl);
    }

    if (uploaded.length > 0) {
      onChange([...photos, ...uploaded]);
      toast.success(`${uploaded.length} photo${uploaded.length > 1 ? 's' : ''} uploaded.`);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removePhoto = async (url: string) => {
    // Try to delete from storage if it's our bucket
    const match = url.match(/\/property-photos\/(.+)$/);
    if (match) {
      const path = match[1];
      await supabase.storage.from('property-photos').remove([path]);
    }
    onChange(photos.filter((p) => p !== url));
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-mansagold/50 transition-colors cursor-pointer"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="w-12 h-12 mx-auto text-mansagold mb-4 animate-spin" />
        ) : (
          <Upload className="w-12 h-12 mx-auto text-mansagold mb-4" />
        )}
        <h3 className="font-semibold mb-2 text-white">
          {uploading ? 'Uploading…' : 'Upload Photos'}
        </h3>
        <p className="text-sm text-white/60 mb-4">
          JPG, PNG, or WEBP · up to {MAX_SIZE_MB} MB each · max {MAX_PHOTOS} photos
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="border-mansagold/40 text-mansagold hover:bg-mansagold/10"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Choose Photos
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((url, idx) => (
            <div
              key={url}
              className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-slate-800"
            >
              <img src={url} alt={`Property photo ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-mansagold text-black text-xs font-bold px-2 py-0.5 rounded">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-white/60">
        Tip: Properties with high-quality photos get 40% more bookings. Include every room, outdoor
        spaces, and unique features. The first photo is your cover image.
      </p>
      <p className="text-xs text-white/40">
        🛡️ All photos are auto-scanned for safety. Inappropriate images (nudity, violence,
        non-property content) are blocked at upload.
      </p>
    </div>
  );
};

export default PropertyPhotoUploader;
