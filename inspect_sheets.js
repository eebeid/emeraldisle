
const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
try {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', workbook.SheetNames);

    workbook.SheetNames.forEach(name => {
        const sheet = workbook.Sheets[name];
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
        console.log(`Sheet: "${name}" - Headers:`, headers);
    });
} catch (error) {
    console.error("Error reading file:", error.message);
}
