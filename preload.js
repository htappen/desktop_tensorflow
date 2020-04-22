const { contextBridge, ipcRenderer } = require('electron')

// Add methods for communication between the worker and main process
contextBridge.exposeInMainWorld(
  'electron',
  {
    sendPredictions: (val) => ipcRenderer.send('predictions', val),
    sendErrors: (val) => ipcRenderer.send('errors', val),
    getExamples: (listener) => ipcRenderer.on('examples', listener)
  }
);
