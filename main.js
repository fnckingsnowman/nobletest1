const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const noble = require('@abandonware/noble');
const nativeAddon = require('./native-addon/build/Release/addon');

let scanning = false;

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('start-scan', () => {
        if (!scanning) {
            scanning = true;
            noble.startScanning();
            console.log('Started scanning for BLE devices.');
        }
    });

    ipcMain.handle('stop-scan', () => {
        if (scanning) {
            noble.stopScanning();
            scanning = false;
            console.log('Stopped scanning for BLE devices.');
        }
    });

    const discoveredDevices = new Map();

    noble.on('stateChange', state => {
        if (state === 'poweredOn') {
            if (scanning) {
                noble.startScanning();
            }
        } else {
            noble.stopScanning();
        }
    });

    noble.on('discover', async peripheral => {
        let deviceInfo = {
            name: peripheral.advertisement.localName || 'Unnamed device',
            uuid: peripheral.uuid,
            rssi: peripheral.rssi,
            services: []
        };

        // Check if device is already in the list
        if (discoveredDevices.has(peripheral.uuid)) {
            return; // Device already processed
        }

        discoveredDevices.set(peripheral.uuid, deviceInfo);

        try {
            await peripheral.connectAsync();
            const services = await peripheral.discoverServicesAsync();
            for (const service of services) {
                let serviceInfo = {
                    uuid: service.uuid,
                    characteristics: []
                };

                const characteristics = await service.discoverCharacteristicsAsync();
                for (const characteristic of characteristics) {
                    serviceInfo.characteristics.push(characteristic.uuid);
                }

                deviceInfo.services.push(serviceInfo);
            }

            await peripheral.disconnectAsync();
        } catch (error) {
            deviceInfo.error = error.message;
        }

        // Notify renderer process about new device
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('device-discovered', deviceInfo);
        });
    });
});

ipcMain.on('start-hook', () => {
  nativeAddon.startHook();
});

ipcMain.on('stop-hook', () => {
  nativeAddon.stopHook();
});

ipcMain.on('set-f11-key', (event, key) => {
  nativeAddon.setF11Key(key);
});

ipcMain.on('set-f12-key', (event, key) => {
  nativeAddon.setF12Key(key);
});


// IPC handlers for native-addon
ipcMain.on('start-hook', () => {
  nativeAddon.startHook();
});
ipcMain.on('stop-hook', () => {
  nativeAddon.stopHook();
});
ipcMain.on('set-f11-key', (event, key) => {
  nativeAddon.setF11Key(key);
});
ipcMain.on('set-f12-key', (event, key) => {
  nativeAddon.setF12Key(key);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
