const axios = require('axios');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment-timezone');
const dotenv = require('dotenv').config();


const watServerIdMapping = {
    1: { apiUrl: `${process.env.API_BASE_URL_100327}`, accessToken: `Bearer ${process.env.TOKEN_100327}` },
    2: { apiUrl: `${process.env.API_BASE_URL_106416}`, accessToken: `Bearer ${process.env.TOKEN_106416}` },
    3: { apiUrl: `${process.env.API_BASE_URL_106418}`, accessToken: `Bearer ${process.env.TOKEN_106418}` },
    4: { apiUrl: `${process.env.API_BASE_URL_106410}`, accessToken: `Bearer ${process.env.TOKEN_106410}` },
    5: { apiUrl: `${process.env.API_BASE_URL_106421}`, accessToken: `Bearer ${process.env.TOKEN_106421}` },
    7: { apiUrl: `${process.env.API_BASE_URL_110947}`, accessToken: `Bearer ${process.env.TOKEN_110947}` },
    9: { apiUrl: `${process.env.API_BASE_URL_9590}`, accessToken: `Bearer ${process.env.TOKEN_9590}` },
    11: { apiUrl: `${process.env.API_BASE_URL_302010}`, accessToken: `Bearer ${process.env.TOKEN_302010}` },
    12: { apiUrl: `${process.env.API_BASE_URL_302011}`, accessToken: `Bearer ${process.env.TOKEN_302011}` },
    13: { apiUrl: `${process.env.API_BASE_URL_302012}`, accessToken: `Bearer ${process.env.TOKEN_302012}` },
    14: { apiUrl: `${process.env.API_BASE_URL_302013}`, accessToken: `Bearer ${process.env.TOKEN_302013}` },
    15: { apiUrl: `${process.env.API_BASE_URL_302014}`, accessToken: `Bearer ${process.env.TOKEN_302014}` },
    16: { apiUrl: `${process.env.API_BASE_URL_302015}`, accessToken: `Bearer ${process.env.TOKEN_302015}` },
    17: { apiUrl: `${process.env.API_BASE_URL_302016}`, accessToken: `Bearer ${process.env.TOKEN_302016}` },
    18: { apiUrl: `${process.env.API_BASE_URL_302017}`, accessToken: `Bearer ${process.env.TOKEN_302017}` },
    19: { apiUrl: `${process.env.API_BASE_URL_302018}`, accessToken: `Bearer ${process.env.TOKEN_302018}` },
    20: { apiUrl: `${process.env.API_BASE_URL_302020}`, accessToken: `Bearer ${process.env.TOKEN_302020}` },
    21: { apiUrl: `${process.env.API_BASE_URL_302234}`, accessToken: `Bearer ${process.env.TOKEN_302234}` },
    22: { apiUrl: `${process.env.API_BASE_URL_302235}`, accessToken: `Bearer ${process.env.TOKEN_302235}` },
    23: { apiUrl: `${process.env.API_BASE_URL_302236}`, accessToken: `Bearer ${process.env.TOKEN_302236}` },
    24: { apiUrl: `${process.env.API_BASE_URL_302237}`, accessToken: `Bearer ${process.env.TOKEN_302237}` },
    25: { apiUrl: `${process.env.API_BASE_URL_302238}`, accessToken: `Bearer ${process.env.TOKEN_302238}` },
    26: { apiUrl: `${process.env.API_BASE_URL_302833}`, accessToken: `Bearer ${process.env.TOKEN_302833}` },
};

let callCounter = 0;
// Function to fetch data from API for a given phone number
async function fetchDataForPhoneNumber(phoneNumber, mobNumLen) {
    const { apiUrl, accessToken } = watServerIdMapping[21];
    const url = `${apiUrl}/${phoneNumber}`;
    const headers = {
        'accept': '*/*',
        'Authorization': `${accessToken}`
    }

    try {
        const response = await axios.get(url, { headers });

        callCounter++;

        // If 200 calls reached, pause for 1 seconds
        if (callCounter % 200 === 0 && callCounter != 0) {
            console.log(`Reached ${callCounter} API calls. Pausing for 1 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if(callCounter === mobNumLen){ 
            return response.data;
        }

        
    } catch (error) {
        console.error(`Error fetching data for phone number ${phoneNumber}:`, error);
        return null;
    }
}

// Function to filter and extract relevant message data
function extractRelevantMessageData(messages) {
    return messages.items.filter(item => item.text === "*Step 1/3* : Check out the above video for a quick *Breathing Technique* to stay CALM 😊\n\n *🎥*  *Don't miss last 10 seconds*  *⬆️* \n\nPlease try it and feel the difference 😊🌬️\n\n _Remember, it's all about caring for yourself and enjoying the journey. 💖✨_ \n\nClick on the BUTTON below & learn more 👇 \r\n \r\n1. NEXT STEP \r\n \r\n");

}

// Function to write data to CSV file
async function writeToCSV(data) {
    const csvWriter = createObjectCsvWriter({
        path: `Message_WATI_21_${new Date().toISOString().slice(0, 10)}.csv`,
        header: [
            { id: 'phone', title: 'Phone' },
            { id: 'replySourceMessage', title: 'replySourceMessage' },
            { id: 'messageReferral', title: 'messageReferral' },
            { id: 'text', title: 'text' },
            { id: 'type', title: 'type' },
            { id: 'data', title: 'data' },
            { id: 'timestamp', title: 'timestamp' },
            { id: 'owner', title: 'owner' },
            { id: 'statusString', title: 'statusString' },
            { id: 'avatarUrl', title: 'avatarUrl' },
            { id: 'assignedId', title: 'assignedId' },
            { id: 'operatorName', title: 'operatorName' },
            { id: 'localMessageId', title: 'localMessageId' },
            { id: 'failedDetail', title: 'failedDetail' },
            { id: 'referenceOrderId', title: 'referenceOrderId' },
            { id: 'contacts', title: 'contacts' },
            { id: 'messageProducts', title: 'messageProducts' },
            { id: 'orderProducts', title: 'orderProducts' },
            { id: 'interactiveData', title: 'interactiveData' },
            { id: 'orderDetailsViewModel', title: 'orderDetailsViewModel' },
            { id: 'id', title: 'id' },
            { id: 'created', title: 'created' },
            { id: 'conversationId', title: 'conversationId' },
            { id: 'ticketId', title: 'ticketId' },
            { id: 'eventType', title: 'eventType' }
        ]
    });

    try {
        // Convert UTC time to IST before writing to CSV
        const dataWithIST = data.map(item => ({
            ...item,
            created: convertUTCToIST(item.created)
        }));
        await csvWriter.writeRecords(data);
        console.log('CSV file has been written successfully');
    } catch (error) {
        console.error('Error writing to CSV:', error);
    }
}

// Function to convert UTC timestamp to IST
function convertUTCToIST(utcTimestamp) {
    return moment.utc(utcTimestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
}


// Main function to orchestrate the process
async function main() {
    const phoneNumbers = await readCSV('CID20_wati_21.csv');

    const allData = [];
    let callCounter = 0;

    for (const phoneNumber of phoneNumbers) {
        const responseData = await fetchDataForPhoneNumber(phoneNumber, phoneNumbers.length);
        if (responseData && responseData.result === 'success') {
            const relevantMessages = extractRelevantMessageData(responseData.messages);
            allData.push(...relevantMessages.map(message => ({
                phone: phoneNumber,
                ...message,
                created: convertUTCToIST(message.created)
            })));

        }
    }

    await writeToCSV(allData);
}

function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const phoneNumbers = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                phoneNumbers.push(row.phone); // Store phone numbers in an array
            })
            .on("end", () => {
                resolve(phoneNumbers);
            })
            .on("error", (error) => {
                reject(`Error reading CSV file: ${error.message}`);
            });
    });
}
// Run the main function
main();