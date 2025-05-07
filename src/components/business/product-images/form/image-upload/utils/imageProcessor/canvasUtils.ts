
export const getBlobFromCanvas = (canvas: HTMLCanvasElement, fileType: string = 'image/webp', quality: number = 0.92): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob as Blob);
    }, fileType, quality);
  });
};
