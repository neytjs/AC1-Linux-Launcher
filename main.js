const { app, Menu, MenuItem, ipcMain, BrowserWindow, dialog } = require('electron');

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		height: 1024,
		width: 768,
		webPreferences: {
			nodeIntegration: true,
			devTools: false
		},
		icon: require('path').join(__dirname, 'icon.png')
	});

	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: require('path').join(__dirname, 'index.html')
	});

	Menu.setApplicationMenu(null);

	mainWindow.setTitle("AC1 Linux Launcher");
	mainWindow.loadURL(url);
	mainWindow.maximize();
//	mainWindow.webContents.openDevTools();
});

let darwin = process.platform === 'darwin';

app.on('window-all-closed', () => {
  if (!darwin) {
    app.quit();
  }
});
