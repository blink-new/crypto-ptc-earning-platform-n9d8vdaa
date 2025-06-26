import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, DollarSign, Shield } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navItems = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/withdrawals', icon: DollarSign, label: 'Withdrawals' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-4">
        <div className="text-2xl font-bold mb-8 flex items-center space-x-2">
          <Shield className="w-6 h-6 text-crypto-orange" />
          <span>Admin Panel</span>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-crypto-orange text-white'
                        : 'hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;