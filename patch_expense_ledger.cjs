const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  '              {/* Expense Ledger */}\n              <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl overflow-hidden shadow-lg">',
  '              {/* Expense Ledger */}\n              <div className="relative border border-white/[0.05] rounded-2xl bg-[#0a0a0b] shadow-[0_0_40px_rgba(0,0,0,0.5)]">\n                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl -z-10 rounded-2xl opacity-50"></div>'
);

code = code.replace(
  '                  <span className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em]">Expense Ledger</span>',
  '                  <span className="text-[10px] font-mono-data text-custom-text-muted uppercase tracking-[0.2em] mb-6 block">Transactions / Ledger</span>'
);

// We need to change the <tr> rows to look like the mock cards, but table rows are tricky to make look like detached cards. 
// However, the glowing container effect from the Landing page applies to the whole table wrapper now, which is a good step.

fs.writeFileSync('src/pages/Dashboard.tsx', code);
