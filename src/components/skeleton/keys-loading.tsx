import type { FunctionComponent } from 'preact';

export const KeysLoading: FunctionComponent = () => {
  return (
    <div className="">
      <div className="flex mb-4">
        <div className="h-[36px] w-[36px] min-w-[36px] rounded-full bg-skeleton bg-opacity-50 animate-pulse me-6"/>
        <div className="h-[36px] w-full flex items-center justify-between">
          <div className="h-[24px] w-6/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
          <div className="h-[24px] w-4/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
          <div className="h-[24px] w-1/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
        </div>
      </div>
      <div className="flex mb-4">
        <div className="h-[36px] w-[36px] min-w-[36px] rounded-full bg-skeleton bg-opacity-50 animate-pulse me-6"/>
        <div className="h-[36px] w-full flex items-center justify-between">
          <div className="h-[24px] w-6/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
          <div className="h-[24px] w-4/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
          <div className="h-[24px] w-1/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
        </div>
      </div>
      <div className="flex mb-4">
        <div className="h-[36px] w-[36px] min-w-[36px] rounded-full bg-skeleton bg-opacity-50 animate-pulse me-6"/>
        <div className="h-[36px] w-full flex items-center justify-between">
          <div className="h-[24px] w-6/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
          <div className="h-[24px] w-4/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
          <div className="h-[24px] w-1/12 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
        </div>
      </div>


    </div>
  );
};