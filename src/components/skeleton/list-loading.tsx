import { FC } from 'react';

export const ListLoading: FC = () => {

  return (
    <div className="">
      <div className="h-[40px] w-full bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5" />
      <div className="h-[40px] w-full bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5" />
      <div className="h-[40px] w-[80%] bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5" />
      <div className="h-[40px] w-[80%] bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5" />
      <div className="h-[40px] w-[80%] bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5" />
    </div>
  );
};