import { motion, useScroll, useTransform } from 'motion/react';

export function DashboardMockup() {
  const { scrollY } = useScroll();
  const graphX1 = useTransform(scrollY, [0, 800], [0, -100]);
  const graphX2 = useTransform(scrollY, [0, 800], [0, 60]);
  const nodesY = useTransform(scrollY, [0, 800], [0, -30]);

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.6,
      transition: {
        pathLength: { type: "spring", duration: 2, bounce: 0, delay: 0.2 },
        opacity: { duration: 0.1, delay: 0.2 }
      }
    }
  };

  const drawLine = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "100%",
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
    }
  };

  const fadeItem = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.8 + i * 0.2 }
    })
  };

  return (
    <div className="w-full bg-[#050505] rounded-xl border border-white/[0.05] overflow-hidden flex h-[620px] shadow-2xl relative">
      <div className="flex w-full h-full">
        {/* Left Panel */}
        <div className="w-[280px] border-r border-white/[0.03] flex flex-col bg-[#070708]">
          <div className="p-6 border-b border-white/[0.03]">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(80,216,233,0.5)]"></div>
              <span className="text-[10px] font-mono-data text-on-surface font-bold tracking-widest uppercase">LEDGER_SYNC</span>
            </div>
            <div className="text-[10px] font-mono-data text-custom-text-muted/60 tracking-[0.2em] ml-5">USR_982F</div>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-8 overflow-hidden">
            <div>
              <span className="text-[9px] font-mono-data text-custom-text-muted/40 uppercase tracking-[0.2em] block mb-3 border-b border-white/[0.03] pb-2">NET_WORTH</span>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[20px] font-mono-data text-on-surface/80 leading-none">$142,910</span>
                <span className="text-[9px] font-mono-data text-secondary/60">+2.4%</span>
              </div>
              <motion.svg initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} className="w-full h-8 mt-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                <motion.path variants={draw} d="M0,15 L10,12 L20,18 L30,5 L40,10 L50,8 L60,14 L70,2 L80,12 L90,8 L100,10" fill="none" stroke="#454655" strokeWidth="0.5"></motion.path>
              </motion.svg>
            </div>
            <div>
              <span className="text-[9px] font-mono-data text-custom-text-muted/40 uppercase tracking-[0.2em] block mb-3 border-b border-white/[0.03] pb-2">MONTHLY_SPEND</span>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[20px] font-mono-data text-on-surface/80 leading-none">$3,240</span>
                <span className="text-[9px] font-mono-data text-primary/60">/ $4k</span>
              </div>
              <motion.svg initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} className="w-full h-8 mt-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                <motion.path variants={draw} d="M0,10 L10,8 L20,12 L30,4 L40,15 L50,5 L60,10 L70,8 L80,12 L90,6 L100,8" fill="none" stroke="#5E6BFF" strokeWidth="0.5"></motion.path>
              </motion.svg>
            </div>
            <div>
              <span className="text-[9px] font-mono-data text-custom-text-muted/40 uppercase tracking-[0.2em] block mb-3 border-b border-white/[0.03] pb-2">SAVINGS_RATE</span>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[20px] font-mono-data text-on-surface/80 leading-none">28.4%</span>
                <span className="text-[9px] font-mono-data text-custom-text-muted/60">AVG</span>
              </div>
              <motion.svg initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} className="w-full h-8 mt-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                <motion.path variants={draw} d="M0,14 L10,16 L20,10 L30,12 L40,8 L50,14 L60,6 L70,8 L80,2 L90,6 L100,4" fill="none" stroke="#E5FD17" strokeWidth="0.5"></motion.path>
              </motion.svg>
            </div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col relative bg-[#050505]">
          <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '80px 80px'}}></div>
          <div className="flex justify-between items-center px-10 py-6 border-b border-white/[0.03] z-10 bg-[#050505]/80 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono-data text-on-surface uppercase tracking-[0.1em]">CASH_FLOW.DELTA // Q3</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono-data text-custom-text-muted/40 uppercase tracking-[0.2em]">UPDATED: LIVE</span>
            </div>
          </div>

          <div className="flex-1 relative p-10 z-10 flex flex-col justify-end pb-16">
            <div className="absolute inset-0 px-10 py-16 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-white/[0.02] w-full relative"><span className="absolute -top-3 -left-6 text-[8px] font-mono-data text-custom-text-muted/30">10k</span></div>
              <div className="border-t border-white/[0.02] w-full relative"><span className="absolute -top-3 -left-6 text-[8px] font-mono-data text-custom-text-muted/30">5k</span></div>
              <div className="border-t border-white/[0.02] w-full relative"><span className="absolute -top-3 -left-6 text-[8px] font-mono-data text-custom-text-muted/30">0</span></div>
              <div className="border-t border-white/[0.02] w-full relative"><span className="absolute -top-3 -left-6 text-[8px] font-mono-data text-custom-text-muted/30">-5k</span></div>
            </div>

            <div className="absolute inset-0 px-10 py-16 overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400" style={{ overflow: 'visible' }}>
                <motion.g style={{ x: graphX1 }}>
                  <path d="M-200,250 L0,250 C150,250 250,150 400,150 C550,150 650,300 800,300 C950,300 1100,200 1200,200" fill="none" stroke="#50d8e9" strokeWidth="1.5"></path>
                  <path d="M-200,250 L0,250 C150,250 250,150 400,150 C550,150 650,300 800,300 C950,300 1100,200 1200,200 L1200,400 L-200,400 Z" fill="url(#primary-fade)" opacity="0.1"></path>
                  
                  <circle cx="400" cy="150" fill="#050505" r="3" stroke="#50d8e9" strokeWidth="1.5"></circle>
                  <circle cx="800" cy="300" fill="#050505" r="3" stroke="#50d8e9" strokeWidth="1.5"></circle>

                  <g transform="translate(415, 140)">
                    <text fill="#50d8e9" fontFamily="Inter" fontSize="9" fontWeight="500" opacity="0.9">INCOME_PEAK</text>
                    <line opacity="0.5" stroke="#50d8e9" strokeWidth="0.5" x1="-12" x2="-6" y1="12" y2="6"></line>
                  </g>
                  <g transform="translate(815, 290)">
                    <text fill="#50d8e9" fontFamily="Inter" fontSize="9" fontWeight="500" opacity="0.9">EXPENSE_DROP</text>
                    <line opacity="0.5" stroke="#50d8e9" strokeWidth="0.5" x1="-12" x2="-6" y1="12" y2="6"></line>
                  </g>
                </motion.g>

                <motion.g style={{ x: graphX2, y: nodesY }}>
                  <path d="M-200,200 L0,200 L100,180 L250,220 L400,140 L550,260 L700,100 L850,240 L1000,160 L1200,160" fill="none" opacity="0.6" stroke="#5E6BFF" strokeDasharray="2 4" strokeWidth="1"></path>
                  <circle cx="700" cy="100" fill="#5E6BFF" r="2"></circle>
                  <g transform="translate(710, 95)">
                    <text fill="#5E6BFF" fontFamily="Inter" fontSize="8" fontWeight="500" opacity="0.8">TAX_PAYMENT</text>
                  </g>
                </motion.g>
                
                <defs>
                  <linearGradient id="primary-fade" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#50d8e9" stopOpacity="1"></stop>
                    <stop offset="100%" stopColor="#50d8e9" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="absolute bottom-6 left-10 right-10 flex justify-between text-[8px] font-mono-data text-custom-text-muted/40 uppercase tracking-[0.2em] z-20">
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[320px] border-l border-white/[0.03] flex flex-col bg-[#070708] z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="h-1/2 border-b border-white/[0.03] p-6 flex flex-col">
            <span className="text-[9px] font-mono-data text-custom-text-muted/40 uppercase tracking-[0.2em] mb-6">BUDGET_SUMMARY</span>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex justify-between items-center p-3 border border-white/[0.03] bg-[#0a0a0b] rounded">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <span className="text-[10px] font-mono-data text-on-surface uppercase">HOUSING</span>
                </div>
                <span className="text-[10px] font-mono-data text-secondary">OK // 100%</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-white/[0.03] bg-[#0a0a0b] rounded">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-mono-data text-on-surface uppercase">GROCERIES</span>
                </div>
                <span className="text-[10px] font-mono-data text-primary">WARN // 94%</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-white/[0.03] bg-[#0a0a0b] rounded opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <span className="text-[10px] font-mono-data text-on-surface uppercase">ENTERTAINMENT</span>
                </div>
                <span className="text-[10px] font-mono-data text-custom-text-muted">STABLE</span>
              </div>
            </div>
          </div>

          <div className="h-1/2 p-6 flex flex-col bg-[#050505]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[9px] font-mono-data text-custom-text-muted/40 uppercase tracking-[0.2em]">RECENT_TRANSACTIONS</span>
              <span className="text-[8px] font-mono-data text-secondary/40 border border-secondary/20 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <motion.div initial="hidden" animate="visible" variants={drawLine} className="absolute top-2 left-[5px] w-px bg-white/[0.05]"></motion.div>
              <div className="space-y-5">
                <motion.div custom={0} initial="hidden" animate="visible" variants={fadeItem} className="relative pl-6">
                  <div className="absolute left-[3.5px] top-1.5 w-[4px] h-[4px] rounded-full bg-white/40"></div>
                  <div className="text-[9px] font-mono-data text-custom-text-muted/40 uppercase mb-1">08:42:11.02</div>
                  <div className="text-[10px] font-mono-data text-on-surface/80">WHOLE_FOODS // -$142.50</div>
                </motion.div>
                <motion.div custom={1} initial="hidden" animate="visible" variants={fadeItem} className="relative pl-6">
                  <div className="absolute left-[3.5px] top-1.5 w-[4px] h-[4px] rounded-full bg-secondary"></div>
                  <div className="text-[9px] font-mono-data text-secondary/60 uppercase mb-1">08:41:05.99</div>
                  <div className="text-[10px] font-mono-data text-on-surface">PAYROLL_DEPOSIT // +$4,120.00</div>
                </motion.div>
                <motion.div custom={2} initial="hidden" animate="visible" variants={fadeItem} className="relative pl-6">
                  <div className="absolute left-[3.5px] top-1.5 w-[4px] h-[4px] rounded-full bg-white/20"></div>
                  <div className="text-[9px] font-mono-data text-custom-text-muted/30 uppercase mb-1">08:35:22.14</div>
                  <div className="text-[10px] font-mono-data text-on-surface/50">NETFLIX_SUB // -$15.99</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
