import React, { FC, useMemo } from 'react';
import { getId } from '../../utils/get-id';

interface IModalContentLoading {
  rows?: number;
}

export const ModalContentLoading: FC<IModalContentLoading> = ({ rows = 3 }) => {
  const rowsJsx = useMemo(() => new Array(rows).fill(1).map(getId), [rows]);

  return (
    <>
      <div className="modal-header">
        <div className="title w-[160px] h-[24px] rounded-[5px] skeleton"/>

        <div className="btn"/>
      </div>
      <div className="modal-content pt-4">
        <div className="py-3 flex items-center justify-between">
          <div className="h-[28px] w-[280px] rounded-[5px] skeleton"/>
          <div className="min-w-[32px] w-[32px] h-[32px] rounded-full skeleton"/>
        </div>
        {rowsJsx.map(id => (
          <div key={id} className="py-3 flex items-center justify-between">
            <div className="h-[28px] w-[200px] rounded-[5px] skeleton"/>
            <div className="min-w-[32px] w-[32px] h-[32px] rounded-full skeleton"/>
          </div>
        ))}
        <hr className="mt-4 mb-6 border-t border-t-input border-opacity-10"/>
        <div className="w-full h-[54px] rounded-full skeleton"/>
      </div>
    </>
  );
};
