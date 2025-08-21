import { FunctionComponent } from 'preact';

export interface MarkerProps {
  isActive?: boolean;
  size?: number;
  className?: string;
}

export const Marker: FunctionComponent<MarkerProps> = ({ size = 8, isActive, className }) => (
  <span
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `50%`,
      display: 'inline-block',
      backgroundColor: isActive ? 'rgb(var(--green-500))' : '#6b7280',
    }}
    className={className}
  />
);
