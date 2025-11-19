import { IconBaseProps } from '@app-types';
import { forwardRef, type ForwardedRef } from 'react';

export const WarningIcon = forwardRef(function WarningIcon(
  props: IconBaseProps,
  ref: ForwardedRef<SVGSVGElement>
) {
  const { size = 24, style, className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      className={className}
      ref={ref}
    >
      <g
        fill="rgb(var(--orange-400))"
        fillOpacity={0}
        stroke="rgb(var(--orange-400))"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path strokeDasharray={64} strokeDashoffset={64} d="M12 3l9 17h-18l9 -17Z">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.6s"
            values="64;0"
          ></animate>
        </path>
        <path strokeDasharray={6} strokeDashoffset={6} d="M12 10v4">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.6s"
            dur="0.2s"
            values="6;0"
          ></animate>
        </path>
        <path strokeDasharray={2} strokeDashoffset={2} d="M12 17v0.01">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.8s"
            dur="0.2s"
            values="2;0"
          ></animate>
        </path>
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="1.1s"
          dur="0.15s"
          values="0;0.3"
        ></animate>
      </g>
    </svg>
  );
});
