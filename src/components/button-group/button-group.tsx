import { Component } from 'preact';
import { cn } from 'react-just-ui/utils/cn';
import './button-group.css';

export interface ButtonConfig {
  id: string;
  icon: string;
  tooltip?: string;
  effect?: string;
}

export interface ButtonGroupProps {
  buttons: ButtonConfig[];
  onClick?: (id: string) => Promise<any>;
}

export class ButtonGroup extends Component<ButtonGroupProps> {

  shouldComponentUpdate(nextProps: ButtonGroupProps) {
    this.props.onClick = nextProps.onClick;

    if (this.props.buttons.length !== nextProps.buttons.length) {
      return true;
    }

    return this.props.buttons.some(({ id, effect, icon }, i) => {
      const nextBtm = nextProps.buttons[i];
      if (!nextBtm) return true;

      return nextBtm.id !== id || nextBtm.effect !== effect || nextBtm.icon !== icon;
    });
  }

  async onClick(event: MouseEvent) {
    const button = event.target as HTMLButtonElement;
    const icon = button?.firstChild as HTMLElement;
    const config = this.props.buttons.find(({ id }) => id === button.id);

    if (!icon || !config || !this.props.onClick) return;

    if (config.effect) {
      icon.classList.add(config.effect);
    }


    await this.props.onClick(config.id);

    if (config.effect) {
      icon.addEventListener('animationiteration', () => icon.classList.remove(config.effect!), { once: true });
    }
  }

  render({ buttons }: ButtonGroupProps) {
    return (
      <div className="button-group">
        {buttons.map(button => (
          <button
            key={button.id}
            id={button.id}
            type="button"
            className="btn btn-icon"
            aria-label={button.tooltip}
            role="command"
            onClick={this.onClick.bind(this)}
          >
            <i className={cn('icon', button.icon)} />
          </button>
        ))}
      </div>
    );
  }
}