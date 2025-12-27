
const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'resources', 'Emerald Isle 2025_26.xlsx');
const workbook = XLSX.readFile(filePath);
const peopleSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('people')) || 'People';
const sheet = workbook.Sheets[peopleSheetName];
const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
console.log('People Sheet Headers:', headers);
