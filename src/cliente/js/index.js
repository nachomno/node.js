require('../css/layout.css');
require('./funciones.js');
require('./jquery.js');
require('../../../node_modules/xlsx-populate/browser/xlsx-populate.min.js');


// require('./colResizable-1.6.js');

// ...

// Guardar el libro de trabajo en un archivo
// workbook.xlsx.writeFile('ruta/al/nuevo-archivo.xlsx')
//     .then(() => {
//         console.log('Archivo guardado correctamente.');
//     })
//     .catch((error) => {
//         console.error('Error al guardar el archivo:', error);
//     });

// import XlsxPopulate from 'xlsx-populate';

// async function leerArchivo(ruta){
//     const workbook=await XlsxPopulate.fromFileAsync(ruta);
//     // leer datos
//     const dato= workbook.sheet('Hoja1').cell('A1').value();
// }


// const XlsxPopulate = require('xlsx-populate');

// async function leerArchivo(ruta) {
//     try {
//         // Cargar el archivo Excel
//         const workbook = await XlsxPopulate.fromFileAsync(ruta);

//         // Leer datos del archivo
//         const dato= workbook.sheet('Hoja1').cell('A1').value();
//     }
// }
