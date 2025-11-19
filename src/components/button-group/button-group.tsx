import { memo, MouseEvent } from 'react';
import { cn } from 'react-just-ui/utils/cn';
import { useCallback } from 'react';
import './button-group.css';

export interface ButtonConfig {
  id: string;
  icon: string;
  tooltip?: string;
  effect?: string;
}

export interface ButtonGroupProps {
  buttons: ButtonConfig[];
  onClick?: (id: string) => void;
}

function comparator(prev: ButtonGroupProps, next: ButtonGroupProps): boolean {
  if (prev.buttons.length !== next.buttons.length) {
    return false;
  }

  for (let i = 0; i < prev.buttons.length; i++) {
    const prevBtn = prev.buttons[i];
    const nextBtn = next.buttons[i];

    if (
      prevBtn.id !== nextBtn.id ||
      prevBtn.effect !== nextBtn.effect ||
      prevBtn.icon !== nextBtn.icon
    ) {
      return false;
    }
  }

  return true;
}

export const ButtonGroup = memo(function ButtonGroup(props: ButtonGroupProps) {
  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.target as HTMLButtonElement;
      const id = button?.id;
      const icon = button?.firstChild as HTMLElement;
      const effect = button?.dataset.effect;

      if (!id || !icon || !props.onClick) return;

      if (effect) {
        icon.classList.add(effect);
        const [animation] = icon.getAnimations();
        animation.play();
      }

      props.onClick(id);
    },
    [props.onClick]
  );

  return (
    <div className="button-group">
      {props.buttons.map((button) => (
        <button
          key={button.id}
          id={button.id}
          type="button"
          className="btn btn-icon"
          aria-label={button.tooltip}
          role="command"
          data-effect={button.effect}
          onClick={onClick}
        >
          <i className={cn('icon', button.icon)} />
        </button>
      ))}
    </div>
  );
}, comparator);
