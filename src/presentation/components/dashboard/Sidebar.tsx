import { FC } from "react";
import { NavLink } from "react-router-dom";
import { menuRoutes } from "../../router/router";

interface SidebarProps {
  isMobileOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ isMobileOpen, closeMobileMenu }) => (
  <nav className={`
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
    sm:translate-x-0 transition-transform duration-300 ease-in-out
    fixed sm:static inset-y-0 left-0 z-40
    flex flex-col w-72 sm:w-[370px] min-h-screen sm:min-h-[calc(100vh-3.0rem)] 
    bg-gray-900 p-5 sm:ml-5 sm:rounded-3xl border-r sm:border border-gray-700
  `}>
    <div className="mb-6">
      <h1 className="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/70 to-white/40 bg-clip-text text-transparent">
        ReactGPT<span className="text-indigo-400">.</span>
      </h1>
      <span className="text-gray-200 text-xl">Bienvenido</span>
    </div>

    <div className="border-gray-700 border my-3" />

    {menuRoutes.map((option) => (
      <NavLink
        key={option.to}
        to={option.to}
        className={({ isActive }) =>
          `flex items-center mt-2 p-2 rounded-md transition-colors ${
            isActive 
              ? 'bg-gray-800 text-white' 
              : 'hover:bg-gray-800 text-gray-400'
          }`
        }
        onClick={closeMobileMenu}
      >
        <i className={`${option.icon} text-2xl mr-4 text-indigo-400`}></i>
        <div className="flex flex-col flex-grow">
          <span className="text-lg font-semibold">{option.title}</span>
          <span className="text-sm text-gray-400">{option.description}</span>
        </div>
      </NavLink>
    ))}
  </nav>
);