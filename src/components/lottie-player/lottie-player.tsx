import { Component, createRef } from 'preact';
import { DotLottie, Config } from 'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm';

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

  shouldComponentUpdate(nextProps: LottiePlayerProps) {
    if ((nextProps.width != null || nextProps.height != null) && (nextProps.width !== this.width || nextProps.height !== this.height)) {
      this.width = nextProps.width || this.width;
      this.height = nextProps.height || this.height;

      const canvas = this.canvas.current;
      if (canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
      }
      this.player?.resize();
    }

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
        this.player.load({
          src: nextProps.src,
          autoplay: this.player.isPlaying,
          loop: this.player.loop,
          mode: this.player.mode,
          speed: this.player.speed,
        })
      }
    }
    return false;
  }

  componentDidMount() {
    const canvas = this.canvas.current;
    if (!canvas) return;

    const { width, height, ...props } = this.props;

    const config: Config = {
      src: props.src,
      canvas,
      autoplay: props.play ?? true,
      loop: !!props.loop,
      mode: props.mode || 'forward',
      speed: props.speed ?? 1,
    };

    this.width = width || this.width;
    this.height = height || this.height;
    this.player = new DotLottie(config);
  }

  componentWillUnmount() {
    if (!this.player) return;

    this.player.destroy();
    this.player = null;
  }

  render(props: LottiePlayerProps) {
    const { width, height, ..._props } = props;
    return <canvas ref={this.canvas} width={width || this.width} height={height || this.height} {..._props} />;
  }
}