const fs = require('fs');
const path = require('path');

// Función para analizar el contenido WRL y devolver una estructura de datos
function parseWrl(wrlContent) {
    const result = {
        coords: [],
        indexedFaces: [],
        indexedLines: []
    };

    // Expresiones regulares para buscar patrones específicos en el contenido WRL
    const coordRegex = /point\s*\[([\s\S]*?)\]/g;
    const indexedFaceRegex = /coordIndex\s*\[([\s\S]*?)\]/g;
    const indexedLineRegex = /coordIndex\s*\[([\s\S]*?)\]/g;

    // Encontrar coordenadas
    let match;
    while ((match = coordRegex.exec(wrlContent)) !== null) {
        const points = match[1].trim().split(/\s*,\s*/);
        for (const point of points) {
            const [x, y, z] = point.trim().split(/\s+/).map(parseFloat);
            result.coords.push({ x, y, z });
        }
    }

    // Encontrar índices de caras
    while ((match = indexedFaceRegex.exec(wrlContent)) !== null) {
        const groups = match[1].trim().split(/\s*,\s*/);
        const face = groups.map(index => parseInt(index) + 1); // Incrementar en 1
        result.indexedFaces.push(face);
    }

    // Encontrar índices de líneas
    while ((match = indexedLineRegex.exec(wrlContent)) !== null) {
        const groups = match[1].trim().split(/\s*,\s*/);
        const line = groups.map(index => parseInt(index) + 1); // Incrementar en 1
        result.indexedLines.push(line);
    }

    return result;
}

// Función para convertir WRL a OBJ
function convertWrlToObj(inputFilePath) {
    console.log(`Converting ${inputFilePath} to OBJ...`);

    const inputContent = fs.readFileSync(inputFilePath, 'utf-8');
    const outputFilename = inputFilePath.replace('.wrl', '.obj');

    const { coords, indexedFaces, indexedLines } = parseWrl(inputContent);

    const outputLines = [];

    for (const coord of coords) {
        outputLines.push(`v ${coord.x} ${coord.y} ${coord.z}`);
    }

    for (const face of indexedFaces) {
        outputLines.push(`f ${face.join(' ')}`);
    }

    for (const line of indexedLines) {
        outputLines.push(`l ${line.join(' ')}`);
    }

    const objContent = outputLines.join('\n');

    fs.writeFileSync(outputFilename, objContent);
    console.log(`OBJ file saved to: ${outputFilename}`);
}

// Obtener la lista de archivos .wrl en la carpeta actual
const filesInFolder = fs.readdirSync(process.cwd());
const wrlFiles = filesInFolder.filter(filename => filename.endsWith('.wrl'));

// Convertir cada archivo .wrl a .obj
wrlFiles.forEach(filename => {
    const inputFilePath = path.join(process.cwd(), filename);
    convertWrlToObj(inputFilePath);
});
