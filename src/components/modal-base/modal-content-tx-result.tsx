import { TransactionStatus } from '@app-types';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Hash } from 'viem';
import { useTx } from '../../hooks/transactions/use-tx';
import { useTxRenderMode } from '../../hooks/transactions/use-tx-render-mode';
import { BtnCopy } from '../buttons/btn-copy/btn-copy';
import { FormattedHash } from '../formatters/formatted-hash';
import { LottiePlayer } from '../lottie-player/lottie-player';

export interface IModalContentTxResult {
  chainId: number;
  hash: Hash;
  onDismiss?: () => void;
  onConfirmed?: () => void;
}

export const ModalContentTxResult: FC<IModalContentTxResult> = ({ chainId, hash, onDismiss, onConfirmed }) => {
  const { t } = useTranslation();
  const transaction = useTx(hash);
  useTxRenderMode();

  return (
    <>
      <div className="modal-header">
        <div className="title">
          {transaction?.status === TransactionStatus.Confirmed || transaction?.status === TransactionStatus.Rejected ? null : <Trans i18nKey="wait_confirmation" />}
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss?.()}>
          <i className="icon icon-close"/>
        </button>
      </div>
      <div className="modal-content">
        {transaction?.status === TransactionStatus.Rejected ? (
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[200px] relative">
              <LottiePlayer src="/animations/failure.json" loop={false} speed={0.7}/>
            </div>
            <div className="mt-6 text-sm text-secondary">
              <Trans i18nKey="transaction_failure"/>
            </div>
            <div>
              <FormattedHash chainId={chainId} hash={hash} symbols={6} aria-label={t('open_in_explorer')}
                             data-tooltip-pos="top"/>

              <BtnCopy text={hash}/>
            </div>
            <button className="btn btn-primary btn-lg w-full mt-4" onClick={() => onDismiss?.()}>
              <Trans i18nKey="close"/>
            </button>
          </div>
        ) : transaction?.status === TransactionStatus.Confirmed ? (
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[200px] relative">
              <LottiePlayer src="/animations/success.json" loop={false} speed={0.8} onComplete={onConfirmed} />
            </div>
            <div className="mt-6 text-sm text-secondary">
              <Trans i18nKey="transaction_confirmed"/>
            </div>
            <div>
              <FormattedHash chainId={chainId} hash={hash} symbols={6} aria-label={t('open_in_explorer')}
                             data-tooltip-pos="top"/>

              <BtnCopy text={hash}/>
            </div>
            <button className="btn btn-primary btn-lg w-full mt-4" disabled={!!onConfirmed} onClick={() => onDismiss?.()}>
              <Trans i18nKey="thanks"/>!
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[200px] relative">
              <LottiePlayer src="/animations/waiting.json" loop={true} speed={1.4}/>
            </div>

            <div className="mt-6 text-sm text-secondary">
              <Trans i18nKey="waiting_for_confirmation"/>
            </div>
            <div>
              <FormattedHash chainId={chainId} hash={hash} symbols={6} aria-label={t('open_in_explorer')}
                             data-tooltip-pos="top"/>

              <BtnCopy text={hash}/>
            </div>

            <button className="btn btn-primary btn-lg w-full mt-4" onClick={() => onDismiss?.()}>
              <Trans i18nKey="close"/>
            </button>
          </div>
        )}
      </div>
    </>
  );
};