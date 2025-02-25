import { useTranslation } from 'react-i18next';
import { RenderableProps } from 'preact';

export function Error500(props: RenderableProps<{ error: any }>) {
  const { error } = props;
  const { t } = useTranslation();

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
      <a href="/">
        <button type="button" className="btn">
          {t('go_home')}
        </button>
      </a>
    </main>
  );
}
