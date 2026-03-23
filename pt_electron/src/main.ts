import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import db from './db/database.js';
import { getCredentials, sendEmail, logOut } from './gmail/oauth.js';
import type { Employee } from './types/Employee.js';

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    title: "Intern Manager",
    icon: path.join(__dirname, '../build/icons/pt_logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // preload for safe IPC
      nodeIntegration: false,                      // security best practice
      contextIsolation: true,                      
    },
  });

  const isProd = app.isPackaged;
  const frontendDistPath = path.resolve(__dirname, '../dist/index.html');
  
  if (isProd) {
    win.loadFile(frontendDistPath);
  }
  else {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  }
}

ipcMain.handle('gmail-logout', async () => {
  try {
    await logOut();
    return true;
  }
  catch(err) {
    console.error(err);
    return false;
  }
})

ipcMain.handle('gmail-login', async () => {
  try {
    const authClient = await getCredentials();
    return true;
  }
  catch(err) {
    console.error(err);
    return false;
  }
});

ipcMain.handle('gmail-send', async (event, employees: Employee[]) => {
    try {
      for(let employee of employees) {
        await sendEmail(employee);
      }
      return true;
    }
    catch(err) {
      console.error(err);
      return false;
    }
});


ipcMain.handle('add-image', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender); //ensure dev mode works

  const result = await dialog.showOpenDialog(win!, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }
    ]
  });

  if(result.canceled) {
    return null;
  }

  let imagePaths : string[] = [];

  for(let i = 0; i < result.filePaths.length; i++) {
    const originalPath = result.filePaths[i];
    const imagesDir = path.join(app.getPath('userData'), 'images');

    if(!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true }); //make image subfolder if doesnt exist
    }

    const fileName = path.basename(originalPath);
    const newPath = path.join(imagesDir, fileName);

    fs.copyFileSync(originalPath, newPath); //copy images over

    imagePaths[i] = newPath;
  }

  const imageJSON = JSON.stringify(imagePaths);

  return imageJSON;

});

ipcMain.handle('get-employees', () => {
  return db.prepare('SELECT * FROM employees').all();
});

ipcMain.handle('add-employee', (event, employee: { name: string; email: string, imgPath: string; type: string }) => {
  const stmt = db.prepare('INSERT INTO employees (name, email, imagePath, type) VALUES (?, ?, ?, ?)');
  stmt.run(employee.name, employee.email, employee.imgPath, employee.type);
});

ipcMain.handle('remove-employee', (event, id: number) => {
  console.log("Deleting:", id);
  const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
  stmt.run(id);
})

ipcMain.handle('add-image-existing', async (event, id: number, imgPath: string) => {
  const win = BrowserWindow.fromWebContents(event.sender); //ensure dev mode works

  const result = await dialog.showOpenDialog(win!, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }
    ]
  });

  if(result.canceled) {
    return null;
  }

  let imagePaths: string[] = JSON.parse(imgPath);

  for(let originalPath of result.filePaths) {
    const imagesDir = path.join(app.getPath('userData'), 'images');

    if(!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true }); //make image subfolder if doesnt exist
    }

    const fileName = path.basename(originalPath);
    const newPath = path.join(imagesDir, fileName);

    fs.copyFileSync(originalPath, newPath); //copy images over

    imagePaths.push(newPath);
  }

  const imageJSON = JSON.stringify(imagePaths);

  const stmt = db.prepare(`
    UPDATE employees
    SET imagePath = ?
    WHERE id = ?
  `);

  stmt.run(imageJSON, id);

  return imageJSON;
})

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//quit when windows closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});