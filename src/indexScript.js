const { ipcRenderer } = require('electron');




const mainText = document.getElementById('main-text');

ipcRenderer.on('reply-ip-addresses', (e, addresses) => {
    mainText.textContent = addresses;
    // console.log('addresses:', addresses);
})
ipcRenderer.send('get-ip-addresses', 'get-address');
console.log("Yo");
