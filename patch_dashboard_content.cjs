const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const budgetsContent = `
          {/* TAB: BUDGETS */}
          {activeTab === 'budgets' && (
            <motion.div
              key="budgets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="relative border border-white/[0.05] rounded-2xl p-8 bg-[#0a0a0b] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-8">
                <div className="absolute -inset-1 bg-gradient-to-l from-secondary/10 to-transparent blur-xl -z-10 rounded-2xl opacity-50"></div>
                <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-2">Budget Governance</div>
                
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

                {/* Budget Progress 3 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <div className="text-white font-medium mb-1">Software Services</div>
                      <div className="text-xs text-custom-text-muted">40% Consumed</div>
                    </div>
                    <div className="text-white font-mono text-sm">₹8,000 / ₹20,000</div>
                  </div>
                  <div className="h-2 w-full bg-[#101112] rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "40%" }}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                      className="h-full bg-[#5E6BFF] rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
`;

const reportsContent = `
          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="relative border border-white/[0.05] rounded-2xl p-8 bg-[#0a0a0b] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center h-[500px]">
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#b4a5ff]/10 to-transparent blur-xl -z-10 rounded-2xl opacity-50"></div>
                <div className="absolute top-6 left-6 text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Financial Summary</div>
                
                <div className="relative w-64 h-64 mt-8">
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
                    <span className="text-[10px] text-custom-text-muted uppercase tracking-widest font-mono-data mb-1">Total Net</span>
                    <span className="text-3xl text-white font-mono font-bold">₹82K</span>
                  </div>
                </div>

                {/* Legend */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="flex gap-8 mt-12 bg-[#101112] px-6 py-3 rounded-lg border border-white/[0.05]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#50d8e9]"></div>
                    <span className="text-xs text-white font-mono-data tracking-wider">INCOME</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#ffb689]"></div>
                    <span className="text-xs text-white font-mono-data tracking-wider">EXPENSE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#b4a5ff]"></div>
                    <span className="text-xs text-white font-mono-data tracking-wider">PROFIT</span>
                  </div>
                </motion.div>
                
                <div className="mt-8">
                  <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                  >
                    <Download className="w-4 h-4" /> Generate Full Report
                  </button>
                </div>
              </div>
            </motion.div>
          )}
`;

code = code.replace(
  "        </AnimatePresence>\n      </main>",
  `        </AnimatePresence>\n${budgetsContent}\n${reportsContent}\n      </main>`
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
