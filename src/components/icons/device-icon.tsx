import { IconBaseProps } from '@app-types';
import { ForwardedRef, forwardRef } from 'react';
import { cn } from 'react-just-ui/utils/cn';

export type DeviceIconType = 'laptop' | 'tablet' | 'desktop' | 'mobile';

export interface DeviceIconProps extends IconBaseProps {
  type?: DeviceIconType;
}

export const DeviceIcon = forwardRef(function ErrorIcon(props: DeviceIconProps, ref: ForwardedRef<SVGSVGElement>) {
  const { type = 'laptop', size = 24, style, className } = props;

  let iconClassName: string;
  switch (type) {
    case 'laptop':
      iconClassName = 'icon-laptop';
      break;
    case 'desktop':
      iconClassName = 'icon-desktop';
      break;
    case 'mobile':
      iconClassName = 'icon-mobile';
      break;
    case 'tablet':
      iconClassName = 'icon-tablet';
      break;
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" style={style} className={className} ref={ref}>
      <circle cx={12} cy={12} r={12} fill="rgb(var(--accent))" />
      <foreignObject x={4} y={4} width={16} height={16} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <i className={cn('icon', iconClassName)} style={{ fontSize: '14px', lineHeight: '16px' }} />
      </foreignObject>
    </svg>
  );
})
