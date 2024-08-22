const noble = require('@abandonware/noble');

// The advertising UUID to scan for
const TARGET_ADVERTISING_NAME = 'Revolute';
// The service UUID to look for after connecting
const TARGET_SERVICE_UUID = '00000000000000000000003323de1223';

const PERIPHERAL_UUID = 'd02894667120';

noble.on('stateChange', state => {
    if (state === 'poweredOn') {
        console.log('Bluetooth is powered on. Starting scan...');
        noble.startScanning();
    } else {
        console.log('Bluetooth is not powered on.');
        noble.stopScanning();
    }
});

noble.on('discover', async peripheral => {
    // Check if the discovered peripheral has the target advertising UUID
    if (peripheral.advertisement.localName === TARGET_ADVERTISING_NAME && peripheral.uuid === PERIPHERAL_UUID) {
        console.log(`Discovered target device: ${peripheral.advertisement.localName}`);
        console.log(`  Peripheral UUID: ${peripheral.uuid}`);
        console.log(`  RSSI: ${peripheral.rssi}`);

        try {
            // Connect to the peripheral
            await peripheral.connectAsync();
            console.log(`Connected to ${peripheral.advertisement.localName}`);

            // Discover services
            const services = await peripheral.discoverServicesAsync();
            let foundTargetService = false;
            for (const service of services) {
                console.log(`  Service UUID: ${service.uuid}`);
                
                // Check if the service UUID matches the target
                if (service.uuid === TARGET_SERVICE_UUID) {
                    foundTargetService = true;
                    // Discover characteristics for each service
                    const characteristics = await service.discoverCharacteristicsAsync();
                    for (const characteristic of characteristics) {
                        console.log(`    Characteristic UUID: ${characteristic.uuid}`);
                    }
                    break; // We found the service we're interested in, no need to search further
                }
            }

            if (!foundTargetService) {
                console.log(`  Target service UUID ${TARGET_SERVICE_UUID} not found.`);
            }

            // Disconnect from the peripheral
            await peripheral.disconnectAsync();
            console.log(`Disconnected from ${peripheral.advertisement.localName}`);
        } catch (error) {
            console.error(`Error connecting or discovering services: ${error.message}`);
        }

        console.log('---------------------------------------------------');
    }
});
