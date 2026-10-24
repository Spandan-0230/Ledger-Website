import { motion } from 'motion/react';
import { CreditCard, Download, Target, Zap, Server } from 'lucide-react';

export function Features() {
  return (
    <section className="px-margin-safe py-[120px] bg-custom-bg flex flex-col gap-[120px] overflow-hidden border-t border-custom-divider">
      <div className="max-w-[1200px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="font-h2 text-h2 text-white mb-6">Built for absolute control.</h2>
          <p className="font-body-lg text-custom-text-muted max-w-2xl mx-auto">
            Experience a commanding view of your wealth. Our dashboard transforms raw data into pristine insights, ready for action.
          </p>
        </motion.div>

        <div className="flex flex-col gap-32">
          {/* Feature 1: Transactions */}
          <FeatureTransactions />

          {/* Feature 2: Budgets */}
          <FeatureBudgets />

          {/* Feature 3: Reports */}
          <FeatureReports />
        </div>
      </div>
    </section>
  );
}

function FeatureTransactions() {
  const mockTransactions = [
    { id: 1, desc: 'Uber to Airport', cat: 'Transport', amt: 840, date: 'Today' },
    { id: 2, desc: 'Team Lunch @ XYZ', cat: 'Food', amt: 1250, date: 'Yesterday' },
    { id: 3, desc: 'AWS Hosting', cat: 'Software', amt: 4500, date: 'Aug 28' },
    { id: 4, desc: 'Office Supplies', cat: 'Office', amt: 320, date: 'Aug 25' }
  ];

  return (
    <div id="transactions" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-24 -mt-24">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono-data text-xs uppercase tracking-widest mb-6 border border-primary/20">
          <Zap className="w-3 h-3" /> Auto-Categorization
        </div>
        <h3 className="font-h3 text-4xl text-white mb-6">Smart Transactions & Expenses</h3>
        <p className="font-body-lg text-custom-text-muted">
          Never tag an expense manually again. Our smart engine parses your transaction descriptions instantly, automatically categorizing them into Food, Transport, Software, and more. Keep your ledger pristine with zero effort.
        </p>
      </motion.div>

      <div className="relative border border-white/[0.05] rounded-2xl p-6 bg-[#0a0a0b] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl -z-10 rounded-2xl opacity-50"></div>
        <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-6">Live Ledger Preview</div>
        <div className="space-y-3">
          {mockTransactions.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex items-center justify-between p-4 rounded-xl bg-[#101112] border border-white/[0.05] hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-custom-text-muted" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm mb-1">{t.desc}</div>
                  <div className="text-xs text-custom-text-muted">{t.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono font-medium text-sm mb-1">₹{t.amt.toFixed(2)}</div>
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono-data uppercase bg-white/5 text-custom-text-muted">{t.cat}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureBudgets() {
  return (
    <div id="budgets" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-24 -mt-24">
      <div className="order-2 lg:order-1 relative border border-white/[0.05] rounded-2xl p-8 bg-[#0a0a0b] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-8">
        <div className="absolute -inset-1 bg-gradient-to-l from-secondary/10 to-transparent blur-xl -z-10 rounded-2xl opacity-50"></div>
        
        {/* Budget Progress 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-white font-medium mb-1">Marketing Budget</div>
              <div className="text-xs text-custom-text-muted">75% Consumed</div>
            </div>
            <div className="text-white font-mono text-sm">₹45,000 / ₹60,000</div>
          </div>
          <div className="h-2 w-full bg-[#101112] rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "75%" }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="h-full bg-secondary rounded-full"
            />
          </div>
        </motion.div>

        {/* Budget Progress 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-white font-medium mb-1">Office Operations</div>
              <div className="text-xs text-custom-text-muted text-[#ffb4ab]">90% Consumed (Warning)</div>
            </div>
            <div className="text-white font-mono text-sm">₹18,000 / ₹20,000</div>
          </div>
          <div className="h-2 w-full bg-[#101112] rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "90%" }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="h-full bg-[#ffb4ab] rounded-full shadow-[0_0_10px_rgba(255,180,171,0.5)]"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="order-1 lg:order-2"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-mono-data text-xs uppercase tracking-widest mb-6 border border-secondary/20">
          <Target className="w-3 h-3" /> Precision Targeting
        </div>
        <h3 className="font-h3 text-4xl text-white mb-6">Budgeting & Inventory Governance</h3>
        <p className="font-body-lg text-custom-text-muted">
          Set robust budgets and let the system track your burn rate in real-time. Paired with inventory lifecycle tracking, you get instant low-stock and expiry alerts, ensuring you are never caught off guard.
        </p>
      </motion.div>
    </div>
  );
}

function FeatureReports() {
  return (
    <div id="reports" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-24 -mt-24">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b4a5ff]/10 text-[#b4a5ff] font-mono-data text-xs uppercase tracking-widest mb-6 border border-[#b4a5ff]/20">
          <Server className="w-3 h-3" /> Data Export
        </div>
        <h3 className="font-h3 text-4xl text-white mb-6">Advanced Reports & Analytics</h3>
        <p className="font-body-lg text-custom-text-muted mb-8">
          Your data is yours. Generate comprehensive CSV ledger reports customized by date range (Weekly, Monthly, Annual, or Custom). Visualize historical trends with interactive line, bar, and donut charts built directly into the UI.
        </p>
        
        <motion.div 
          className="inline-flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider cursor-default shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Download className="w-4 h-4" /> Generate Report
        </motion.div>
      </motion.div>

      <div className="relative border border-white/[0.05] rounded-2xl p-8 bg-[#0a0a0b] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center h-[350px]">
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#b4a5ff]/10 to-transparent blur-xl -z-10 rounded-2xl opacity-50"></div>
        
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-xl">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#101112" strokeWidth="12" />
            
            {/* Segment 1 */}
            <motion.circle 
              cx="50" cy="50" r="40" fill="none" stroke="#50d8e9" strokeWidth="12"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              whileInView={{ strokeDashoffset: 251.2 - (251.2 * 0.45) }} 
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Segment 2 */}
            <motion.circle 
              cx="50" cy="50" r="40" fill="none" stroke="#ffb689" strokeWidth="12"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              whileInView={{ strokeDashoffset: 251.2 - (251.2 * 0.3) }} 
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              className="origin-center"
              style={{ rotate: "162deg" }} 
            />

            {/* Segment 3 */}
            <motion.circle 
              cx="50" cy="50" r="40" fill="none" stroke="#b4a5ff" strokeWidth="12"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              whileInView={{ strokeDashoffset: 251.2 - (251.2 * 0.25) }} 
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
              className="origin-center"
              style={{ rotate: "270deg" }} 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-custom-text-muted uppercase tracking-widest font-mono-data mb-1">Total</span>
            <span className="text-2xl text-white font-mono font-bold">₹82K</span>
          </div>
        </div>

        {/* Legend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex gap-6 mt-8 bg-[#101112] px-4 py-2 rounded-lg border border-white/[0.05]"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#50d8e9]"></div>
            <span className="text-[10px] text-white font-mono-data tracking-wider">INCOME</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#ffb689]"></div>
            <span className="text-[10px] text-white font-mono-data tracking-wider">EXPENSE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#b4a5ff]"></div>
            <span className="text-[10px] text-white font-mono-data tracking-wider">PROFIT</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
