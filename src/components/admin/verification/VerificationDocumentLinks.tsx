import React, { useEffect, useState } from 'react';
import { FileText, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  VERIFICATION_DOC_BUCKET,
  VERIFICATION_DOC_LINK_SECONDS,
  isStoredVerificationPath,
} from '@/lib/verification/documents';

const DOCS = [
  { key: 'identity_document_url', label: 'Government ID' },
  { key: 'registration_document_url', label: 'Business Registration' },
  { key: 'ownership_document_url', label: 'Ownership Proof' },
  { key: 'address_document_url', label: 'Address Verification' },
  { key: 'business_license_url', label: 'Business License' },
] as const;

type DocKey = (typeof DOCS)[number]['key'];

/** Shows only paperwork the owner actually uploaded; each click opens a 5-minute private link. */
const VerificationDocumentLinks: React.FC<{ verificationId: string }> = ({ verificationId }) => {
  const [paths, setPaths] = useState<Partial<Record<DocKey, string | null>> | null>(null);
  const [opening, setOpening] = useState<DocKey | null>(null);

  useEffect(() => {
    let active = true;
    setPaths(null);
    supabase
      .from('business_verifications')
      .select(DOCS.map((d) => d.key).join(', '))
      .eq('id', verificationId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error('Could not load verification documents:', error);
        setPaths((data as Partial<Record<DocKey, string | null>>) ?? {});
      });
    return () => {
      active = false;
    };
  }, [verificationId]);

  const openDoc = async (key: DocKey) => {
    const path = paths?.[key];
    if (!isStoredVerificationPath(path)) return;
    // Open the tab during the click so browsers don't block it, then point it at the private link.
    const tab = window.open('', '_blank');
    if (tab) tab.opener = null;
    setOpening(key);
    const { data, error } = await supabase.storage
      .from(VERIFICATION_DOC_BUCKET)
      .createSignedUrl(path, VERIFICATION_DOC_LINK_SECONDS);
    setOpening(null);
    if (error || !data?.signedUrl) {
      tab?.close();
      toast.error('Could not open this document. Please try again.');
      return;
    }
    if (tab) tab.location.href = data.signedUrl;
    else window.location.assign(data.signedUrl);
  };

  if (!paths) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading documents…
      </div>
    );
  }

  const uploaded = DOCS.filter((d) => isStoredVerificationPath(paths[d.key]));
  if (uploaded.length === 0) {
    return <p className="text-sm text-muted-foreground">No documents were uploaded with this request.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {uploaded.map((d) => (
          <Button key={d.key} type="button" variant="outline" size="sm" onClick={() => openDoc(d.key)} disabled={opening !== null}>
            {opening === d.key ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <FileText className="h-3 w-3 mr-1" />}
            {d.label}
          </Button>
        ))}
      </div>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" /> Private files · each link works for 5 minutes · IDs are never sent to AI
      </p>
    </div>
  );
};

export default VerificationDocumentLinks;
