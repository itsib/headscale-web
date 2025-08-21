import { FunctionComponent } from 'preact';

export const Preview: FunctionComponent<{ policy?: string | null }> = () => {
  return (
    <div className="tabs-content ui-scroll">
      <div style="max-height: calc(100vh-380px);" className="p-4 overflow-y-auto">
        In development
      </div>
    </div>
  );
};
