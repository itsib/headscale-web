import { useTranslation } from 'react-i18next';
import { LottiePlayer } from '@app-components/lottie-player/lottie-player';
import './index.css';

export const Error404 = () => {
  const { t } = useTranslation();

  return (
    <main className="error-404-page">
      <div className="animation">
        <LottiePlayer src="/animations/404.json" loop speed={1} height={320} width={320} />
      </div>

      <div className="message">
        {t('not_found_page_text')}
      </div>

      <a href="/" className="go-home">
        {t('go_home')}
      </a>
    </main>
  );
}
