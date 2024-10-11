import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Error404Page: FC = () => {
  const { t } = useTranslation();

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <div className="h-auto w-full max-w-[512px] aspect-square">
        {/*<LottiePlayer src="/animations/404.json" loop speed={0.8} />*/}
      </div>

      <Link to="/" className="btn text-2xl hover:underline underline-offset-4">
        {t('go_home')}
      </Link>
    </main>
  );
};
