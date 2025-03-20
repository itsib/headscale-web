import { Component, createRef } from 'preact';
import type { DotLottie, Config } from 'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm';

export type LottiePlayerMode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

export interface LottiePlayerProps {
  src: string;
  width?: number;
  height?: number;
  loop?: boolean;
  play?: boolean;
  backgroundColor?: string;
  mode?: LottiePlayerMode;
  speed?: number;
}

export class LottiePlayer extends Component<LottiePlayerProps> {
  width = 300;

  height = 300;

  canvas = createRef<HTMLCanvasElement>();

  player: DotLottie | null = null;

  async createDotLottie(config: Config) {
    try {
      const { DotLottieWorker } = await import('https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm');
      return new DotLottieWorker(config);
    } catch {
      return null;
    }
  }

  async componentDidMount() {
    const canvas = this.canvas.current;
    if (!canvas) return;

    const { width, height, ...props } = this.props;

    let src = props.src;
    if (!src.startsWith('http')) {
      src = location.origin + src;
    }

    const config: Config = {
      src,
      canvas,
      autoplay: props.play ?? true,
      loop: !!props.loop,
      mode: props.mode || 'forward',
      speed: props.speed ?? 1,
    };

    this.width = width || this.width;
    this.height = height || this.height;
    this.player = await this.createDotLottie(config);
  }

  shouldComponentUpdate(nextProps: LottiePlayerProps) {
    if (this.player) {
      if (nextProps.loop != null && this.player.loop !== nextProps.loop) {
        this.player.setLoop(nextProps.loop);
      }

      if (nextProps.backgroundColor != null && this.player.backgroundColor !== nextProps.backgroundColor) {
        this.player.setBackgroundColor(nextProps.backgroundColor);
      }

      if (nextProps.mode != null && this.player.mode !== nextProps.mode) {
        this.player.setMode(nextProps.mode);
      }

      if (nextProps.speed != null && this.player.speed !== nextProps.speed) {
        this.player.setSpeed(nextProps.speed);
      }

      if (nextProps.play != null) {
        if (this.player.isPlaying && !nextProps.play) {
          this.player.stop();
        } else if (!this.player.isPlaying && nextProps.play) {
          this.player.play();
        }
      }

      if (nextProps.src != null) {
        let src = nextProps.src;
        if (!src.startsWith('http')) {
          src = location.origin + src;
        }
        this.player.load({
          src: src,
          autoplay: this.player.isPlaying,
          loop: this.player.loop,
          mode: this.player.mode,
          speed: this.player.speed,
        })
      }
    }
    return false;
  }

  componentWillUnmount() {
    if (!this.player) return;

    this.player.destroy();
    this.player = null;
  }

  render(props: LottiePlayerProps) {
    const { width: _width, height: _height, ..._props } = props;
    return <canvas ref={this.canvas} width={this.width} height={this.height} {..._props} />;
  }
}