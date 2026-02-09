export type PermissionStatus = 'granted' | 'denied' | 'blocked';

export type CameraFacing = 'front' | 'back';

export type CameraResolution = 'low' | 'medium' | 'high';

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OCRBlock = {
  text: string;
  boundingBox: BoundingBox;
  confidence?: number;
};

export type OCRResult = {
  text: string;
  blocks: OCRBlock[];
};

export type CameraOptions = {
  facing?: CameraFacing;
  resolution?: CameraResolution;
  fps?: number;
  torch?: boolean;
  autoFocus?: boolean;
};

export type LiveRecognitionOptions = {
  fps?: number;
  languageHints?: string[];
  onTextRecognized: (result: OCRResult) => void;
};
