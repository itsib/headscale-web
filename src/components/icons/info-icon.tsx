import { IconBaseProps } from '@app-types';
import { ForwardedRef, forwardRef } from 'react';

export const InfoIcon = forwardRef(function InfoIcon(props: IconBaseProps, ref: ForwardedRef<SVGSVGElement>) {
  const { size = 24, style, className } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style={style} className={className} ref={ref}>
      <g fill="rgb(var(--text-primary))" fillOpacity={0} stroke="rgb(var(--text-primary))" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path
          strokeDasharray={64}
          strokeDashoffset={64}
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate>
        </path>
        <path fill="none" strokeDasharray="8" strokeDashoffset="8" d="M12 11v6">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0" />
        </path>
        <path fill="none" strokeDasharray="2" strokeDashoffset="2" d="M12 8v0.01">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="2;0" />
        </path>
        <animate fill="freeze" attributeName="fill-opacity" begin="1.1s" dur="0.15s" values="0;0.3"></animate>
      </g>
    </svg>
  );
});
