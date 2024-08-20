

//document.addEventListener('DOMContentLoaded', () => {

    let tabCounter = 1;
    // Function to show a specific tab
    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`button[data-tab="${tabId}"]`).classList.add('active');
    }
    // Function to add a new tab
    window.addNewTab = function() {
        tabCounter++;
        const tabId = `tab${tabCounter}`;
        const tabButtonId = `tabButton${tabCounter}`;
        
        const newTabButton = document.createElement('div');
        newTabButton.className = 'tab';
        newTabButton.id = tabButtonId;
        newTabButton.innerHTML = `
            <button data-tab="${tabId}" onclick="showTab('${tabId}')">Tab ${tabCounter}</button>
            <button class="delete-tab" onclick="deleteTab('${tabId}', '${tabButtonId}')">&times;</button>
        `;
        document.getElementById('tabs').appendChild(newTabButton);
        const newTabContent = document.createElement('div');
        newTabContent.id = tabId;
        newTabContent.className = 'tab-content';
        newTabContent.innerHTML = `
            <button id="startHookBtn">Start Hook</button>
                <button id="stopHookBtn">Stop Hook</button>
                <input id="f11KeyInput" type="text" placeholder="F11 Key">
                <button id="setF11KeyBtn">Set F11 Key</button>
                <input id="f12KeyInput" type="text" placeholder="F12 Key">
                <button id="setF12KeyBtn">Set F12 Key</button>
        `;
        document.getElementById('content').appendChild(newTabContent);
        showTab(tabId);
    };
    // Function to delete a tab
    window.deleteTab = function(tabId, tabButtonId) {
        document.getElementById(tabId).remove();
        document.getElementById(tabButtonId).remove();
        
        // Show the first tab if any tabs are left
        const firstTab = document.querySelector('.tab-content');
        if (firstTab) {
            showTab(firstTab.id);
        }
    };
    // Initial tab is shown by default
    showTab('tab1');
//});
    
// Functions to start and stop the hook
function startHook(tabNumber) {
    const f11Key = document.getElementById(`f11key${tabNumber}`).value;
    const f12Key = document.getElementById(`f12key${tabNumber}`).value;
    window.electronAPI.setF11Key(f11Key);
    window.electronAPI.setF12Key(f12Key);
    window.electronAPI.startHook();
}
function stopHook(tabNumber) {
    window.electronAPI.stopHook();
}

let scannedDevices = {};
function showBLEDevices() {
    showTab('bleDevices');
}

document.addEventListener('DOMContentLoaded', () => {
    showTab('tab1');
});



