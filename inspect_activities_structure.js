const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
const workbook = XLSX.readFile(filePath);

// Note the trailing space in the sheet name from previous step
const sheet = workbook.Sheets['Activities '];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays

console.log("First 5 rows of Activities:");
data.slice(0, 5).forEach((row, i) => {
    console.log(`Row ${i}:`, row);
});
