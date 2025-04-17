import { useTranslation } from 'react-i18next';
import { LottiePlayer } from '@app-components/lottie-player/lottie-player';
import './index.css';
import { useBreakPoint } from '@app-hooks/use-break-point.ts';

export const Error404 = () => {
  const { t } = useTranslation();
  const isMobile = useBreakPoint(600);

  return (
    <main className="page error-404-page">
      {isMobile ? (
        <div className="static">
          <img src="/images/404-static.svg" alt="404-static" />
        </div>
      ) : (
        <div className="animation">
          <LottiePlayer src="/animations/404.json" loop speed={1} height={400} width={400} />
        </div>
      )}


      <div className="message">
        {t('not_found_page_text')}
      </div>

      <a href="/" className="go-home">
        {t('go_home')}
      </a>
    </main>
  );
}
