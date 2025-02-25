import { useLocation } from 'preact-iso/router';
import { RenderableProps } from 'preact';
import { useEffect } from 'react';

export const Redirect = (props: RenderableProps<{ to: string }>) => {
  const { path, route } = useLocation();

  useEffect(() => {
    if (!props.to || props.to === path) return;

    route(props.to);
  }, [path, props.to]);

  return null;
}