import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Referrals from './pages/Referrals';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminWithdrawals from './pages/AdminWithdrawals';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
      </Route>
    </Routes>
  );
}

export default App;