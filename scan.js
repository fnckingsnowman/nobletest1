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

noble.on('discover', peripheral => {
    console.log(`Discovered device: ${peripheral.advertisement.localName || 'Unnamed device'}`);
    console.log(`  UUID: ${peripheral.uuid}`);
    console.log(`  RSSI: ${peripheral.rssi}`);
    console.log(`  Services: ${peripheral.advertisement.serviceUuids}`);
    console.log('---------------------------------------------------');
});
