const fs = require('fs');
const path = require('path');

const directoryPath = '../footprints'; // Ruta a la carpeta que contiene los archivos

let galleryData = [];

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('No se puede escanear el directorio: ' + err);
    }

    files.forEach(function (file) {
        // Ignorar archivos que no sean .kicad_mod
        if (path.extname(file) !== '.kicad_mod') {
            return;
        }

        let filePath = path.join(directoryPath, file);

        // Leer el contenido del archivo
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return console.log('No se puede leer el archivo: ' + err);
            }

            let match = data.match(/\(footprint "(.*)"|"(.*)"\)/);
            let footprint = match ? match[1] : '';

            // Buscar la información deseada en el archivo
            match = data.match(/\(descr "(.*)"\)/);
            let description = match ? match[1] : '';

            // Extraer la URL de la descripción
            const urlRegex = /(https?:\/\/[^\s]+)/;
            const urlMatch = description.match(urlRegex);
            let url = '';
            if (urlMatch) {
                url = urlMatch[0];
                description = description.replace(url, '').trim(); // Eliminar la URL de la descripción
            }

            // Buscar la información deseada en el archivo
            match = data.match(/\(tags "(.*)"\)/);
            let tag = match ? match[1] : '';

            match = data.match(/\(attr (.*)\)/);
            let tech = match ? match[1] : '';

            // Agregar la información al array de datos
            galleryData.push({ footprint, description, tag, tech, url });

            // Si hemos procesado todos los archivos, escribir el JSON
            if (galleryData.length === files.length) {
                // Escribir el archivo gallery.json
                fs.writeFile('../src/public/gallery.json', JSON.stringify(galleryData, null, 4), function (err) {
                    if (err) {
                        return console.log('Error al escribir el archivo JSON: ' + err);
                    }
                    console.log('gallery.json generado con éxito');
                });
            }
        });
    });
});
