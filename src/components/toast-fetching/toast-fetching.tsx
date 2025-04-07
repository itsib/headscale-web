import { useEffect } from 'preact/hooks';
import './toast-fetching.css';

export function ToastFetching({ isShow }: { isShow: boolean }){
  useEffect(() => {
    if (!isShow) return;

    let loader = document.getElementById('fetching-status');
    if (loader) return;

    loader = document.createElement('div');
    loader.id = 'fetching-status';
    loader.classList.add('toast-fetching-line');
    document.body.appendChild(loader);

    const frameId = requestAnimationFrame(() => {
      if (!loader) return;

      loader.classList.add('show-in');
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isShow]);

  useEffect(() => {
    if (isShow) return;

    const loader = document.getElementById('fetching-status');
    if (!loader) return;

    function remove() {
      if (!loader) return;

      loader.removeEventListener('transitionend', remove);
      loader.remove()
    }

    loader.classList.remove('show-in');

    loader.addEventListener('transitionend', remove, { once: true });
    loader.classList.add('show-out');
  }, [isShow]);

  return null;
}