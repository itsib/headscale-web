import { IconBaseProps } from '@app-types';
import { ForwardedRef, forwardRef } from 'react';

export const LoadingIcon = forwardRef(function SuccessIcon(props: IconBaseProps, ref: ForwardedRef<SVGSVGElement>) {
  const { size = 24, style, className } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style={style} className={className} ref={ref}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path stroke="rgb(var(--text-primary))" strokeDasharray={16} strokeDashoffset={16} d="M12 3c4.97 0 9 4.03 9 9">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0"></animate>
          <animateTransform attributeName="transform" dur="0.8s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform>
        </path>
        <path stroke="rgb(var(--text-secondary))"  stroke-opacity="0.3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z" />
      </g>
    </svg>
  );
});
