export const compressImageToDataUrl = (
  file: File,
  options?: { maxWidth?: number; quality?: number }
): Promise<string> => {
  const maxWidth = options?.maxWidth ?? 1280;
  const quality = options?.quality ?? 0.72;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Nem sikerült beolvasni a képet.'));
    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error('Nem sikerült feldolgozni a képet.'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const targetWidth = Math.max(1, Math.floor(img.width * scale));
        const targetHeight = Math.max(1, Math.floor(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('A böngésző nem tudja feldolgozni a képet.'));
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.src = typeof reader.result === 'string' ? reader.result : '';
    };

    reader.readAsDataURL(file);
  });
};
