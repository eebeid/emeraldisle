const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
const workbook = XLSX.readFile(filePath);

const sheet = workbook.Sheets['Activities ']; // Note the space
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log("Checking for Signup Data (Matrix?)...");
console.log("Row 0 (Potential Header?):", data[0]);
console.log("Row 1:", data[1]);
console.log("Row 2:", data[2]);
// Print a slice of columns if it's wide
// Check ALL rows for any that are longer than 4 items
console.log("Scanning all rows for width > 4...");
data.forEach((row, i) => {
    if (row.length > 4) {
        console.log(`Row ${i} has ${row.length} cols:`, row);
    }
});

// Also check People sheet again, maybe the signups are there?
const pSheet = workbook.Sheets['People'];
const pData = XLSX.utils.sheet_to_json(pSheet, { header: 1 });
console.log("People Sheet Row 0:", pData[0]);
// Check if People rows have extra columns
pData.slice(0, 5).forEach((row, i) => {
    if (row.length > 4) {
        console.log(`People Row ${i} extra cols:`, row.slice(4));
    }
});

