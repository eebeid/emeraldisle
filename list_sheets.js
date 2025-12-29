const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
const workbook = XLSX.readFile(filePath);

console.log("All Sheet Names:", workbook.SheetNames);
