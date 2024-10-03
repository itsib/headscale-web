import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useRouteError } from 'react-router-dom';

export const Error500Page: FC<{ error?: any }> = ({ error: error0 }) => {
  const { t } = useTranslation();
  const error1 = useRouteError();
  const error = error0 || error1;

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center">
      <div className="relative flex flex-col justify-center items-center">
        <h1 className="text-[10rem] font-extrabold tracking-widest leading-tight">500</h1>
        <div className="bg-error text-white px-3 py-1 text-lg rounded rotate-12 absolute">
          <span>{t('something_went_wrong')}</span>
        </div>
      </div>
      {error instanceof Error && error.message && (
        <div className="max-w-[400px] mt-4 mb-8 whitespace-pre-wrap break-words text-sm">
          <span>{error.message}</span>
        </div>
      )}
      <Link to="/">
        <button type="button" className="btn">
          {t('go_home')}
        </button>
      </Link>
    </main>
  );
};
