
const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
try {
    const workbook = XLSX.readFile(filePath);
    const peopleSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('people')) || 'People';
    const sheet = workbook.Sheets[peopleSheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 0 }); // Use header row keys
    console.log('Sample Data (First 3 rows):', data.slice(0, 3));
} catch (error) {
    console.error(error);
}
