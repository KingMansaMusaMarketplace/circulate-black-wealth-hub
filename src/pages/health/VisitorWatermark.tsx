import type { PreviewViewer } from './preview-access';
export default function VisitorWatermark({ viewer }: { viewer: PreviewViewer }) {
  const date = new Date().toISOString().slice(0, 10);
  return <div className="clinical-visitor-watermark" aria-hidden="true">
    {Array.from({ length: 60 }, (_, index) => <div className="clinical-watermark-tile" key={index}>
      <strong>1325 CLINICAL · CONFIDENTIAL</strong>
      <span>{viewer.name}</span><span>{viewer.email}</span><span>{date} · UTC</span>
    </div>)}
  </div>;
}