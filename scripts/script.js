const fs = require('fs');
const path = require('path');

// Lee el archivo y almacena las líneas en una lista
const lines = fs.readFileSync('src/public/footprints.txt', 'utf-8').split('\n').filter(Boolean);

// Inicializa un objeto vacío para almacenar la estructura del JSON
let json_data = {};

// Recorre cada línea y agrega la estructura al objeto
lines.forEach(line => {
    let currentObject = json_data;
    const folders = line.split('/');

    folders.forEach((folder, index) => {
        const isLastFolder = index === folders.length - 1;
        const fullPath = path.join(...folders.slice(0, index + 1));

        let folderNameWithoutExtension = folder;

        // Elimina ".3dshapes" solo al final del campo 'name'
        if (index === folders.length - 1 && folderNameWithoutExtension.endsWith('.3dshapes')) {
            folderNameWithoutExtension = folderNameWithoutExtension.slice(0, -9);
        }

        currentObject[folderNameWithoutExtension] = currentObject[folderNameWithoutExtension] || {};

        if (isLastFolder) {
            currentObject[folderNameWithoutExtension] = { name: folderNameWithoutExtension, path: fullPath };
        }

        currentObject = currentObject[folderNameWithoutExtension];
    });
});

// Convierte el objeto a formato JSON
const json_output = JSON.stringify(json_data, null, 2);

// Guarda el JSON en un archivo
fs.writeFileSync('src/public/footprints.json', json_output, 'utf-8');

console.log('JSON generado con éxito.');
