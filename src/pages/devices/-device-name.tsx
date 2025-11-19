import type { FC, FocusEvent } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifyQuery } from '@app-hooks/use-notify-query.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { fetchFn } from '@app-utils/query-fn.ts';
import { Device } from '@app-types';
import { cn } from 'react-just-ui/utils/cn';
import { Input } from 'react-just-ui';
import './-device-name.css';

export interface DeviceNameProps {
  deviceId: string;
  name: string;
  className?: string;
}

export const DeviceName: FC<DeviceNameProps> = ({ name, deviceId, className }) => {
  const { t } = useTranslation();
  const { start, success, error } = useNotifyQuery();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);
  const skipSubmitRef = useRef(false);

  const { handleSubmit, register, formState, reset, setError, getValues, watch } = useForm<{
    name: string;
  }>({
    defaultValues: {
      name: name,
    },
    mode: 'onChange',
    delayError: 1000,
  });
  const { errors, isValid, isSubmitting } = formState;

  const { mutate, isPending } = useMutation({
    async mutationFn({ deviceId, name }: { deviceId: string; name: string }) {
      return await fetchFn<{ node: Device }>(`/api/v1/node/${deviceId}/rename/${name}`, {
        method: 'POST',
        body: '{}',
      });
    },
    onMutate: () => {
      start();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/v1/node/${deviceId}`], data);
      success();
    },
    onError: (e: any) => {
      error(e.message);
      setError('name', { message: e.message });
    },
  });

  function submit({ name: _name }: { name: string }) {
    if (!isValid || _name === name) return;

    mutate({ deviceId: deviceId!, name: _name });
  }

  function onBlur(event: FocusEvent) {
    event.stopPropagation();
    if (skipSubmitRef.current || isSubmitting) return;

    submit({ name: getValues('name') });
  }

  function onMouseDown() {
    skipSubmitRef.current = true;
  }

  function onMouseUp() {
    skipSubmitRef.current = false;
  }

  function onReset() {
    reset({ name: name });
  }

  return (
    <div className={cn('device-name', className)}>
      <form onSubmit={handleSubmit(submit)} ref={formRef}>
        <div className="form-control-wrap">
          <Input
            id="device-name-input"
            label={t('device_name')}
            error={errors?.name}
            suffix={
              <>
                {name !== watch('name') ? (
                  <button
                    type="button"
                    onClick={onReset}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    className="suffix"
                  >
                    <i className="icon icon-close icon-sm" />
                  </button>
                ) : undefined}
              </>
            }
            hint={t('press_enter_to_save')}
            {...register('name', {
              required: t('error_required'),
              disabled: isPending,
            })}
            onBlur={onBlur}
          />
        </div>
      </form>
    </div>
  );
};
