const fs = require('fs');
const path = require('path');

// Función para recorrer las subcarpetas y mover archivos
function moveFilesToParentFolder(folder) {
    fs.readdir(folder, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio', folder, err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folder, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error al obtener información del archivo', filePath, err);
                    return;
                }

                if (stats.isDirectory()) {
                    // Si es un directorio, llamamos recursivamente a la función
                    moveFilesToParentFolder(filePath);
                } else {
                    // Si es un archivo, lo movemos a la carpeta principal
                    const newFilePath = path.join(__dirname, file);
                    fs.rename(filePath, newFilePath, err => {
                        if (err) {
                            console.error('Error al mover el archivo', filePath, err);
                        } else {
                            console.log('Archivo movido:', filePath, '→', newFilePath);
                        }
                    });
                }
            });
        });

        // Eliminar subcarpetas una vez se hayan movido todos los archivos
        fs.rmdir(folder, err => {
            if (err) {
                console.error('Error al eliminar la carpeta', folder, err);
            } else {
                console.log('Carpeta eliminada:', folder);
            }
        });
    });
}

// Llamamos a la función para iniciar el proceso
moveFilesToParentFolder(__dirname);
