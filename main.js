const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

// Prevent the Electron app from showing up on MacOS
app.dock.hide();

// Security boilerplate: prevent creation of new windows
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', async (event, navigationUrl) => {
    event.preventDefault();
  });
});

function initialize () {
  // Security boilerplate: prevent app from asking for device permissions
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      return callback(false);
  });

  // Create the worker window
  let win = new BrowserWindow({
    width: 1,
    height: 1,
    webPreferences: {
      // Prevents a window from appearing. We use the window only to run
      // Tensorflow.js. We have to use a window at all so that TF can use
      // WebGL for GPU acceleration.
      offscreen: true,

      // Security boilerplate
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  return Promise.all([Promise.resolve(win), win.loadFile('worker.html')]);
}

// Get predictions back from the model. This listens for an event sent by it
ipcMain.on('predictions', (event, arg) => {
  console.log(arg);
  app.quit();
});
ipcMain.on('errors', (event, arg) => {
  console.error(arg);
  app.quit();
});

// Launch the worker process, then send it the image to classify
app.whenReady().then(initialize).then((args) => {
  const win = args[0]
  const imagePath = app.commandLine.getSwitchValue('image');

  win.webContents.send('examples', imagePath);
}).catch((e) => {
  console.error(e);
  app.quit();
});
