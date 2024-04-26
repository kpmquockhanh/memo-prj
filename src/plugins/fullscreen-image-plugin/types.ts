export interface FullscreenImageProps {
  imageUrl: string | string[];
  anchor?: string;
  animation?: 'fade' | 'blur' | 'none';
  imageAlt?: string | string[];
  withDownload?: boolean;
  withClose?: boolean;
  withFocusOnClose?: boolean;
  withCloseOnEscape?: boolean;
  closeOnClikOutside?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  backdropColor?: string;
  description?: string;
}

