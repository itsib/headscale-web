import { FC } from 'react';

export const ListLoading: FC<{ count?: number }> = ({ count = 5 }) => {

  return (
    <div className="">
      {count >= 5 ? <div className="h-[40px] w-full bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5"/> : null}
      {count >= 4 ? <div className="h-[40px] w-full bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5"/> : null}
      {count >= 3 ? <div className="h-[40px] w-[80%] bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5"/> : null}
      {count >= 2 ? <div className="h-[40px] w-[80%] bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5"/> : null}
      {count >= 1 ? <div className="h-[40px] w-[80%] bg-skeleton rounded-lg bg-opacity-50 animate-pulse mb-5"/> : null}
    </div>
  );
};