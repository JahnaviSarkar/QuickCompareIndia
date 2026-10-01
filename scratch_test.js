const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/company-metrics.json', 'utf8'));

const quarters = Array.from(new Set(data.quarterly.filter(d => d.darkStores != null).map(d => d.quarter))).sort();
console.log("Quarters:", quarters);

const chartData = quarters.map(q => {
  const dataPoint = { quarter: q };
  data.apps.forEach(app => {
    const appData = data.quarterly.find(d => d.appId === app.id && d.quarter === q);
    if (appData && appData.darkStores) {
      dataPoint[app.id] = appData.darkStores;
    }
  });
  return dataPoint;
});

console.log("Chart Data:", chartData);

const activeApps = data.apps.filter(app => chartData.some(d => d[app.id] != null));
console.log("Active Apps:", activeApps.map(a => a.id));
