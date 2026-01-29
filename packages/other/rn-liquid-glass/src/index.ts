export { GlassView } from './GlassView';
export { LiquidBackground } from './LiquidBackground';
export { BlurView } from './BlurView';
export type {
  GlassViewProps,
  LiquidBackgroundProps,
  BlurViewProps,
  AnimationConfig,
  AnimationType,
} from './types';

import { GlassView as GlassViewComponent } from './GlassView';
import { LiquidBackground as LiquidBackgroundComponent } from './LiquidBackground';
import { BlurView as BlurViewComponent } from './BlurView';

export default {
  GlassView: GlassViewComponent,
  LiquidBackground: LiquidBackgroundComponent,
  BlurView: BlurViewComponent,
};
