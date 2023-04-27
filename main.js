const { app, Menu, MenuItem, ipcMain, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
require('@electron/remote/main').initialize();

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		height: 1024,
		width: 768,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		icon: require('path').join(__dirname, 'icon.png')
	});

	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: require('path').join(__dirname, 'index.html')
	});

	const template = [
		{
			label: 'Menu',
			submenu: [
				{
					label: 'Import Servers List',
					click: function() {
						dialog.showOpenDialog({
							properties: ['openFile'],
							filters: [
  							{ name: 'XMLs', extensions: ['xml'] }
							]
						}).then((file) => {
							if (file.filePaths.length > 0) {
								mainWindow.webContents.send('import_servers', file.filePaths[0]);
							}
						});
					}
				},
				{
            type: 'separator'
        },
				{
					label: 'Import Accounts List',
					click: function() {
						dialog.showOpenDialog({
							properties: ['openFile'],
							filters: [
  							{ name: 'JSONs', extensions: ['json'] }
							]
						}).then((file) => {
							if (file.filePaths.length > 0) {
								mainWindow.webContents.send('import_accounts', file.filePaths[0]);
							}
						});
					},
				},
				{
					label: 'Export Accounts List',
					click: function() {
						mainWindow.webContents.send('export_accounts', "");
					}
				},
        {
            type: 'separator'
        },
				{
					role: 'quit'
				}
			]
		}
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	mainWindow.setTitle("AC1 Linux Launcher");
	mainWindow.loadURL(url);
	mainWindow.maximize();
	//mainWindow.webContents.openDevTools();
	require("@electron/remote/main").enable(mainWindow.webContents);
});

let darwin = process.platform === 'darwin';

app.on('window-all-closed', () => {
  if (!darwin) {
    app.quit();
  }
});
