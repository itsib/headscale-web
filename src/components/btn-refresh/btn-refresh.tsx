import { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { cn } from 'react-just-ui/utils/cn';
import './btn-refresh.css';

export interface BtnRefreshProps {
  className?: string;
  onRefresh?: () => Promise<any>;
}

export const BtnRefresh: FunctionComponent<BtnRefreshProps> = props => {
  const { className, onRefresh } = props;
  const ref = useRef<HTMLButtonElement | null>(null);

  async function onClick() {
    const btn = ref.current;
    const icon = btn?.firstChild as HTMLElement;
    if (!icon || icon.getAnimations().length) return;

    icon.classList.add('icon-spin');

    await onRefresh?.();

    icon.addEventListener('animationiteration', () => icon.classList.remove('icon-spin'), { once: true });
  }

  return (
    <button className={cn('btn btn-icon btn-refresh', className)} ref={ref} onClick={onClick}>
      <i className="icon icon-refresh icon-xl" />
    </button>
  );
};
