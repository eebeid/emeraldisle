const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Activities '];
const range = XLSX.utils.decode_range(sheet['!ref']);

console.log(`Scanning 'Activities ' sheet (Range: ${sheet['!ref']}) for 'Brendan'...`);

let found = false;
for (let r = range.s.r; r <= range.e.r; ++r) {
    for (let c = range.s.c; c <= range.e.c; ++c) {
        const cellAddr = XLSX.utils.encode_cell({ c, r });
        const cell = sheet[cellAddr];
        if (cell && String(cell.v).includes("Brendan")) {
            console.log(`Found 'Brendan' at ${cellAddr} (Row ${r}, Col ${c})`);
            found = true;
        }
    }
}

if (!found) console.log("Did not find 'Brendan' in Activities sheet.");
