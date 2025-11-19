import { memo } from 'react';
import { cn } from 'react-just-ui/utils/cn';
import './acl-tag.css';

export interface AclTagProps {
  tag: string;
  onRemove?: (tag: string) => void;
  className?: string;
}

export const AclTag = memo(
  function AclTag({ tag, className, onRemove }: AclTagProps) {
    const [prefix, name] = tag.split(':');

    return (
      <div className="acl-tag-wrapper">
        <div className={cn('acl-tag', className)}>
          <div className="tag-name">
            <span className="prefix">{prefix}:</span>
            <span className="name">{name}</span>
          </div>

          {onRemove ? (
            <button
              type="button"
              role="button"
              aria-label={`Remove ACL tag ${name}`}
              className="btn-remove"
              onClick={() => onRemove(tag)}
            >
              <i className="icon icon-close" />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
  (prev, next) => prev.tag === next.tag && next.className === prev.className
);
