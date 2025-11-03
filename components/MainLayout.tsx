import React from 'react';
import { User, Page } from '../types';
import { UserIcon, LogoutIcon, BoxIcon, HammerIcon } from './icons';

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, currentPage, onNavigate, children }) => {
  const NavItem: React.FC<{ page: Page; label: string; icon: React.ReactNode }> = ({ page, label, icon }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left transition-colors duration-200 ${
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'text-slate-200 hover:bg-slate-700'
      }`}
    >
      <div className="mr-3">{icon}</div>
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-700">
          <HammerIcon className="w-6 h-6 mr-2"/>
          <span>Gestão PRO</span>
        </div>
        <nav className="flex-1 py-4">
          <NavItem page="stock" label="Gestão de Estoque" icon={<BoxIcon className="w-5 h-5" />} />
          <NavItem page="products" label="Cadastro de Produtos" icon={<HammerIcon className="w-5 h-5" />} />
        </nav>
        <div className="p-4 border-t border-slate-700">
            <div className="flex items-center">
                <UserIcon className="w-8 h-8 p-1 rounded-full bg-slate-600"/>
                <span className="ml-3 font-semibold">{user.name}</span>
            </div>
             <button
                onClick={onLogout}
                className="flex items-center w-full justify-center mt-4 px-4 py-2 text-sm text-slate-200 bg-slate-700 hover:bg-red-600 rounded-md transition-colors"
             >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Sair
            </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-6">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {currentPage === 'products' ? 'Cadastro de Produtos' : 'Gestão de Estoque'}
          </h1>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
