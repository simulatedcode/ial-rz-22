'use client'

import React from 'react';
import styles from './GridLayout.module.css';

interface GridLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * GridLayout
 * A high-fidelity 4x3 desktop grid system.
 * Automatically adapts to 2 columns on tablet and 1 on mobile.
 */
export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
