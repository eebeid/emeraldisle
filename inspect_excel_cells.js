const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Activities '];

// Dump cells A1 to C30
const range = { s: { c: 0, r: 0 }, e: { c: 2, r: 30 } }; // Cols 0-2 (A-C), Rows 0-30

console.log("Dumping raw cells A1:C30...");
for (let r = range.s.r; r <= range.e.r; ++r) {
    let rowStr = `Row ${r}: `;
    for (let c = range.s.c; c <= range.e.c; ++c) {
        const cellAddr = XLSX.utils.encode_cell({ c, r });
        const cell = sheet[cellAddr];
        rowStr += `[${cell ? cell.v : 'EMPTY'}] `;
    }
    console.log(rowStr);
}
