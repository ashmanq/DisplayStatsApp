const electron = require('electron');
const path = require('path');
const si = require('systeminformation')

const { app, BrowserWindow, ipcMain } = electron;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  // console.log(ipAddresses);
  ipcMain.on('get-ip-addresses', async (e, arg) => {
    const sysInfoText = await getSystemInfo();
    e.reply('reply-ip-addresses', sysInfoText);
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


const getSystemInfo = async () => {

  let addresses = [];
  let cpu = "n/a";
  let memory = "n/a";
  let disk = "n/a";
  const datetime = new Date().toLocaleString();

  si.networkInterfaces()
    .then(networkData => {
      for (var k in networkData) {
            var address = networkData[k];
            if (address.ip4 !== '' && !address.internal) {
                addresses.push(address.ip4);
            }
      }
    })
    .catch(error => console.log(error));
  cpu = await si.currentLoad()
    .then(currentLoad => {
      // console.log('CPU ', (currentLoad.currentload).toFixed(1),'%');
      return `${(currentLoad.currentload).toFixed(1)}%`
      
     
    })
    .catch(error => console.error(error));
  memory = await si.mem()
    .then(mem => {
      const memUsed = (mem.used/1048576).toFixed(0);
      const memTotal = (mem.total/1048576).toFixed(0);
      const memPercent = (mem.used/mem.total * 100).toFixed(1);
      return `${memUsed}/${memTotal}MB - ${memPercent}%`
    })
    .catch(error => console.error(error));
  disk = await si.fsSize()
    .then(fsSize => {
      const spaceTotal =  (fsSize[0].size/1048576).toFixed(0);
      const spaceUsed = (fsSize[0].used/1048576).toFixed(0);
      return `${spaceUsed}/${spaceTotal}MB - ${fsSize[0].use}%`;
    })
    .catch(error => log.error(error))

  const results = {
    ip: addresses,
    cpu: cpu,
    mem:  memory,
    disk: disk,
    lastUpdate: datetime,
  }
  return results;
}
