import { FunctionComponent } from 'preact';

export const Preview: FunctionComponent<{ policy?: string | null }> = ()=>  {
  return (
    <div className="tabs-content ui-scroll">
      <div className="p-4 max-h-[calc(100vh-380px)] overflow-y-auto">
        In development
      </div>
    </div>
  );
};
