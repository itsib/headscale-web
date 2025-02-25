import { useRef, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { Popover } from '@app-components/popups/popover';
import { PopupPlacement } from '@app-components/popups/base-popup/base-popup';
import { copyText } from '@app-utils/copy-text';

export interface IPAddressesProps {
  addresses: string[];
}

export const IpAddresses: FunctionComponent<IPAddressesProps> = ({ addresses }) => {
  return (
    <Popover
      placement={PopupPlacement.BOTTOM}
      Content={() => (
        <div className="py-1.5">
          {addresses.map(address => (<AddressRow key={address} address={address}/>))}
        </div>
      )}
    >
      <button type="button" className="whitespace-nowrap">
        <span className="digits">{addresses[0]}</span>
        <i className="icon icon-dropdown text-secondary text-xs ml-2"/>
      </button>
    </Popover>
  );
};

const AddressRow: FunctionComponent<{ address: string }> = ({ address }) => {
  const ref = useRef<ReturnType<typeof setTimeout>>(null);
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="flex items-center justify-between w-full px-4 py-1.5 hover:bg-secondary hover:bg-opacity-70 "
      onClick={event => {
        event.stopPropagation();
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
        <i className="icon icon-check text-xs"/>
      ) : (
        <i className="icon icon-copy text-xs"/>
      )}

    </button>
  );
};