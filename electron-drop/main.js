let winmain;
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { exec } = require('child_process');

// Create a function to execute a command for a single file
function executeCommandForFile(filePath) {
    // Define your command here
    const command = `cmd.exe /c echo "${filePath}"`; // Replace 'your-command' with your actual command

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        const result = {
            command,
            output: stdout,
            error: stderr
        };
        console.log(`Command output: ${stdout}`);
        console.error(`Command error: ${stderr}`);
        winMain.webContents.send('command-result', result);
    });
}

function createWindow () {
    winMain = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    })
    winMain.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow()
})

ipcMain.on('dropped-files', (event, arg) => {
    console.log('Dropped File(s):', arg);
    event.returnValue = `Received ${arg.length} paths.`; // Synchronous reply
    winMain.webContents.send('update-dropped-files', arg);
    arg.forEach((filePath) => {
        executeCommandForFile(filePath);
    });
})

