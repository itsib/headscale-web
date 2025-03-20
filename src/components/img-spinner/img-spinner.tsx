import type { JSX, FunctionComponent } from 'preact';

export interface ImgSpinnerProps extends Omit<JSX.SVGAttributes<SVGSVGElement>, 'width' | 'height' | 'viewBox' | 'xmlns'> {
  size?: number;
}

export const ImgSpinner: FunctionComponent<ImgSpinnerProps> = ({ size = 24, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
      <circle r="8" cy="12" cx="12" fill="none" stroke-linecap="round" stroke-width="2" stroke="currentColor" stroke-dashoffset="0" stroke-dasharray="40" />
    </svg>
  );
};