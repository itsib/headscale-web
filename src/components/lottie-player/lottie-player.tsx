import { useQuery } from '@tanstack/react-query';
import Lottie, { AnimationConfigWithPath, AnimationItem } from 'lottie-web/build/player/lottie_light';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getId } from '../../utils/get-id';

export interface IAnimation {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onDestroy?: () => void;
}

export const LottiePlayer = forwardRef(function LottiePlayer(props: IAnimation, ref: ForwardedRef<{ current: AnimationItem | null }>) {
  const { src, loop = true, autoplay = true, speed = 1, className, ...listeners } = props;
  const [id] = useState(`animation-${getId()}`);
  const [player, setPlayer] = useState<AnimationItem | null>(null);

  const configRef = useRef<Omit<AnimationConfigWithPath, 'container' | 'path'>>({ loop, autoplay });

  const listenersRef = useRef(listeners);
  listenersRef.current = listeners;

  const { data } = useQuery({
    queryKey: [src],
    staleTime: Infinity,
    enabled: !!src,
  });

  // Create lottie player
  useEffect(() => {
    const container = document.getElementById(id) as HTMLDivElement;
    if (!data || !container) {
      return;
    }

    const instance = Lottie.loadAnimation({
      ...configRef.current,
      container: container,
      renderer: 'svg',
      animationData: data,
      name: id,
      rendererSettings: {
        filterSize: {
          x: '0',
          y: '0',
          width: '38px',
          height: '38px',
        },
        // viewBoxOnly: true,
      },
    });

    setPlayer(instance);

    return () => {
      instance.destroy();
      setPlayer(null);
    };
  }, [data, id]);

  // Set animation speed
  useEffect(() => {
    if (!player) {
      return;
    }

    if (player.playSpeed !== speed) {
      player.setSpeed(speed);
    }
    if (player.loop !== loop) {
      player.setLoop(loop);
      if (player.isPaused && loop) {
        player.play();
      }
      configRef.current.loop = loop;
    }
  }, [speed, player, loop]);

  // Add event handlers
  useEffect(() => {
    if (!player || !(player as any)._cbs) {
      return;
    }
    const onComplete = () => listenersRef.current?.onComplete?.();
    const onLoopComplete = () => listenersRef.current?.onLoopComplete?.();
    const onDestroy = () => listenersRef.current?.onDestroy?.();
    let destroyed = false;

    try {
      player.addEventListener('complete', onComplete);
      player.addEventListener('loopComplete', onLoopComplete);
      player.addEventListener('destroy', () => {
        destroyed = true;
        onDestroy();
      });
    } catch (e) {
      console.warn(e);
    }

    return () => {
      if (!destroyed) {
        player?.removeEventListener('complete', onComplete);
        player?.removeEventListener('loopComplete', onLoopComplete);
        player?.removeEventListener('destroy', onDestroy);
      }
    };
  }, [player]);

  useImperativeHandle(ref, () => ({ current: player }), [player]);

  return <div id={id} className={className} />;
});
