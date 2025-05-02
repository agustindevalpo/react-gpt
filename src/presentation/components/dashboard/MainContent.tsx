import { FC, ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
  isMenuOpen: boolean;
}

export const MainContent: FC<MainContentProps> = ({ children, isMenuOpen }) => (
  <>
    {isMenuOpen && (
      <div 
        className="sm:hidden fixed inset-0 bg-black/50 z-30"
        onClick={() => {}}
      />
    )}

    <section className="mx-2 sm:mx-5 lg:mx-20 flex flex-col w-full h-[calc(100vh-50px)] bg-gray-900 p-3 sm:p-5 rounded-3xl border border-gray-700">
      <div className="flex flex-row h-full">
        <div className="flex flex-col flex-auto h-full p-1 text-gray-100 overflow-y-auto">
          {children}
        </div>
      </div>
    </section>
  </>
);