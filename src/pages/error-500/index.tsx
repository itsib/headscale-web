import { createFileRoute } from '@tanstack/react-router';
import { Error500 } from '../../components/errors/error-500.tsx';

export const Route = createFileRoute('/error-500/')({
  component: Component,
});

function Component() {
  const { message } = Route.useParams() as { message?: string };

  return <Error500 error={message} />;
}
