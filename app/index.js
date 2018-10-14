
const electron = require('electron');
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  shell,
  Menu,
  session,
} = electron;


// Or use `remote` from the renderer process.
// const { BrowserWindow } = require('electron').remote
// 
app.on('ready', () => {
  const { screen } = electron;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  let h = 0|((0|height) * 0.8);
  let w = 0|((0|width) * 0.8);
  let win = new BrowserWindow({ width: w, height: h })

  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] += ' CodeLabApp';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  win.webContents.session.clearStorageData([], () => {
    win.on('closed', () => win = null);

    // load the site
    win.loadURL('http://localhost:4500/__login__');
  });

  

  
})