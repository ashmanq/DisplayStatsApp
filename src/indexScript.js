const { ipcRenderer } = require('electron');



// Get elements in HTML to display stats
const ipElement = document.getElementById('ip-address');
const cpuElement = document.getElementById('cpu');
const memoryElement = document.getElementById('memory');
const diskElement = document.getElementById('disk');

// Attach event listener on button
const refreshButton = document.getElementById('refresh-btn')

refreshButton.addEventListener('click', (e) => {
    e.preventDefault;
    console.log('Clicked');
    ipcRenderer.send('get-ip-addresses', 'get-address');
});

ipcRenderer.on('reply-ip-addresses', (e, sysInfo) => {
    console.log('SysInfo :', sysInfo)
    ipElement.textContent = sysInfo.ip.join(', ');
    cpuElement.textContent = sysInfo.cpu;
    memoryElement.textContent = sysInfo.mem;
    diskElement.textContent = sysInfo.disk;
    // console.log('addresses:', addresses);
});
ipcRenderer.send('get-ip-addresses', 'get-address');


