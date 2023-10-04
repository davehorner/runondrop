const { ipcRenderer } = require('electron');

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    let pathArr = [];
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get the absolute file path
        console.log('File Path of dragged files: ', f.path);
        pathArr.push(f.path);
    }
    console.log(pathArr);

    // Send the file paths to the main process
    ipcRenderer.send('dropped-files', pathArr);
});

// Add this event listener to receive a response from the main process
ipcRenderer.on('update-dropped-files', (event, paths) => {
    console.log('Received file paths from main process:', paths);
});

ipcRenderer.on('command-result', (event, result) => {
    // Create a div for each command's information
    const container = document.getElementById('commands-container');
    const commandDiv = document.createElement('div');
    commandDiv.classList.add('command-div');

    // Display the command run in a span
    const commandSpan = document.createElement('span');
    commandSpan.textContent = `Command Run: ${result.command}`;
    commandDiv.appendChild(commandSpan);

    // Display the command output in a div
    const outputDiv = document.createElement('div');
    outputDiv.textContent = `Command Output:\n${result.output}`;
    commandDiv.appendChild(outputDiv);

    // Display the command error in a div
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Command Error:\n${result.error}`;
    commandDiv.appendChild(errorDiv);

    // Add the command div to the container
    container.appendChild(commandDiv);
});
