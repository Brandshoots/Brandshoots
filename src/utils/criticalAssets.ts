const settleWithin = <T>(promise: Promise<T>, timeoutMs: number): Promise<void> =>
  new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    promise.then(finish, finish);
  });

export const waitForCriticalImage = (src?: string, timeoutMs = 2500): Promise<void> => {
  if (!src) return Promise.resolve();

  return settleWithin(
    new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = 'high';
      image.onload = () => {
        if (typeof image.decode === 'function') image.decode().then(resolve, resolve);
        else resolve();
      };
      image.onerror = () => resolve();
      image.src = src;
      if (image.complete) {
        if (typeof image.decode === 'function') image.decode().then(resolve, resolve);
        else resolve();
      }
    }),
    timeoutMs
  );
};

export const waitForVideoMetadata = (src?: string, timeoutMs = 1600): Promise<void> => {
  if (!src) return Promise.resolve();

  return settleWithin(
    new Promise<void>((resolve) => {
      const video = document.createElement('video');
      const finish = () => {
        video.removeEventListener('loadedmetadata', finish);
        video.removeEventListener('canplay', finish);
        video.removeEventListener('error', finish);
        video.removeAttribute('src');
        video.load();
        resolve();
      };

      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.addEventListener('loadedmetadata', finish, { once: true });
      video.addEventListener('canplay', finish, { once: true });
      video.addEventListener('error', finish, { once: true });
      video.src = src;
      video.load();
    }),
    timeoutMs
  );
};

export const waitForBrandFonts = (timeoutMs = 900): Promise<void> => {
  if (!document.fonts) return Promise.resolve();

  return settleWithin(
    Promise.all([
      document.fonts.load('400 16px "Figtree"'),
      document.fonts.load('700 48px "Bebas Neue"'),
      document.fonts.ready,
    ]),
    timeoutMs
  );
};
