'use client';

import { ReactNode } from 'react';
import './CRTLayout.css';

export interface CRTEffectOptions {
  scanlineOpacity?: number;
  scanlineCount?: number;
  vignetteIntensity?: number;
  noiseOpacity?: number;
  chromaticAberration?: number;
  flickerIntensity?: number;
}

interface CRTLayoutProps {
  children: ReactNode;
  enabled?: boolean;
  crtProps?: CRTEffectOptions;
}

export function CRTLayout({ children, enabled = true, crtProps }: CRTLayoutProps) {
  const {
    scanlineOpacity = 0.15,
    scanlineCount = 800,
    vignetteIntensity = 0.4,
    noiseOpacity = 0.08,
    chromaticAberration = 2,
    flickerIntensity = 0.03,
  } = crtProps || {};

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="crt-container">
      {children}
      <div
        className="crt-overlay"
        style={{
          '--scanline-opacity': scanlineOpacity,
          '--scanline-count': scanlineCount,
          '--vignette-intensity': vignetteIntensity,
          '--noise-opacity': noiseOpacity,
          '--chromatic-aberration': chromaticAberration,
          '--flicker-intensity': flickerIntensity,
        } as React.CSSProperties}
      />
    </div>
  );
}
