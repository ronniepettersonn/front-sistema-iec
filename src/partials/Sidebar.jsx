import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PermissionComponent } from '../components/PermissionComponent';

import SidebarLinkGroup from './SidebarLinkGroup';

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-900 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/dashboard" className="block">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                  <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                  <stop stopColor="#A5B4FC" offset="100%" />
                </linearGradient>
                <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                  <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                  <stop stopColor="#38BDF8" offset="100%" />
                </linearGradient>
              </defs>
              <rect fill="#6366F1" width="32" height="32" rx="16" />
              <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
              <path
                d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                fill="url(#logo-a)"
              />
              <path
                d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                fill="url(#logo-b)"
              />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Páginas</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}

              <PermissionComponent role={"ROLE_ADMIN,ROLE_USER"}>

                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('dashboard') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/dashboard"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('dashboard') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="grow flex items-center">
                        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                          <path
                            className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-500' : 'text-slate-400'
                              }`}
                            d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                          />
                          <path
                            className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-600' : 'text-slate-600'
                              }`}
                            d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                          />
                          <path
                            className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-200' : 'text-slate-400'
                              }`}
                            d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Dashboard
                        </span>
                      </div>

                    </div>
                  </NavLink>
                </li>
              </PermissionComponent>

              {/* Membros */}

              <PermissionComponent role={"ROLE_ADMIN"}>
                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('members') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/members"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('members') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="grow flex items-center">


                        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                          <path
                            className={`fill-current ${pathname.includes('members') ? 'text-indigo-500' : 'text-slate-600'}`} d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z"
                          />
                          <path
                            className={`fill-current ${pathname.includes('members') ? 'text-indigo-300' : 'text-slate-400'}`} d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Membros
                        </span>
                      </div>

                    </div>
                  </NavLink>
                </li>
              </PermissionComponent>

              {/* Visitantes */}
              <PermissionComponent role={"ROLE_ADMIN,ROLE_USER"}>
                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('visit') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/visit"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('visit') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${pathname.includes('visit') ? 'text-indigo-500' : 'text-slate-600'}`}
                          d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z"
                        />
                        <path
                          className={`fill-current ${pathname.includes('visit') ? 'text-indigo-300' : 'text-slate-400'}`}
                          d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z"
                        />
                      </svg>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Visitantes</span>
                    </div>
                  </NavLink>
                </li>
              </PermissionComponent>

              {/* Financeiro */}
              <PermissionComponent role={"ROLE_ADMIN"}>
                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('financial') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/financial"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('financial') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center">


                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path className={`fill-current ${pathname.includes('financial') ? 'text-indigo-500' : 'text-slate-600'}`} d="M13 6.068a6.035 6.035 0 0 1 4.932 4.933H24c-.486-5.846-5.154-10.515-11-11v6.067Z" />
                        <path className={`fill-current ${pathname.includes('financial') ? 'text-indigo-300' : 'text-slate-400'}`} d="M18.007 13c-.474 2.833-2.919 5-5.864 5a5.888 5.888 0 0 1-3.694-1.304L4 20.731C6.131 22.752 8.992 24 12.143 24c6.232 0 11.35-4.851 11.857-11h-5.993Z" />
                        <path className={`fill-current ${pathname.includes('financial') ? 'text-indigo-700' : 'text-slate-700'}`} d="M6.939 15.007A5.861 5.861 0 0 1 6 11.829c0-2.937 2.167-5.376 5-5.85V0C4.85.507 0 5.614 0 11.83c0 2.695.922 5.174 2.456 7.17l4.483-3.993Z" />
                      </svg>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Financeiro
                      </span>
                    </div>
                  </NavLink>
                </li>

              </PermissionComponent>

              {/* Cultos */}
              <PermissionComponent role={"ROLE_ADMIN,ROLE_USER"}>
                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('cult') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/cult"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('cult') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${pathname.includes('cult') ? 'text-indigo-500' : 'text-slate-600'}`}
                          d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                        />
                        <path
                          className={`fill-current ${pathname.includes('cult') ? 'text-indigo-300' : 'text-slate-400'}`}
                          d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                        />
                      </svg>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Cultos
                      </span>
                    </div>
                  </NavLink>
                </li>
              </PermissionComponent>

              {/* Usuários */}
              <PermissionComponent role={"ROLE_ADMIN"}>
                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('users') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/users"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('users') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${pathname.includes('users') ? 'text-indigo-500' : 'text-slate-600'}`}
                          d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                        />
                        <path
                          className={`fill-current ${pathname.includes('users') ? 'text-indigo-300' : 'text-slate-400'}`}
                          d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                        />
                      </svg>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Usuários
                      </span>
                    </div>
                  </NavLink>
                </li>
              </PermissionComponent>

            </ul>
          </div>
          {/* More group */}
          <div>
            <PermissionComponent role={"ROLE_ADMIN"}>
              <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
                <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                  •••
                </span>
                <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Cadastros</span>
              </h3>
            </PermissionComponent>

            <ul className="mt-3">

              {/* Usuário */}

              <PermissionComponent role={"ROLE_ADMIN"}>
                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('/create/user') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/create/user"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('/create/user') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${pathname.includes('/create/user') ? 'text-indigo-500' : 'text-slate-600'}`}
                          d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                        />
                        <path
                          className={`fill-current ${pathname.includes('/create/user') ? 'text-indigo-300' : 'text-slate-400'}`}
                          d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                        />
                      </svg>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Usuário
                      </span>
                    </div>
                  </NavLink>
                </li>
              </PermissionComponent>

              {/* Permissões */}

              <PermissionComponent role={"ROLE_ADMIN"}>
                <li className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname.includes('/roles/create') && 'bg-slate-800'}`}>
                  <NavLink
                    end
                    to="/roles/create"
                    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('/roles/create') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                  >
                    <div className="flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${pathname.includes('/roles/create') ? 'text-indigo-500' : 'text-slate-600'}`}
                          d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                        />
                        <path
                          className={`fill-current ${pathname.includes('/roles/create') ? 'text-indigo-300' : 'text-slate-400'}`}
                          d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                        />
                      </svg>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Permissões
                      </span>
                    </div>
                  </NavLink>
                </li>
              </PermissionComponent>

              {/* Agenda */}
              <PermissionComponent role={"ROLE_ADMIN"}>
                <SidebarLinkGroup activecondition={pathname.includes('/agenda')}>
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <a
                          href="#0"
                          className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('/agenda') ? 'hover:text-slate-200' : 'hover:text-white'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                                <circle
                                  className={`fill-current ${pathname.includes('/agenda') ? 'text-indigo-500' : 'text-slate-600'}`}
                                  cx="16"
                                  cy="8"
                                  r="8"
                                />
                                <circle
                                  className={`fill-current ${pathname.includes('/agenda') ? 'text-indigo-300' : 'text-slate-400'}`}
                                  cx="8"
                                  cy="16"
                                  r="8"
                                />
                              </svg>
                              <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Agenda
                              </span>
                            </div>
                            {/* Icon */}
                            <div className="flex shrink-0 ml-2">
                              <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                              </svg>
                            </div>
                          </div>
                        </a>
                        <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                          <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/agenda/pregacao"
                                className={({ isActive }) =>
                                  'block transition duration-150 truncate ' + (pathname.includes('/agenda/pregacao') ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                }
                              >
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Pregações
                                </span>
                              </NavLink>
                            </li>
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/agenda/gabinete"
                                className={({ isActive }) =>
                                  'block transition duration-150 truncate ' + (pathname.includes('/agenda/gabinete') ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                }
                              >
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Gabinetes
                                </span>
                              </NavLink>
                            </li>
                            <li className="mb-1 last:mb-0">
                              <NavLink
                                end
                                to="/agenda/evento"
                                className={({ isActive }) =>
                                  'block transition duration-150 truncate ' + (pathname.includes('/agenda/evento') ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                }
                              >
                                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Eventos
                                </span>
                              </NavLink>
                            </li>

                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              </PermissionComponent>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div >
    </div >
  );
}


