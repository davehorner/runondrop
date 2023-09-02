const { invoke } = window.__TAURI__.tauri;
const appWindow = window.__TAURI__.window.appWindow;
appWindow.listen('tauri://file-drop', ({ event, payload }) => {console.log(event) });
const listen = window.__TAURI__.event.listen;
listen('tauri://file-drop', event => { console.log(event) });

let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});

var dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropZone.style.cursor='auto';
});

// Get file data on drop
dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files; // Array of all files

    for (var i=0, file; file=files[i]; i++) {
        if (file.type.match(/image.*/)) {
            var reader = new FileReader();

            reader.onload = function(e2) {
                // finished reading file data.
                var img = document.createElement('img');
                img.src= e2.target.result;
                document.body.appendChild(img);
            }

            reader.readAsDataURL(file); // start reading the file data.
        }
    }
});

    const dropZone2 = document.getElementById('drop-zone');

    dropZone2.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.innerHTML = '<p>running</p>';
      dropZone2.style.cursor='copy';
    });

    dropZone2.addEventListener('dragleave', () => {
      dropZone2.innerHTML = '<p>Drag and drop a file here</p>';
      dropZone2.style.cursor='auto';
    });

    dropZone2.addEventListener('drop',async (e) => {
      e.preventDefault();

const files = Array.from(e.dataTransfer.files);

if (files.length === 0) {
  return;
}

dropZone2.innerHTML = `<p>Files dropped: ${files.map((file) => file.name).join(', ')}</p>`;
//await invoke("droprun", { files: greetInputEl.value });
let flist=files.map((file) => file.name) 
await window.__TAURI__.invoke('droprun', { files:flist});
    });