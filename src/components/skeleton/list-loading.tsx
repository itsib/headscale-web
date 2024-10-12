import { FC } from 'react';

export const ListLoading: FC = () => {

  return (
    <div className="">
      <div className="h-[46px] w-full bg-secondary rounded-md bg-opacity-65 animate-pulse mb-6" />
      <div className="h-[46px] w-full bg-secondary rounded-md bg-opacity-65 animate-pulse mb-6" />
      <div className="h-[46px] w-[80%] bg-secondary rounded-md bg-opacity-65 animate-pulse mb-6" />
      <div className="h-[46px] w-[80%] bg-secondary rounded-md bg-opacity-65 animate-pulse mb-6" />
    </div>
  );
};