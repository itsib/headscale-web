import type { FunctionComponent } from 'preact';

export const ListLoading: FunctionComponent = () => {
  return (
    <div className="">
      <div className="flex mb-4">
        <div className="h-[50px] min-w-[50px] rounded-full bg-skeleton bg-opacity-50 animate-pulse mb-5 me-5 row-span-2"/>
        <div className="w-full">
          <div className="h-[18px] w-full bg-skeleton rounded bg-opacity-50 animate-pulse mb-[14px]"/>
          <div className="h-[18px] w-2/3 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
        </div>
      </div>
      <div className="flex mb-4">
        <div className="h-[50px] min-w-[50px] rounded-full bg-skeleton bg-opacity-50 animate-pulse mb-5 me-5 row-span-2"/>
        <div className="w-full">
          <div className="h-[18px] w-full bg-skeleton rounded bg-opacity-50 animate-pulse mb-[14px]"/>
          <div className="h-[18px] w-2/3 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
        </div>
      </div>
      <div className="flex mb-4">
        <div className="h-[50px] min-w-[50px] rounded-full bg-skeleton bg-opacity-50 animate-pulse mb-5 me-5 row-span-2"/>
        <div className="w-full">
          <div className="h-[18px] w-full bg-skeleton rounded bg-opacity-50 animate-pulse mb-[14px]"/>
          <div className="h-[18px] w-2/3 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
        </div>
      </div>
      <div className="flex mb-4">
        <div className="h-[50px] min-w-[50px] rounded-full bg-skeleton bg-opacity-50 animate-pulse mb-5 me-5 row-span-2"/>
        <div className="w-full">
          <div className="h-[18px] w-full bg-skeleton rounded bg-opacity-50 animate-pulse mb-[14px]"/>
          <div className="h-[18px] w-2/3 bg-skeleton rounded bg-opacity-50 animate-pulse"/>
        </div>
      </div>
    </div>
  );
};