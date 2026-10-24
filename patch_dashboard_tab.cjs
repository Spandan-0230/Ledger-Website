const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const expensesTabCode = `
          {/* TAB: EXPENSES */}
          {activeTab === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Auto Categorization Form */}
                <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 shadow-lg h-fit">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-4">Record Expense</div>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Description</label>
                      <input required value={newExpenseDesc} onChange={e => setNewExpenseDesc(e.target.value)} type="text" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="e.g. Uber to warehouse" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-mono-data text-custom-text-muted uppercase block mb-1 group-focus-within:text-primary transition-colors">Amount (₹)</label>
                      <input required value={newExpenseAmount} onChange={e => setNewExpenseAmount(e.target.value)} type="number" step="0.01" min="0" className="w-full bg-[#101112] border border-white/[0.1] rounded py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="0.00" />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold text-xs uppercase tracking-wider py-3 rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all">
                      <Plus className="w-4 h-4" /> Categorize & Record
                    </button>
                    <div className="mt-2 text-xs text-custom-text-muted text-center italic">Smart auto-categorization applied automatically based on description.</div>
                  </form>
                </div>

                {/* Donut Chart Summary */}
                <div className="lg:col-span-2 bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-6 shadow-lg h-[400px] flex flex-col">
                  <div className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-6">Spending Breakdown</div>
                  {expenseData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={120}
                          stroke="none"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={\`cell-\${index}\`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#101112', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff', fontSize: '12px' }}
                          formatter={(value) => [\`₹\${Number(value).toFixed(2)}\`, 'Amount']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-custom-text-muted font-mono-data text-sm">
                      No spending data yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Expense Ledger */}
              <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-white/[0.05]">
                  <span className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Expense Ledger</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#101112] border-b border-white/[0.05] text-[10px] font-mono-data text-custom-text-muted uppercase tracking-wider">
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Description</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium text-right">Amount (₹)</th>
                        <th className="p-4 font-medium text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      <AnimatePresence>
                        {expenses && expenses.map(exp => (
                          <motion.tr
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="hover:bg-white/[0.02] transition-colors group"
                          >
                            <td className="p-4 text-sm text-custom-text-muted whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</td>
                            <td className="p-4 text-sm text-white font-medium">{exp.description}</td>
                            <td className="p-4 text-sm">
                              <span className="bg-white/10 text-white px-2 py-1 rounded text-xs">{exp.category}</span>
                            </td>
                            <td className="p-4 text-sm text-white font-mono text-right font-medium">{exp.amount.toFixed(2)}</td>
                            <td className="p-4 text-center">
                              <button onClick={() => deleteExpense(exp.id)} className="text-custom-text-muted hover:text-[#ffb4ab] transition-colors p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      {(!expenses || expenses.length === 0) && (
                        <tr><td colSpan={5} className="p-12 text-center text-custom-text-muted font-body-md">No expenses logged.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
`;

code = code.replace(
  "          )}\n        </AnimatePresence>",
  expensesTabCode + "\n          )}\n        </AnimatePresence>"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
