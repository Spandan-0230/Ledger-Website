import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DashboardProvider } from './context/DashboardContext';
import { AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <DashboardProvider>
      <Router basename="/Ledger-Website">
        {/* AnimatePresence for page transitions */}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </DashboardProvider>
  );
}
