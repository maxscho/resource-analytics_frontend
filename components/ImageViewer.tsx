'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/components/ImageViewer.module.css';
import Image from 'next/image';

interface ImageViewerProps {
  imageSrc: string;
}

export default function ImageViewer({ imageSrc }: ImageViewerProps) {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const img = document.getElementById('base64Image');
    if (img) {
      img.style.transform = `scale(${scale})`;
    }
  }, [scale]);

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault(); // Prevent default scrolling behavior
    const scaleFactor = event.deltaY < 0 ? 1.1 : 0.9;
    setScale((prevScale) => Math.max(1, Math.min(prevScale * scaleFactor, 10)));
  };

  useEffect(() => {
    const imgContainer = document.getElementById('div2');
    if (imgContainer) {
      // Add the event listener with { passive: false }
      imgContainer.addEventListener('wheel', handleWheel, { passive: false });

      // Cleanup the event listener on component unmount
      return () => {
        imgContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <div id="div2" className={`${styles.rounded} ${styles.imageViewer}`}>
      {imageSrc && <Image id="base64Image" src={imageSrc} style={{ maxWidth: '100%', height: '100%', transition: 'transform 0.2s ease' }} alt='Placeholder' />}
    </div>
  );
}