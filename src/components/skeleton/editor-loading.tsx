import { FunctionComponent } from 'preact';

export const EditorLoading: FunctionComponent = () => {
  return (
    <div className="">
      <div className="flex mb-4">
        <div className="h-[30px] w-[80px] bg-skeleton rounded bg-opacity-50 animate-pulse me-[14px]"/>
        <div className="h-[30px] w-[80px] bg-skeleton rounded bg-opacity-50 animate-pulse"/>
      </div>
      <div className="">
        <div className="h-[14px] w-2/4 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-1/4 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-5/6 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-2/6 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-2/12 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-7/12 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-3/12 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-5/12 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-3/6 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-4/6 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
        <div className="h-[14px] w-2/12 bg-skeleton rounded bg-opacity-50 animate-pulse mb-[12px]"/>
      </div>
    </div>
  );
}