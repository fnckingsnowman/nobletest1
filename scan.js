const noble = require('@abandonware/noble');

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
    console.log(`Discovered device: ${peripheral.advertisement.localName || 'Unnamed device'}`);
    console.log(`  Peripheral UUID: ${peripheral.uuid}`);
    console.log(`  RSSI: ${peripheral.rssi}`);
    
    try {
        // Connect to the peripheral
        await peripheral.connectAsync();
        console.log(`Connected to ${peripheral.advertisement.localName || 'Unnamed device'}`);

        // Discover services
        const services = await peripheral.discoverServicesAsync();
        for (const service of services) {
            console.log(`  Service UUID: ${service.uuid}`);
            
            // Discover characteristics for each service
            const characteristics = await service.discoverCharacteristicsAsync();
            for (const characteristic of characteristics) {
                console.log(`    Characteristic UUID: ${characteristic.uuid}`);
            }
        }
        
        // Disconnect from the peripheral
        await peripheral.disconnectAsync();
        console.log(`Disconnected from ${peripheral.advertisement.localName || 'Unnamed device'}`);
        
    } catch (error) {
        console.error(`Error connecting or discovering services: ${error.message}`);
    }

    console.log('---------------------------------------------------');
});
