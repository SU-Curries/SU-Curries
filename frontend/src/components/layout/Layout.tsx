import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-primary-bg text-text-primary">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8 pb-20 md:pb-8">
        {children || <Outlet />}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;