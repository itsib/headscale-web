import { TFunction } from 'i18next';

export class ToastOfflineManager {
  private readonly _t: TFunction<any, undefined>;
  private readonly _container: HTMLElement;
  private readonly _image: HTMLImageElement;

  constructor(container: HTMLElement, t: TFunction<any, undefined>) {
    this._t = t;
    this._container = container;
    this._image = new Image();
    this._image.src = '/images/compass.svg';
    this._image.alt = 'compass';
    this._image.classList.add('compass');
    this._image.fetchPriority = 'high';
  }

  show() {
    let toast = document.getElementById('offline-toast');
    if (toast) return;

    toast = document.createElement('div');
    toast.id = 'offline-toast';
    toast.classList.add('toast-offline');

    toast.append(this._image);

    const message = document.createElement('div');
    message.innerHTML = this._t('error_offline');
    toast.append(message);

    this._container.append(toast);

    setTimeout(() => toast.classList.add('show'), 10);
  }

  hidde() {
    const toast = document.getElementById('offline-toast');
    if (!toast) return;

    toast.addEventListener('transitionend', () => toast.remove(), { once: true });

    toast.classList.remove('show');
  }
}
