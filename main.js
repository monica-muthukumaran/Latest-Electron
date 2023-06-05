const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true }
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
});



app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

// autoUpdater.checkForUpdatesAndNotify();

setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 2000)

// autoUpdater.on('update-available', () => {
//     mainWindow.webContents.send('update_available');
// });

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

// setInterval(checkForUpdates, 1000);

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});