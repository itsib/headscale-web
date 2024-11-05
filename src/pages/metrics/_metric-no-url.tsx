import { Input, url } from 'react-just-ui';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppMetricsUrl } from '../../hooks/use-app-metrics-url.ts';

export const MetricNoUrl = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [, setMetricUrl] = useAppMetricsUrl();

  const { handleSubmit, register, formState } = useForm<{ metricsUrl: string }>({
    defaultValues: {
      metricsUrl: '',
    }
  });
  const { errors } = formState;

  async function onSubmit(values: { metricsUrl: string }) {
    setIsLoading(true)
    setMetricUrl(values.metricsUrl);
    setIsLoading(false);
  }

  return (
    <div className="container">
      <div className="w-full h-[80vh] min-h-[max(80vh, 700px)] flex items-start justify-center">

        <form className="card w-[460px] mt-[16vh] mb-[200px]" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-4 font-bold">{t('no_metric_page_header')}</h3>

          <div className="mb-2">
            <Input
              id="metric-url-input-home"
              placeholder="https://example.com/metrics"
              label={t('no_metric_page_label')}
              error={errors?.metricsUrl}
              {...register('metricsUrl', {
                validate: url(t('error_invalid_url')),
              })}
            />
          </div>

          <div className="mt-4">
            <button type="submit" className={`btn btn-accent w-full ${isLoading ? 'loading' : ''}`}>
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}