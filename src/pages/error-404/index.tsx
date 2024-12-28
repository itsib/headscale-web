import { createFileRoute } from '@tanstack/react-router';
import { Error404 } from '../../components/errors/error-404.tsx';

export const Route = createFileRoute('/error-404/')({
  component: Component,
});

function Component() {
  return <Error404 />;
}
