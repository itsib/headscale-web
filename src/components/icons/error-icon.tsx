import { IconBaseProps } from '@app-types';
import { ForwardedRef, forwardRef } from 'react';

export const ErrorIcon = forwardRef(function ErrorIcon(
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
        fill="none"
        stroke="rgb(var(--error))"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path
          fill="rgb(var(--error))"
          fillOpacity={0}
          strokeDasharray={64}
          strokeDashoffset={64}
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.6s"
            dur="0.15s"
            values="0;0.3"
          ></animate>
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.6s"
            values="64;0"
          ></animate>
        </path>
        <path
          strokeDasharray={8}
          strokeDashoffset={8}
          d="M12 12l4 4M12 12l-4 -4M12 12l-4 4M12 12l4 -4"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.75s"
            dur="0.2s"
            values="8;0"
          ></animate>
        </path>
      </g>
    </svg>
  );
});
