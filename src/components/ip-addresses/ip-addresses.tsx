import { FC, useRef, useState } from 'react';
import { Popover } from '../popups/popover.tsx';
import { PopupPlacement } from '../popups/popup-base/_common.ts';
import { copyText } from '../../utils/copy-text.ts';

export interface IPAddressesProps {
  addresses: string[];
}

export const IpAddresses: FC<IPAddressesProps> = ({ addresses }) => {
  const ref = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button type="button" className="" ref={ref}>
        <span className="digits">{addresses[0]}</span>
        <i className="icon icon-dropdown text-secondary text-xs ml-2"/>
      </button>

      <Popover btnOpenRef={ref} placement={PopupPlacement.BOTTOM}>
        <div className="py-1.5">
          {addresses.map(address => (<AddressRow key={address} address={address} />))}
        </div>
      </Popover>
    </>
  );
};

const AddressRow: FC<{ address: string }> = ({ address }) => {
  const ref = useRef<ReturnType<typeof setTimeout>>();
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="flex items-center justify-between w-full px-4 py-1.5 hover:bg-secondary hover:bg-opacity-70 "
      onClick={event => {
        event.stopPropagation();
        clearTimeout(ref.current);
        copyText(address).then(() => {
          setCopied(true);
          ref.current = setTimeout(() => setCopied(false), 1000);
        });
      }}
    >
      <div className="digits text-sm mr-6">{address}</div>

      {copied ? (
        <i className="icon icon-check text-xs"/>
      ) : (
        <i className="icon icon-copy text-xs"/>
      )}

    </button>
  );
};