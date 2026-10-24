const fs = require('fs');
let code = fs.readFileSync('src/pages/Landing.tsx', 'utf8');

code = code.replace(
  '      </main>\n    </motion.div>',
  `      </main>\n      <footer className="w-full border-t border-custom-divider py-8 text-center text-custom-text-muted font-mono-data text-xs bg-custom-bg mt-auto z-10 relative">\n        <div className="flex items-center justify-center gap-2">\n          <span>Made with</span>\n          <span className="text-[#ffb4ab]">♥</span>\n          <span>in 2026. Ledger Financial Inc. All rights reserved.</span>\n        </div>\n      </footer>\n    </motion.div>`
);

fs.writeFileSync('src/pages/Landing.tsx', code);
