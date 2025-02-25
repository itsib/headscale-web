import { useTranslation } from 'react-i18next';
import { LottiePlayer } from '@app-components/lottie-player/lottie-player';

export const Error404 = () => {
  const { t } = useTranslation();

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-[var(--content-height)]">
      <div className="aspect-square">
        <LottiePlayer src="/animations/page-not-found.json" loop speed={1} height={500} width={500} />
      </div>

      <a href="/" className="btn text-2xl hover:underline underline-offset-4">
        {t('go_home')}
      </a>
    </main>
  );
}
