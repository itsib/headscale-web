import { FunctionComponent } from 'preact';
import './acl-tag.css';

export interface AclTagProps {
  tag: string;
  onRemove?: (tag: string) => void;
}

export const AclTag: FunctionComponent<AclTagProps> = ({ tag, onRemove }) => {
  const [prefix, name] = tag.split(':')
  return (
    <div className="acl-tag">
      <div className="tag-name">
        <span className="prefix">{prefix}:</span>
        <span className="name">{name}</span>
      </div>

      {onRemove ? (
        <button
          type="button"
          className="btn-remove"
          onClick={() => onRemove(tag)}
        >
          <i className="icon icon-close text-[9px]"/>
        </button>
      ) : null}
    </div>
  );
}