const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');
const { SingleBar } = require('cli-progress');

function mergeGalleries() {
    // Rutas de los archivos JSON
    const publicGalleryPath = path.join(__dirname, 'src', 'public', 'gallery.json');
    const generatedGalleryPath = path.join(__dirname, 'gallery.json');

    // Cargar el contenido de los archivos JSON
    const publicGalleryData = fs.readFileSync(publicGalleryPath, 'utf-8');
    const generatedGalleryData = fs.readFileSync(generatedGalleryPath, 'utf-8');

    // Parsear el contenido a objetos
    let publicGallery = JSON.parse(publicGalleryData);
    let generatedGallery = JSON.parse(generatedGalleryData);

    // Array para almacenar las similitudes encontradas
    let foundMatches = [];

    // Configurar barra de progreso para la búsqueda de similitudes
    const progressBar = new SingleBar({
        format: '{bar} | {percentage}% | ETA: {eta}s | {value}/{total} modelos comparados',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    progressBar.start(generatedGallery.length, 0);

    generatedGallery.forEach((generatedItem, index) => {
        let bestMatch = null;
        let highestScore = 0;

        publicGallery.forEach(publicItem => {
            // Campos de publicItem a comparar
            const fieldsToCompare = ['footprint'];
            let totalFields = fieldsToCompare.length;
            let matchScore = 0;

            fieldsToCompare.forEach(key => {
                if (publicItem[key] && generatedItem.name) {
                    const similarity = stringSimilarity.compareTwoStrings(generatedItem.name.trim(), publicItem[key].trim());
                    if (similarity >= 0.9) {
                        matchScore++;
                    }
                }
            });

            // Calcular el porcentaje de campos coincidentes
            let similarityPercentage = matchScore / totalFields;

            // Si se encuentra una coincidencia con un porcentaje mayor al 50%, se copian los datos
            if (similarityPercentage >= 0.5 && similarityPercentage > highestScore) {
                highestScore = similarityPercentage;
                bestMatch = publicItem;
            }
        });

        // Si se encontró una coincidencia válida, se copian los datos y se añade al array de coincidencias encontradas
        if (bestMatch) {
            Object.assign(generatedItem, bestMatch);
            foundMatches.push({ generatedItem, bestMatch });
        }

        // Actualizar barra de progreso de búsqueda de similitudes
        progressBar.update(index + 1);
    });

    // Finalizar la barra de progreso de búsqueda de similitudes
    progressBar.stop();

    // Escribir el archivo actualizado gallery.json
    fs.writeFileSync(generatedGalleryPath, JSON.stringify(generatedGallery, null, 2));

    // Escribir el archivo de coincidencias encontradas
    fs.writeFileSync('foundMatches.json', JSON.stringify(foundMatches, null, 2));

    console.log('Se ha actualizado gallery.json correctamente con los datos de /src/public/gallery.json.');
    console.log('Se ha guardado el archivo foundMatches.json con las similitudes encontradas.');
}

// Ejecutar la función para fusionar los datos
mergeGalleries();
