const http = require('http')
const appE = require('./app')
const {app, BrowserWindow, ipcMain, webContents, globalShortcut, remoteWin, remote} = require('electron');
const path = require('path')
const fs = require('fs')
const open = require('open')
const { webviewTag } = require('electron/renderer');

function createWindow () 
{
  // ------------------------------------------------------------------------------------  Create the browser window.
  const win = new BrowserWindow({
    show : false,
    center : true,
    frame : false,
    transparent: true,
    fullscreen : true,
    resizable : false,
    movable : false,
    webPreferences: 
    {
      nodeIntegration: true,
      webviewTag : true,
      enableRemoteModule : true,
      contextIsolation : false
    }
  })

  win.once('ready-to-show', () => {
      win.setFullScreen(true)
      win.show()
    }) 

  // ------------------------------------------------------------------------------------  and load the index.html of the app.
  win.loadFile('source/home.html');  

  // ------------------------------------------------------------------------------------  Close App when Main Window is closed
  win.on('close', () => {
    app.exit(0)
  })

  // ------------------------------------------------------------------------------------  Print Main Window Content
  ipcMain.on('print', (event, fileName, size, landscape) => 
  {
    fileName = fileName
  
    var options = 
    { 
      marginsType: 1, 
      pageSize: size, 
      printBackground: false, 
      printSelectionOnly: false, 
      landscape: landscape
    } 
    
    win.webContents.printToPDF(options)
    .then(data =>
    { 
      fs.writeFile(fileName, data, function (err) 
      { 
          if (err) 
          { 
              console.log(err); 
          } else
          { 
            open(fileName)
            setTimeout(() => {                          
              fs.unlink(fileName,err => {
                if (err) throw err
              }) 
            },2000)
          }
      }); 
    })
    .catch(error => { 
        console.log(error) 
    })    
  })

  // ------------------------------------------------------------------------------------  Report Window Setup
  const reportWin = new BrowserWindow({
    show : false,
    center : true,
    frame : false,
    fullscreen : true,
    transparent : true,
    resizable : false,
    closable : false,
    movable : false,
    webPreferences : 
    {
      nodeIntegration: true,
      webviewTag : true,
      enableRemoteModule : true,
      contextIsolation : false
    }
  })

  // ------------------------------------------------------------------------------------ IPC Communication to Load Report Window
  ipcMain.on('reportWindow', (event, address ) => {    
    reportWin.show() 
    reportWin.loadFile(address)
    remoteWin.setFullScreen(true)
  })

    // ------------------------------------------------------------------------------------ IPC Coomunication to hide Report Window
    ipcMain.on('hideReport', event => { reportWin.hide();win.focus() })

  // ------------------------------------------------------------------------------------ Remote Window setup
  const remoteWin  = new BrowserWindow({
    show : false,
    center : true,
    frame : false,
    fullscreen : true,
    transparent: true,
    resizable : false,
    closable : false,
    movable : false,
    webPreferences: 
    {
      nodeIntegration: true,
      webviewTag : true,
      enableRemoteModule : true,
      contextIsolation : false
    }
  })

  // ------------------------------------------------------------------------------------ IPC Communication to Load Remote Window
  ipcMain.on('remoteWindow', (event, address ) => {   
    remoteWin.show() 
    remoteWin.loadFile(address)
    remoteWin.setFullScreen(true)
  })

  // ------------------------------------------------------------------------------------ IPC Coomunication to hide Remote Window
  ipcMain.on('hide', event => { remoteWin.hide();win.focus() })

  // ------------------------------------------------------------------------------------ Print Remote Window Content
  ipcMain.on('printRemote', (event, fileName, size, landscape) => 
  {
    fileName = fileName
  
    // -------------------------- Setting page layout
    var options = 
    { 
      marginsType: 1, 
      pageSize: size, 
      printBackground: false, 
      printSelectionOnly: false, 
      landscape: landscape
    } 

    // -------------------------- Converting to PDF
    remoteWin.webContents.printToPDF(options)
    .then(data =>
    { 
      // ----------------------- Saving PDF File
      fs.writeFile(fileName, data, function (err) 
      { 
          if (err) 
          { 
              console.log(err); 
          } else
          { 
            // -------------------------- Opening PDF file in deafault viewer
            open(fileName)
            // -------------------------- Delete saved PDF, 2 seconds later
            setTimeout(() => {                          
              fs.unlink(fileName,err => {
                if (err) throw err
              }) 
            },2000)
          }
      }); 
    })
    .catch(error => { 
        console.log(error) 
    })    
  })

  // ------------------------------------------------------------------------------------ Closing Report Window
  reportWin.on('close', (event) =>
  {
    event.preventDefault()
    reportWin.hide()
    win.focus()
    win.setFullScreen(true)
  })

  // ------------------------------------------------------------------------------------ Closing Print Window
  remoteWin.on('close', (event) =>
  {
    event.preventDefault()
    remoteWin.hide()
    win.focus()
    win.setFullScreen(true)
  })

  // ------------------------------------------------------------------------------------ Gloabal Shortcut for Find-In-Page
  globalShortcut.register('CommandOrControl+F', () => {
    remoteWin.webContents.send('on-find')
    win.webContents.send('on-find'); 
  }); 
}     


// ------------------------------------------------------------------------------------ Create Window once app is ready
app.whenReady().then(createWindow)


// ------------------------------------------------------------------------------------ Close app when all Windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ------------------------------------------------------------------------------------ Execitre creteWindow() when APp is activated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// ------------------------------------------------------------------------------------ Listen to Server Port
appE.listen(7070,()=>{
    console.log("Server up and running....")
})