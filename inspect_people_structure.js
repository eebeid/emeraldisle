const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
const workbook = XLSX.readFile(filePath);

const sheet = workbook.Sheets['People'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log("First 5 rows of People:");
data.slice(0, 5).forEach((row, i) => {
    console.log(`Row ${i}:`, row);
});
