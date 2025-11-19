import { useRef, useState } from 'react';
import type { FC } from 'react';
import { Popover } from '@app-components/popups/popover';
import { PopupPlacement } from '@app-components/popups/base-popup/base-popup';
import { copyText } from '@app-utils/copy-text';
import './ip-addresses.css';

export interface IPAddressesProps {
  addresses: string[];
}

export const IpAddresses: FC<IPAddressesProps> = ({ addresses }) => {
  return (
    <Popover
      placement={PopupPlacement.BOTTOM}
      Content={() => (
        <div className="py-1.5" role="menu">
          {addresses.map((address) => (
            <AddressRow key={address} address={address} />
          ))}
        </div>
      )}
    >
      <button
        type="button"
        role="button"
        aria-label="Open all IP addresses list"
        className="ip-addresses"
      >
        <span className="digits">{addresses[0]}</span>
        <i className="icon icon-dropdown text-secondary text-xs ml-2" />
      </button>
    </Popover>
  );
};

const AddressRow: FC<{ address: string }> = ({ address }) => {
  const ref = useRef<ReturnType<typeof setTimeout>>(null);
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      role="menuitem"
      aria-label={`IP address ${address}`}
      className="address-row"
      onClick={(event) => {
        event.preventDefault();
        if (ref.current) {
          clearTimeout(ref.current);
        }

        copyText(address).then(() => {
          setCopied(true);
          ref.current = setTimeout(() => setCopied(false), 1000);
        });
      }}
    >
      <div className="digits text-sm mr-6">{address}</div>

      {copied ? (
        <i className="icon icon-check text-xs" />
      ) : (
        <i className="icon icon-copy text-xs" />
      )}
    </button>
  );
};
