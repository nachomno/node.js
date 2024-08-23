const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');
const multer = require('multer'); 
const path = require('path');
const XlsxPopulate = require('xlsx-populate');
const { PDFDocument, rgb } = require('pdf-lib');
const { print } = require('pdf-to-printer');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 3000;
let rutaArchivo="./uploads/tabla.xlsx";
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static', express.static('dist'));
app.use(express.static('imagenes'));

// Configurar el middleware de Webpack
const compiler = webpack(webpackConfig);
const middleware = webpackDevMiddleware(compiler, {
  stats: 'minimal', // Establecer el nivel de registro en 'minimal'
});
app.use(middleware);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.send('EWebik');
});
//configurar la carpeta de imágenes pública
app.use(express.static(__dirname + '/cliente'));


// Configuración de Multer para manejar archivos subidos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage });

// Ruta para manejar la solicitud de subida de archivos
app.post('/guardarArchivo', upload.single('archivo'), (req, res) => {
  // console.log("");
  rutaArchivo = req.file.path; // Obtener la ruta del archivo cargado
  // console.log("server.js>>guardarArchivo()")
  // console.log(rutaArchivo);
  res.send('Archivo recibido y guardado.');
});


app.post('/ImprimirCredencial', async(req,res)=> {
  const Datos = req.body; // Obtener los datos actualizados para la fila
  // Crear un nuevo documento PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([80 * 2.83465, 40 * 2.83465]); // 80x40 mm en puntos
  // Establecer un color de fondo en la página
  // page.drawRectangle({
  //   x: 0,
  //   y: 0,
  //   width: page.getWidth(),
  //   height: page.getHeight(),
  //   color: rgb(1, 0.5, 0.5), // Color de fondo 
  // });
  // Agregar texto al PDF
  const fontSize = 12;
  page.drawText('Credencial de ejemplo', {
    x: 10,
    y: page.getHeight() - fontSize - 10,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  // Serializar el PDF a bytes
  const pdfBytes = await pdfDoc.save();

  // Guardar el PDF en un archivo temporal
  const pdfPath = path.join(__dirname, 'credencial5.pdf');
  fs.writeFileSync(pdfPath, pdfBytes);

  // Enviar el PDF a la impresora
  print(pdfPath, {
    printer: 'MicrosoftPrintPDF', // Reemplaza con el nombre de tu impresora
    win32: ['-print-settings "fit"'], // Opciones adicionales para Windows
  }).then(() => {
    // console.log('Documento enviado a la impresora');
    // Eliminar el archivo temporal después de imprimir
    fs.unlinkSync(pdfPath);
  }).catch(err => {
    console.error('Error al imprimir el documento:', err);
  });
});

// cargar tabla -------------------------------------------------------
app.get('/cargarTabla', (req, res) => {
  // console.log(__dirname + "/" + nombreArchivo);
  // console.log('carga  de tabla');
  // crearEImprimirCredencial();
  const filePath = path.join(rutaArchivo);
  // console.log("server.js>>cargarTabla()")
  // console.log(rutaArchivo);
  XlsxPopulate.fromFileAsync(filePath)
      .then(workbook => {
          const sheet = workbook.sheet(0);
          let data = sheet.usedRange().value();
          data = data.slice(1).filter(row => typeof row[1] === 'string');
          let comparacion=0;
          // console.log(data);
          // ordenar por la columna de apellido
          data.sort((a, b) => {
            // Compara las filas por el valor de la columna 1
            comparacion = a[1].localeCompare(b[1],'es', { sensitivity: 'base' });
            // Si las filas tienen el mismo valor en la columna 1, compara por el valor de la columna 2
            if(comparacion==0){
              comparacion = a[2].localeCompare(b[2] ,'es', { sensitivity: 'base' });
            }
            return comparacion;
          });
          
          // Escribir los datos ordenados de vuelta en la hoja de cálculo
          data.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
              sheet.cell(rowIndex + 2, colIndex + 1).value(cell); // +1 porque los índices de celda comienzan desde 1
            });
          });
          workbook.toFileAsync(filePath);
          res.json(data);
          
          // console.log("se cargó " + nombreArchivo);
      })
      .catch(err => {
          console.error('Error al cargar el archivo servidor:', err);
          res.status(500).send('Error interno del servidor');
      });
});

// agregar una fila al archivo Excel
app.post('/agregarFilaExcel', (req, res) => {
  const filePath = path.join(rutaArchivo);
  const newData = req.body; // Obtener los datos a agregar en la fila del cuerpo de la solicitud
  XlsxPopulate.fromFileAsync(filePath).then(workbook => {
    const sheet = workbook.sheet(0);
    const lastRow = sheet.usedRange().endCell().rowNumber(); // Obtener el número de la última fila utilizada
    const nextRow = lastRow + 1; // Calcular el número de la próxima fila
    // Agregar los datos a la nueva fila
    newData.forEach((data, index) => {
      sheet.cell(nextRow, index + 1).value(data); // +1 porque los índices de celda comienzan desde 1
    });
    
    
    // Guardar los cambios en el archivo Excel
    return workbook.toFileAsync(filePath);
  }).then(() => {
    res.send('Fila agregada al archivo Excel.');
  }).catch(err => {
    console.error('Error al agregar fila al archivo Excel:', err);
    res.status(500).send('Error interno del servidor');
  });
});
// modificar una fila del archivo
app.post('/modificarFilaExcel', (req, res) => {
  const filePath = path.join(rutaArchivo);
  const newData = req.body; // Obtener los datos actualizados para la fila
  const id = newData[0]; // El primer elemento del array newData es el id
  // console.log("id: " + id);
  XlsxPopulate.fromFileAsync(filePath).then(workbook => {
    const sheet = workbook.sheet(0);
    const range = sheet.usedRange();
    // Buscar la fila con el id correspondiente
    for (let row = 2; row <= range.endCell().rowNumber()+1; row++) { // Comenzar desde la segunda fila (después de las cabeceras)
      // console.log("id: " + sheet.cell(row, 1).value());
      if (sheet.cell(row, 1).value() == id) { // Comprobar si el valor de la primera columna (id) coincide
        // Actualizar los datos de la fila encontrada
        newData.forEach((data, index) => {
          sheet.cell(row, index + 1).value(data); // +1 porque los índices de celda comienzan desde 1
        });
        
        // Guardar los cambios en el archivo Excel
        return workbook.toFileAsync(filePath);
      }
    }
    throw new Error('No se encontró la fila con el ID proporcionado.');
  }).then(() => {
    res.send('Fila modificada en el archivo Excel.');
  }).catch(err => {
    console.error('Error al modificar la fila en el archivo Excel:', err);
    res.status(500).send('Error interno del servidor');
  });
});


app.get('/queBaseSeUsa',(req,res)=>{
  res.send('Se está usando el archivo: ' + rutaArchivo);
});

// Dirigir a index
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
// Dirigir a estadoEvento
app.get('/estadoEvento.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'estadoEvento.html'));
});
// Dirigir a configurarDiploma
app.post('/configurarDiplomas.html',(req,res)=>{
  res.sendFile(path.join(__dirname, 'views', 'configurarDiploma.html'));
});
// Dirigir a configurarDiploma
app.post('/configurarEtiquetas.html',(req,res)=>{
  res.sendFile(path.join(__dirname, 'views', 'configurarEtiqueta.html'));
});
//---------------------------------
// Pasar datos del servidor
app.get('/datosServidor',(req,res)=>{
  const filePath = path.join('./src/servidor/datos.xlsx');
  // console.log("server.js>>datosEtiqueta()")
  // console.log(rutaArchivo);
  XlsxPopulate.fromFileAsync(filePath)
      .then(workbook => {
          const sheet = workbook.sheet(0);
          let data = sheet.usedRange().value();
          data = data.slice(0).filter(row => typeof row[0] === 'string' || 'integer');
          // console.log(data);
          res.json(data);
          
      })
      .catch(err => {
          console.error('Error al cargar datos de la etiqueta:', err);
          res.status(500).send('Error al cargar datos de la etiqueta:', err);
      });
});
//guardar datos servidor
app.post('/guardarCredencial',(req,res)=>{
  const filePath = path.join("./src/servidor/datos.xlsx");
  const datosNuevos = req.body; // Obtener los datos actualizados para la fila
  // console.log("id: " + id);
  XlsxPopulate.fromFileAsync(filePath).then(workbook => {
    const datosServidor = workbook.sheet(0);
    const range = datosServidor.usedRange();
    datosServidor.cell(1, 1).value(datosNuevos[0][0]);
    for (let row = 1; row < 5; row++) { 
      for(let col=0;col<6;col++){
        datosServidor.cell(row+1, col+1).value(datosNuevos[row][col]); // +1 porque los índices de celda comienzan desde 1
      };  
    }
    // Guardar los cambios en el archivo Excel
    return workbook.toFileAsync(filePath);
    
  }).then(() => {
    res.send('Datos guardados en datos.xlsx');
  }).catch(err => {
    console.error('Error al guardar datos en datos.xlsx:', err);
    res.status(500).send('Error interno del servidor');
  });
});

//----------------------------------------------------------------
// Iniciar el servidor y mostrar la IP
app.listen(port, () => {
  
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  // const connected=;
  if(networkInterfaces['Ethernet'] || networkInterfaces['Wi-Fi']){
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      const addresses = networkInterfaces[interfaceName].filter((iface) => {
          return iface.family === 'IPv4' && !iface.internal;
          
      });
      if(addresses[0]){
        console.log('-----------------------------------------------');
        console.log(`Servidor activo en la dirección IP ${addresses[0].address}:${port}`);
        console.log('-----------------------------------------------');
      }
      
        
    });
  }else{
    console.log('-----------------------------------------------');
    console.log(`Servidor activo en la dirección IP localhost:${port}`);
    console.log('-----------------------------------------------');
  }  
  
});



// // Eliminar una fila del archivo
// app.post('/eliminarFilaExcel', (req, res) => {
//   const filePath = path.join(__dirname, '../uploads', nombreArchivo);
//   const id = req.body.id; // Obtener el ID de la fila a eliminar desde la solicitud
  
//   XlsxPopulate.fromFileAsync(filePath).then(workbook => {
//       const sheet = workbook.sheet(0);
//       const range = sheet.usedRange();

//       // Buscar la fila con el ID correspondiente y borrar su contenido
//       for (let row = 2; row <= range.endCell().rowNumber()+1; row++) { // Comenzar desde la segunda fila (después de las cabeceras)
//           if (sheet.cell(row, 1).value() == id) { // Comprobar si el valor de la primera columna (ID) coincide
//               // Borrar el contenido de las celdas en la fila encontrada
//               for (let col = 1; col <= range.endCell().columnNumber(); col++) {
//                   sheet.cell(row, col).value("");
                  
//               }
              
//               return workbook.toFileAsync(filePath); // Guardar los cambios en el archivo Excel
//           }
//           console.log(row);
//       }
      
//       throw new Error('No se encontró la fila con el ID proporcionado');
//   }).then(() => {
//       res.send('Fila eliminada del archivo Excel.');
//   }).catch(err => {
//       console.error('Error al eliminar la fila del archivo Excel:', err);
//       res.status(500).send('Error interno del servidor');
//   });
// });

// function getColumnLetter(columnNumber) {
//   let columnLetter = '';
//   while (columnNumber > 0) {
//     let remainder = columnNumber % 26;
//     if (remainder === 0) {
//       columnLetter = 'Z' + columnLetter;
//       columnNumber = Math.floor(columnNumber / 26) - 1;
//     } else {
//       columnLetter = String.fromCharCode(remainder + 64) + columnLetter;
//       columnNumber = Math.floor(columnNumber / 26);
//     }
//   }
//   return columnLetter;
// }  
 

