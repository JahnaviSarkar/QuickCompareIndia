const fs = require('fs');
const pages = [
  { path: 'app/scale/page.tsx', title: 'Scale', headline: 'Growth & Order Volumes', desc: 'Compare growth trajectories, order volumes, and gross order values.' },
  { path: 'app/network/page.tsx', title: 'Network', headline: 'Store Coverage & Density', desc: 'Compare dark store counts and city presence.' },
  { path: 'app/profitability/page.tsx', title: 'Profitability', headline: 'Margins & Bottom Line', desc: 'Analyze EBITDA margins and paths to profitability.' },
  { path: 'app/fees/page.tsx', title: 'Fees', headline: 'Customer Charges & Fees', desc: 'A snapshot of handling fees, surge pricing, and extra charges.' },
  { path: 'app/verdict/page.tsx', title: 'Verdict', headline: 'Build Your Verdict', desc: 'A head-to-head comparison based solely on public data. Rank apps according to your priorities.' },
  { path: 'app/sources/page.tsx', title: 'Sources', headline: 'Data & Methodology', desc: 'A complete index of every public filing, earnings call, and report cited.' },
];

pages.forEach(p => {
  if (fs.existsSync(p.path)) {
    let content = fs.readFileSync(p.path, 'utf8');
    
    // Replace the standard h1 block
    const blockRegex = /<div className="mb-8">[\s\S]*?<\/div>/;
    
    const replacement = `<div className="mb-10 max-w-2xl">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            ${p.title}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            ${p.headline}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            ${p.desc}
          </p>
        </div>`;
        
    content = content.replace(blockRegex, replacement);
    
    if (p.path === 'app/verdict/page.tsx') {
       content = content.replace(/<h2 className="text-xl font-bold">/g, '<h2 className="text-2xl font-serif font-bold">');
    }
    
    fs.writeFileSync(p.path, content);
  }
});
console.log('Pages updated');
