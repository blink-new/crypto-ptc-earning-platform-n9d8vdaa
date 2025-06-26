import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Wallet, Users, Zap, User as UserIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';

const Layout: React.FC = () => {
  const { user } = useUser();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/tasks', icon: Zap, label: 'Tasks', gradient: 'from-yellow-500 to-orange-500' },
    { to: '/wallet', icon: Wallet, label: 'Wallet', gradient: 'from-green-500 to-emerald-500' },
    { to: '/referrals', icon: Users, label: 'Referrals', gradient: 'from-purple-500 to-pink-500' },
    { to: '/profile', icon: UserIcon, label: 'Profile', gradient: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 glass-strong border-r border-white/10 relative">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-crypto-orange/5 to-crypto-red/5 pointer-events-none" />
        
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crypto-orange to-crypto-red flex items-center justify-center animate-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text-crypto">
                  CryptoPTC
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Earn Real Crypto</p>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="mb-8 p-4 rounded-2xl glass border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text-crypto mb-1">
                {user ? (user.points / 10000).toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">USD Balance</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? `glass-strong border border-white/20 text-white`
                          : 'text-muted-foreground hover:text-white hover:glass'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10`} />
                        )}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-all duration-300 ${
                          isActive 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg animate-glow` 
                            : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium relative z-10">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="text-xs text-muted-foreground text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>System Online</span>
              </div>
              <p>&copy; 2024 CryptoPTC</p>
            </div>
          </div>
        </div>

        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-crypto-orange animate-float" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-crypto-red animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;