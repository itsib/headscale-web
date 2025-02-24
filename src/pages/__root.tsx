import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { RouterContext } from '@app-types';
import { Header } from '@app-components/header/header';
import { Error500 } from '@app-components/errors/error-500';
import { Error404 } from '@app-components/errors/error-404';
import { debounceAvg } from '@app-utils/debounce-avg';
import { Footer } from '@app-components/footer/footer.tsx';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Component,
  errorComponent: Error500,
  notFoundComponent: Error404,
});

function Component() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastFire = 0;
    let pressure = 0

    const transform = debounceAvg(value => {
      const scale = (Math.round(value * 100000) / 100000) + 1;
      container.style.transition = 'transform 0.3s ease-out';
      container!.style.transform = `scale(1, ${Math.min(1.05, scale)})`;

      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        lastFire = 0;
        pressure = 0;
        container.style.transition = 'transform 0.2s ease-in';
        container!.style.transform = `scale(1, 1)`;

      }, 200)
    }, 100);

    function wheel(event: WheelEvent) {
      if (container!.scrollHeight <= container!.offsetHeight || (event.deltaY > 0 && (container!.scrollHeight !== (container!.offsetHeight + container!.scrollTop))) || (event.deltaY < 0 && container!.scrollTop !== 0)) {
        return;
      }

      const delta = lastFire === 0 ? 0 : event.timeStamp - lastFire;
      lastFire = event.timeStamp;

      pressure = (delta > 0 ? 1 / delta : 0) * (Math.abs(event.deltaY) / 100);
      transform(pressure);

      container!.style.transformOrigin = event.deltaY > 0 ? 'center bottom' : 'center top';
    }

    container.addEventListener('wheel', wheel, { passive: true });

    return () => {
      container.removeEventListener('wheel', wheel);
    }
  }, []);

  return (
    <div className="ui-scroll">
      <Header />
      <div className="container mt-[var(--header-height)] min-h-[var(--content-height)]" ref={containerRef}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}