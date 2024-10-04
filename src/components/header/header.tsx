import { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Trans } from 'react-i18next';

export const Header: FC = () => {
  return (
    <header className="bg-secondary dark:border-gray-800 border-b-primary">
      <div className="container flex items-center justify-between h-[60px]">
        <Link className="flex items-center" to="/">
          <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
               className="w-[18px] h-[18px] -top-[1px] relative">
            <circle opacity="0.2" cx="3.4" cy="3.25" r="2.7" fill="currentColor"/>
            <circle cx="3.4" cy="11.3" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="3.4" cy="19.5" r="2.7" fill="currentColor"/>
            <circle cx="11.5" cy="11.3" r="2.7" fill="currentColor"/>
            <circle cx="11.5" cy="19.5" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="11.5" cy="3.25" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="19.5" cy="3.25" r="2.7" fill="currentColor"/>
            <circle cx="19.5" cy="11.3" r="2.7" fill="currentColor"/>
            <circle opacity="0.2" cx="19.5" cy="19.5" r="2.7" fill="currentColor"/>
          </svg>
          <div className="text-lg ml-4">
            <span className="font-bold">Tailnet</span>
          </div>
        </Link>

        <nav className="ml-10 mr-auto flex gap-3">
          <NavLink to="/machines"
                   className={({ isActive }) => `flex items-center px-2 font-bold transition ${isActive ? 'text-accent' : ''}`}>
            <i className="icon icon-machines mr-1.5"/>
            <Trans i18nKey="machines"/>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `flex items-center px-2 font-bold transition ${isActive ? 'text-accent' : ''}`}>
            <i className="icon icon-users mr-1.5" />
            <Trans i18nKey="users"/>
          </NavLink>
        </nav>

        <div className="">

        </div>
      </div>
    </header>
  );
}