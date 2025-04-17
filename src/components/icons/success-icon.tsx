import { IconBaseProps } from '@app-types';
import { ForwardedRef, forwardRef } from 'react';

export const SuccessIcon = forwardRef(function SuccessIcon(props: IconBaseProps, ref: ForwardedRef<SVGSVGElement>) {
  const { size = 24, style, className } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style={style} className={className} ref={ref}>
      <g fill="none" stroke="rgb(var(--green-600))" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path
          fill="rgb(var(--green-600))"
          fillOpacity={0}
          strokeDasharray={64}
          strokeDashoffset={64}
          d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"
        >
          <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.15s" values="0;0.2"></animate>
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate>
        </path>
        <path strokeDasharray={14} strokeDashoffset={14} d="M8 12l3 3l5 -5">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.15s" values="14;0"></animate>
        </path>
      </g>
    </svg>
  );
});
