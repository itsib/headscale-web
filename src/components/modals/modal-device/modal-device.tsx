import './modal-device.css';
import { FunctionComponent } from 'preact';
import { Device } from '@app-types';
import { Modal, ModalProps } from 'react-just-ui/modal';
import { useTranslation } from 'react-i18next';

export interface ModalDeviceProps extends ModalProps {
  device?: Device | null;
}

export const ModalDevice: FunctionComponent<ModalDeviceProps> = ({ isOpen, onDismiss, device }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent onDismiss={onDismiss} device={device} />
    </Modal>
  );
};

function ModalContent({ onDismiss }: Omit<ModalDeviceProps, 'isOpen'>) {
  const { t } = useTranslation();


  return (
    <div className="modal modal-device">
      <div className="modal-header">
        <div className="title">
          <span>{t('device_info')}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={onDismiss} />
      </div>
      <div className="modal-content">
        
      </div>
    </div>
  );
}