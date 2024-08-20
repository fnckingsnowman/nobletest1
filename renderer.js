document.getElementById('startScanBtn').addEventListener('click', () => {
  window.api.startScan();
});

document.getElementById('stopScanBtn').addEventListener('click', () => {
  window.api.stopScan();
});

window.api.onDeviceDiscovered(device => {
  const resultsDiv = document.getElementById('results');
  let deviceHTML = `
      <div>
          <h2>${device.name}</h2>
          <p>UUID: ${device.uuid}</p>
          <p>RSSI: ${device.rssi}</p>
          <h3>Services:</h3>
          <ul>
              ${device.services.map(service => `
                  <li>
                      <strong>Service UUID:</strong> ${service.uuid}
                      <ul>
                          ${service.characteristics.map(char => `<li>Characteristic UUID: ${char}</li>`).join('')}
                      </ul>
                  </li>
              `).join('')}
          </ul>
      </div>
  `;
  resultsDiv.insertAdjacentHTML('beforeend', deviceHTML);
});
