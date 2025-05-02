import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MainContent, MobileMenuButton, Sidebar } from "../components";

export const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="flex flex-col sm:flex-row mt-3 sm:mt-7">
      <MobileMenuButton 
        isOpen={mobileMenuOpen} 
        toggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
      />
      
      <Sidebar 
        isMobileOpen={mobileMenuOpen} 
        closeMobileMenu={() => setMobileMenuOpen(false)} 
      />
      
      <MainContent isMenuOpen={mobileMenuOpen}>
        <Outlet />
      </MainContent>
    </main>
  );
};