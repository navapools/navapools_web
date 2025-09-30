'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  mobileVideoUrl?: string;
  className?: string;
}

export default function VideoBackground({ videoUrl, mobileVideoUrl, className = '' }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const normalizedDesktopUrl = typeof videoUrl === 'string' ? videoUrl.trim() : '';
  const normalizedMobileUrl = typeof mobileVideoUrl === 'string' ? mobileVideoUrl.trim() : '';
  const hasAnyVideoUrl = Boolean(normalizedDesktopUrl || normalizedMobileUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasAnyVideoUrl) {
      return;
    }

    const handleError = () => {
      console.warn('Video failed to load');
      setHasError(true);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      // Intentar reproducir cuando el video esté listo
      video.play().catch((error) => {
        console.warn('Video autoplay failed (this is normal):', error);
      });
    };

    // Añadir event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        // Pausar el video antes de desmontar
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [hasAnyVideoUrl]);

  // Si no hay ninguna URL válida o hay error, mostrar un placeholder
  if (!hasAnyVideoUrl || hasError) {
    return (
      <div className={`absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-blue-900 to-gray-900 ${className}`}>
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={normalizedDesktopUrl || normalizedMobileUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {normalizedMobileUrl && (
          <source src={normalizedMobileUrl} media="(max-width: 768px)" />
        )}
        {normalizedDesktopUrl && (
          <source src={normalizedDesktopUrl} />
        )}
      </video>
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
