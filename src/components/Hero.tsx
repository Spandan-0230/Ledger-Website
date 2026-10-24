import { DashboardMockup } from './DashboardMockup';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const { startDemo } = useDashboard();
  const navigate = useNavigate();

  const handleDemoClick = () => {
    startDemo();
    navigate('/dashboard');
  };

  return (
    <section id="dashboard" className="px-margin-safe relative pt-32 pb-20">
      <div className="max-w-[1516px] mx-auto">
        <div className="flex justify-between items-end mb-xl">
          <div>
            <h1 className="font-h3 text-hero-headline text-on-surface mb-md max-w-[1000px]">The command dashboard<br/>for your finances</h1>
            <p className="font-body-lg text-[19px] text-custom-text-muted mb-lg max-w-2xl">Ledger turns scattered accounts, transactions, and budgets into one calm dashboard for personal wealth.</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href="/login" className="bg-white text-black px-lg py-md rounded font-body-lg font-bold">Start tracking</a>
              <button 
                onClick={handleDemoClick}
                className="border border-custom-divider px-lg py-md rounded font-body-lg transition-colors flex items-center gap-2 bg-[#1a1b1d] text-on-surface hover:bg-custom-card-bg"
              >
                See how it works
              </button>
            </div>
          </div>

        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}
