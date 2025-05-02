import { FC } from "react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

export const MobileMenuButton: FC<MobileMenuButtonProps> = ({ isOpen, toggle }) => (
  <button 
    className="sm:hidden fixed right-4 top-4 z-50 p-3 rounded-lg bg-gray-800 text-white"
    onClick={toggle}
  >
    <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
  </button>
);