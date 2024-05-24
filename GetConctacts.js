const fs = require('fs');
const ExcelJS = require('exceljs');
const moment = require('moment-timezone');

function convertUTCToIST(utcTimestamp) {
    return moment.utc(utcTimestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
}

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Create a new Excel workbook and worksheet
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Contacts');

// Define column headers
const headers = [
    'id',
    'tenantId',
    'wAid',
    'firstName',
    'fullName',
    'phone',
    'source',
    'contactStatus',
    'photo',
    'created',
    'name',
    'phone',
    'user_slug',
    'dashboard_link',
    'lead_status',
    'group_link',
    'orientation_date',
    '6days_test',
    '6day_test',
    'paymentdone',
    'karmapoints',
    'level',
    'optedIn',
    'isDeleted',
    'lastUpdated',
    'allowBroadcast',
    'allowSMS',
    'teamIds',
    'isInFlow',
    'lastFlowId',
    'currentFlowNodeId',
    'selectedHubspotId'
];


worksheet.addRow(headers);


jsonData.contact_list.forEach(contact => {
    const rowData = [
        contact.id,
        contact.tenantId,
        contact.wAid,
        contact.firstName,
        contact.fullName,
        contact.phone,
        contact.source,
        contact.contactStatus,
        contact.photo,
        convertUTCToIST(contact.created),

        contact.customParams.find(param => param.name === 'name')?.value || '',
        contact.customParams.find(param => param.name === 'phone')?.value || '',
        contact.customParams.find(param => param.name === 'user_slug')?.value || '',
        contact.customParams.find(param => param.name === 'dashboard_link')?.value || '',
        contact.customParams.find(param => param.name === 'lead_status')?.value || '',
        contact.customParams.find(param => param.name === 'group_link')?.value || '',
        contact.customParams.find(param => param.name === 'orientation_date')?.value || '',
        contact.customParams.find(param => param.name === '6days_test')?.value || '',
        contact.customParams.find(param => param.name === '6day_test')?.value || '',
        contact.customParams.find(param => param.name === 'paymentdone')?.value || '',
        contact.customParams.find(param => param.name === 'karmapoints')?.value || '',
        contact.customParams.find(param => param.name === 'level')?.value || '',
        contact.optedIn,
        contact.isDeleted,
        contact.lastUpdated,
        contact.allowBroadcast,
        contact.allowSMS,
        contact.teamIds,
        contact.isInFlow,
        contact.lastFlowId,
        contact.currentFlowNodeId,
        contact.selectedHubspotId

    ];
    worksheet.addRow(rowData);
});

const todays_date = new Date().toISOString().slice(0, 10);
// Write the workbook to a file
workbook.xlsx.writeFile(`wati_6_${todays_date}.xlsx`)
    .then(() => {
        console.log('Excel file created successfully.');
    })
    .catch(err => {
        console.error('Error creating Excel file:', err);
    });
