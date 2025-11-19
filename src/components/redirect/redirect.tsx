import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useEffect } from 'react';

export const Redirect: FC<{ to: string }> = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.to) return;

    navigate({ to: props.to });
  }, [props.to]);

  return null;
};
