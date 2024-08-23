
// Inicio: Llamar a la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    cargarTabla();
    
    openTab('datosPersonalesTab');
    
    handleCheckboxChange();
    
    const labels = document.getElementsByClassName('campo');
    Array.from(labels).forEach(label => {
        label.addEventListener('click', function() {
            document.getElementById('lblCampo').innerText = label.innerText.trim();
            document.getElementById('lblCampo').setAttribute('value', label.getAttribute('value'));
        });
    });
    // Array.from(document.getElementById('campoBusqueda')).forEach(label => {
    //     label.addEventListener('click', function() {
    //         document.getElementById('lblCampo').innerText = label.innerText;
    //     });
    // });

});


// Convertir el valor del input a mayúsculas y establecerlo como el nuevo valor
    // Obtener todos los elementos input de tipo text
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        if(this.value){
            this.value = this.value.toUpperCase();
        }
    });
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('readonly', 'true');
    input.addEventListener('focus', function() {
        this.removeAttribute('readonly');
    });
});
// botones menú----------------------------------------
//botón cargar excel
document.getElementById('btnCargarArchivo').addEventListener('click', function() {
    document.getElementById('cargarArchivo').click();
});
//btn qué base de datos se está usando?
document.getElementById('btnQueBaseSeUsa').addEventListener('click', async function() {
    let response = await fetch('/queBaseSeUsa', {
        method: 'GET'
    });
    alert(await response.text());
});
//btn estado del evento
document.getElementById('btnEstadoEvento').addEventListener('click', function() {
    window.location.href = 'estadoEvento.html';
});
//btn configurar etiquetas
document.getElementById('btnConfigurarEtiquetas').addEventListener('click', function() {
    window.location.href = 'configurarEtiquetas.html';
});
//btn estado del evento
document.getElementById('btnConfigurarDiplomas').addEventListener('click', function() {
    window.location.href = 'configurarDiplomas.html';
});

//--------------------------------------------------
//btn Búsqueda avanzada
document.getElementById("btnBusquedaAvanzada").addEventListener('click', function(e) {
    let campo=document.getElementById('campoBusqueda');
    if(campo.style.display=="block"){
        campo.style.display = 'none';
        document.getElementById('lblCampo').innerText ="Campo:";
        document.getElementById('lblCampo').setAttribute('value', '');
    }else{
        campo.style.display = 'block';
    }

});

//para que no se cierre el checklist
document.getElementById("checklist").addEventListener('click', function(e) {
    e.stopPropagation();
});


// Función para manejar el cambio en los checkboxes del checklist
function handleCheckboxChange() {
    var checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var checkboxId = checkbox.name;
            var columnIndex = parseInt(checkboxId) ; 

            var table = document.getElementById('tablaDatos');

            if (checkbox.checked) {
                // Mostrar la columna correspondiente
                table.querySelectorAll('tr th:nth-child(' + columnIndex + '), tr td:nth-child(' + columnIndex + ')').forEach(function(cell) {
                    cell.style.display = 'table-cell';
                });
            } else {
                // Ocultar la columna correspondiente
                table.querySelectorAll('tr th:nth-child(' + columnIndex + '), tr td:nth-child(' + columnIndex + ')').forEach(function(cell) {
                    cell.style.display = 'none';
                });
            }
        });
    });
}

// Recuperar el estado de las casillas de verificación desde el almacenamiento local
//y ocultar las columnas que no están tildadas
document.addEventListener('DOMContentLoaded', function() {
    var checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    var table = document.getElementById('tablaDatos');
    checkboxes.forEach(function(checkbox) {
        var isChecked = localStorage.getItem(checkbox.name) === 'true';
        checkbox.checked = isChecked;
        if (!checkbox.checked) {
            // Ocultar la columna correspondiente
            var columnIndex = parseInt(checkbox.name); // Calcular el índice de la columna
            table.querySelectorAll('tr th:nth-child(' + columnIndex + '), tr td:nth-child(' + columnIndex + ')').forEach(function(cell) {
                cell.style.display = 'none';
            });
        }
    });
    
});

// Guardar el estado de las casillas de verificación en el almacenamiento local
document.getElementById('checklist').addEventListener('change', function(event) {
    var checkbox = event.target;
    localStorage.setItem(checkbox.name, checkbox.checked);
});

// Función para cambiar de pestaña en detalles
function openTab(tabName) {
    // Obtener todas las pestañas y ocultarlas
    var tabs = document.getElementsByClassName("tabDetalles");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
        
    }
    tabs=document.getElementsByClassName("tablinks");
    
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.color = "black";
        
    }
    // Mostrar la pestaña seleccionada
    var id="boton"+tabName;
    document.getElementById(tabName).style.display = "block";
    document.getElementById(id).style.color ="blue";
}
//cambio de ventana detalles
document.getElementById("botondatosPersonalesTab").addEventListener("click", function() {
    openTab('datosPersonalesTab');
});
document.getElementById("botondatosCongresoTab").addEventListener("click", function() {
    openTab('datosCongresoTab');
});
document.getElementById("botoncomentariosTab").addEventListener("click", function() {
    openTab('comentariosTab');
});




//---------------------------------------------------

//guardar excel
document.getElementById('cargarArchivo').addEventListener('change', async function(event) {
    // const fileInput = document.getElementById('fileInput');
    const file = event.target.files[0]; // Obtener el primer archivo seleccionado
    // const file = fileInput.files[0];
    
    if (file) {
        const formData = new FormData();
        formData.append('archivo', file);
        
        try {
            let response = await fetch('/guardarArchivo', {
                method: 'POST',
                body: formData
            });
            
            // response= await fetch('/guardarNombreArchivo', {
            //     method: 'POST',
            //     body: {nuevoNombre: file.name}
            //   });
            // fetch('/guardarNombreArchivo', {
            //     method: 'POST',
            //     headers: {
            //       'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ nuevoNombre: file.name })
            // });
            if (response.ok) {
                
                
                //location.reload();
                recargarTabla();
                
            } else {
                alert('Error al guardar el archivo en el servidor.');
            }
        } catch (error) {
            alert('Error al realizar la solicitud:', error);
        }
    } else {
        alert('Ningún archivo seleccionado.');
    }
    
});


//cargar tabla
// const XlsxPopulate = require('xlsx-populate');
async function cargarTabla() {
    try {
        let checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
        let table = document.getElementById('tablaDatos');
        // let headers=document.querySelectorAll('#miTabla th'); 
        for(let checkbox of checkboxes) {
            let checkboxId = checkbox.name;
            let columnIndex = parseInt(checkboxId) ; 
                // Mostrar la columna correspondiente
            table.querySelectorAll('tr th:nth-child(' + columnIndex + '), tr td:nth-child(' + columnIndex + ')').forEach(function(cell) {
                cell.style.display = 'table-cell';
            });
        }
       
        const response = await fetch('/cargarTabla');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo');
        }

        let data = await response.json();
        
        // Crear filas y celdas de la tabla
        for (let i = 0; i < data.length; i++) {
            const rowData = data[i].slice(0,49); // Obtener los datos de la fila actual
            const row = document.createElement('tr'); // Crear una nueva fila
                        
            for(let cellData of rowData) {
                let cell = document.createElement('td'); // Crear una nueva celda
                cell.textContent = cellData; // Asignar el contenido del excel a la celda
                row.appendChild(cell); // Agregar la celda a la fila
                
                cell.style.textAlign="center";
            };
            table.querySelector('tbody').appendChild(row); // Agregar la fila a la tabla
            let cell = row.cells[7]; // presente
            
            // Establecer el color de fondo deseado para la celda
            if(cell.textContent==""){
                cell.style.backgroundColor = 'rgba(214, 2, 2, 0.466)';
            }else{
                cell.style.backgroundColor = 'rgba(2, 214, 2, 0.466)';
            };
            //seleccionar fila tabla
            row.addEventListener('click', async function(event) {
                document.querySelectorAll('tr').forEach(row => {
                    row.style.backgroundColor = ''; // Restablecer el color de fondo a su valor predeterminado
                });
                row.style.backgroundColor='rgba(22, 71, 204, 0.39)';
                //llenar los campos
                // alert(row.textContent);
                document.getElementById("idDetalles").value=row.cells[0].textContent;
                document.getElementById("apellidoDetalles").value=row.cells[1].textContent;
                document.getElementById("nombreDetalles").value=row.cells[2].textContent;
                document.getElementById("3erCampoDetalles").value=row.cells[3].textContent;
                document.getElementById("becaDetalles").value=row.cells[4].textContent;
                document.getElementById("nroBecaDetalles").value=row.cells[5].textContent;
                document.getElementById("credencialDetalles").value=row.cells[6].textContent;
                if(row.cells[7].textContent=="X" || row.cells[7].textContent=="x"){
                    document.getElementById("checkboxPresente").checked=true;
                }else{
                    document.getElementById("checkboxPresente").checked=false;
                }
                document.getElementById("direccionDetalles").value=row.cells[8].textContent;
                document.getElementById("codPostalDetalles").value=row.cells[9].textContent;
                document.getElementById("ciudadDetalles").value=row.cells[10].textContent;
                document.getElementById("provinciaDetalles").value=row.cells[11].textContent;
                document.getElementById("paisDetalles").value=row.cells[12].textContent;
                document.getElementById("telefonoDetalles").value=row.cells[13].textContent;
                document.getElementById("celDetalles").value=row.cells[14].textContent;
                document.getElementById("faxDetalles").value=row.cells[15].textContent;
                document.getElementById("emailDetalles").value=row.cells[16].textContent;
                document.getElementById("profesionDetalles").value=row.cells[17].textContent;
                document.getElementById("especialidadDetalles").value=row.cells[18].textContent;
                document.getElementById("institucionDetalles").value=row.cells[19].textContent;
                document.getElementById("cargoDetalles").value=row.cells[20].textContent;
                document.getElementById("matriculaDetalles").value=row.cells[21].textContent;
                document.getElementById("documentoDetalles").value=row.cells[22].textContent;
                document.getElementById("precongresoDetalles").value=row.cells[23].textContent;
                document.getElementById("cursosDetalles").value=row.cells[24].textContent;
                document.getElementById("cursoVariosDetalles").value=row.cells[25].textContent;
                document.getElementById("sociosDetalles").value=row.cells[26].textContent;
                document.getElementById("noSociosDetalles").value=row.cells[27].textContent;
                document.getElementById("pagoDetalles").value=row.cells[28].textContent;
                document.getElementById("debeDetalles").value=row.cells[29].textContent;
                document.getElementById("montoPagoDetalles").value=row.cells[30].textContent;
                document.getElementById("reciboDetalles").value=row.cells[31].textContent;
                document.getElementById("efectivoDetalles").value=row.cells[32].textContent;
                document.getElementById("chequeDetalles").value=row.cells[33].textContent;
                document.getElementById("depositoDetalles").value=row.cells[34].textContent;
                document.getElementById("tarjetaDetalles").value=row.cells[35].textContent;
                document.getElementById("cuitDetalles").value=row.cells[36].textContent;

                if(row.cells[37].textContent=="X" || row.cells[37].textContent=="x"){
                    document.getElementById("checkboxPreacreditado").checked=true;
                }else{
                    document.getElementById("checkboxPreacreditado").checked=false;
                }
                document.getElementById("webDetalles").value=row.cells[38].textContent;
                document.getElementById("comentario1Detalles").value=row.cells[39].textContent;
                document.getElementById("comentario2Detalles").value=row.cells[40].textContent;
                document.getElementById("comentario3Detalles").value=row.cells[41].textContent;
                document.getElementById("comentario4Detalles").value=row.cells[42].textContent;
                document.getElementById("comentario5Detalles").value=row.cells[43].textContent;
                document.getElementById("comentario6Detalles").value=row.cells[44].textContent;
                document.getElementById("comentario7Detalles").value=row.cells[45].textContent;
                document.getElementById("comentario8Detalles").value=row.cells[46].textContent;
                document.getElementById("comentario9Detalles").value=row.cells[47].textContent;
                document.getElementById("comentario10Detalles").value=row.cells[48].textContent;
                
            });
        };

        for(let checkbox of checkboxes) {
            let checkboxId = checkbox.name;
            let columnIndex = parseInt(checkboxId) ; 
                // Mostrar la columna correspondiente
            if (!checkbox.checked) {
                table.querySelectorAll('tr th:nth-child(' + columnIndex + '), tr td:nth-child(' + columnIndex + ')').forEach(function(cell) {
                    cell.style.display = 'none';
                });
            }
        }
        
        // // Crear filas y celdas de la tabla
        // data.forEach(rowData => {
        //     const row = document.createElement('tr');
        //     rowData.forEach(cellData => {
        //         const cell = document.createElement('td');
        //         cell.textContent = cellData;
        //         row.appendChild(cell);
        //     });
        //     table.appendChild(row);
        // });
    } catch (error) {
        console.error('Error al cargar tabla funciones');
    }
};

async function recargarTabla(){
    document.querySelectorAll('#tablaDatos tbody tr').forEach(tr => {
        tr.remove();
    });
    await cargarTabla();
}

//------------botones-----------------
//botón nuevo
document.getElementById("btnNuevo").addEventListener("click", function() {
    document.querySelectorAll('tr').forEach(row => {
        row.style.backgroundColor = ''; // Restablecer el color de fondo a su valor predeterminado
    });
    //vaciar los campos
    // alert(row.textContent);
    document.getElementById("idDetalles").value="";
    document.getElementById("apellidoDetalles").value="";
    document.getElementById("nombreDetalles").value="";
    document.getElementById("3erCampoDetalles").value="";
    document.getElementById("becaDetalles").value="";
    document.getElementById("nroBecaDetalles").value="";
    document.getElementById("credencialDetalles").value="";
    document.getElementById("checkboxPresente").checked=false;
    document.getElementById("direccionDetalles").value="";
    document.getElementById("codPostalDetalles").value="";
    document.getElementById("ciudadDetalles").value="";
    document.getElementById("provinciaDetalles").value="";
    document.getElementById("paisDetalles").value="";
    document.getElementById("telefonoDetalles").value="";
    document.getElementById("celDetalles").value="";
    document.getElementById("faxDetalles").value="";
    document.getElementById("emailDetalles").value="";
    document.getElementById("profesionDetalles").value="";
    document.getElementById("especialidadDetalles").value="";
    document.getElementById("institucionDetalles").value="";
    document.getElementById("cargoDetalles").value="";
    document.getElementById("matriculaDetalles").value="";
    document.getElementById("documentoDetalles").value="";
    document.getElementById("precongresoDetalles").value="";
    document.getElementById("cursosDetalles").value="";
    document.getElementById("cursoVariosDetalles").value="";
    document.getElementById("sociosDetalles").value="";
    document.getElementById("noSociosDetalles").value="";
    document.getElementById("pagoDetalles").value="";
    document.getElementById("debeDetalles").value="";
    document.getElementById("montoPagoDetalles").value="";
    document.getElementById("reciboDetalles").value="";
    document.getElementById("efectivoDetalles").value="";
    document.getElementById("chequeDetalles").value="";
    document.getElementById("depositoDetalles").value="";
    document.getElementById("tarjetaDetalles").value="";
    document.getElementById("cuitDetalles").value="";
    document.getElementById("checkboxPreacreditado").checked=false;
    document.getElementById("webDetalles").value="";
    document.getElementById("comentario1Detalles").value="";
    document.getElementById("comentario2Detalles").value="";
    document.getElementById("comentario3Detalles").value="";
    document.getElementById("comentario4Detalles").value="";
    document.getElementById("comentario5Detalles").value="";
    document.getElementById("comentario6Detalles").value="";
    document.getElementById("comentario7Detalles").value="";
    document.getElementById("comentario8Detalles").value="";
    document.getElementById("comentario9Detalles").value="";
    document.getElementById("comentario10Detalles").value="";
    
});

//agregar dato al excel
document.getElementById("btnGuardarSinImprimir").addEventListener("click", async function() {
    awaitguardarDatos();
});
async function guardarDatos(){
    let presente="",preacreditado="", id=document.getElementById("idDetalles").value;
    let table=document.getElementById("tablaDatos");
    if(document.getElementById("checkboxPresente").checked==true){
        presente="X";
    }
    if(document.getElementById("checkboxPreacreditado").checked==true){
        preacreditado="X";
    }        
    if(id==""){
        //let ultimaFila=document.getElementById("tablaDatos").rows[table.rows.length-1];
        maxId=0;
        document.querySelectorAll('tr').forEach(row => {
            const idCell = row.querySelector('td:first-child'); // Obtiene la celda de la primera columna (donde está el ID)
            if (idCell) { // Verifica si la celda existe
                const idActual = parseInt(idCell.textContent); // Obtiene el ID y lo convierte a entero
                if (!isNaN(idActual) && idActual >= maxId) { // Verifica si el ID es un número válido y es mayor que el máximo actual
                    maxId = idActual+1; // Actualiza el valor máximo del ID
                }
            }
    
        });
        
        await fetch('/agregarFilaExcel', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify([maxId,
                document.getElementById("apellidoDetalles").value,
                document.getElementById("nombreDetalles").value,
                document.getElementById("3erCampoDetalles").value,
                document.getElementById("becaDetalles").value,
                document.getElementById("nroBecaDetalles").value,
                document.getElementById("credencialDetalles").value,
                presente,
                document.getElementById("direccionDetalles").value,
                document.getElementById("codPostalDetalles").value,
                document.getElementById("ciudadDetalles").value,
                document.getElementById("provinciaDetalles").value,
                document.getElementById("paisDetalles").value,
                document.getElementById("telefonoDetalles").value,
                document.getElementById("celDetalles").value,
                document.getElementById("faxDetalles").value,
                document.getElementById("emailDetalles").value,
                document.getElementById("profesionDetalles").value,
                document.getElementById("especialidadDetalles").value,
                document.getElementById("institucionDetalles").value,
                document.getElementById("cargoDetalles").value,
                document.getElementById("matriculaDetalles").value,
                document.getElementById("documentoDetalles").value,
                document.getElementById("precongresoDetalles").value,
                document.getElementById("cursosDetalles").value,
                document.getElementById("cursoVariosDetalles").value,
                document.getElementById("sociosDetalles").value,
                document.getElementById("noSociosDetalles").value,
                document.getElementById("pagoDetalles").value,
                document.getElementById("debeDetalles").value,
                document.getElementById("montoPagoDetalles").value,
                document.getElementById("reciboDetalles").value,
                document.getElementById("efectivoDetalles").value,
                document.getElementById("chequeDetalles").value,
                document.getElementById("depositoDetalles").value,
                document.getElementById("tarjetaDetalles").value,
                document.getElementById("cuitDetalles").value,
                preacreditado,
                document.getElementById("webDetalles").value,
                document.getElementById("comentario1Detalles").value,
                document.getElementById("comentario2Detalles").value,
                document.getElementById("comentario3Detalles").value,
                document.getElementById("comentario4Detalles").value,
                document.getElementById("comentario5Detalles").value,
                document.getElementById("comentario6Detalles").value,
                document.getElementById("comentario7Detalles").value,
                document.getElementById("comentario8Detalles").value,
                document.getElementById("comentario9Detalles").value,
                document.getElementById("comentario10Detalles").value]) // Datos que se agregarán en la fila
        });
    }else{
        await fetch('/modificarFilaExcel', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify([id,
                document.getElementById("apellidoDetalles").value,
                document.getElementById("nombreDetalles").value,
                document.getElementById("3erCampoDetalles").value,
                document.getElementById("becaDetalles").value,
                document.getElementById("nroBecaDetalles").value,
                document.getElementById("credencialDetalles").value,
                presente,
                document.getElementById("direccionDetalles").value,
                document.getElementById("codPostalDetalles").value,
                document.getElementById("ciudadDetalles").value,
                document.getElementById("provinciaDetalles").value,
                document.getElementById("paisDetalles").value,
                document.getElementById("telefonoDetalles").value,
                document.getElementById("celDetalles").value,
                document.getElementById("faxDetalles").value,
                document.getElementById("emailDetalles").value,
                document.getElementById("profesionDetalles").value,
                document.getElementById("especialidadDetalles").value,
                document.getElementById("institucionDetalles").value,
                document.getElementById("cargoDetalles").value,
                document.getElementById("matriculaDetalles").value,
                document.getElementById("documentoDetalles").value,
                document.getElementById("precongresoDetalles").value,
                document.getElementById("cursosDetalles").value,
                document.getElementById("cursoVariosDetalles").value,
                document.getElementById("sociosDetalles").value,
                document.getElementById("noSociosDetalles").value,
                document.getElementById("pagoDetalles").value,
                document.getElementById("debeDetalles").value,
                document.getElementById("montoPagoDetalles").value,
                document.getElementById("reciboDetalles").value,
                document.getElementById("efectivoDetalles").value,
                document.getElementById("chequeDetalles").value,
                document.getElementById("depositoDetalles").value,
                document.getElementById("tarjetaDetalles").value,
                document.getElementById("cuitDetalles").value,
                preacreditado,
                document.getElementById("webDetalles").value,
                document.getElementById("comentario1Detalles").value,
                document.getElementById("comentario2Detalles").value,
                document.getElementById("comentario3Detalles").value,
                document.getElementById("comentario4Detalles").value,
                document.getElementById("comentario5Detalles").value,
                document.getElementById("comentario6Detalles").value,
                document.getElementById("comentario7Detalles").value,
                document.getElementById("comentario8Detalles").value,
                document.getElementById("comentario9Detalles").value,
                document.getElementById("comentario10Detalles").value]) // Datos que se agregarán en la fila
        });
        
    }
    // Recargar la tabla
    // Esperar 2 segundos (2000 milisegundos)
    // await new Promise(resolve => setTimeout(resolve, 1000));
    recargarTabla();
    // window.location.table.reload();
    
};
//actualizar tabla
document.getElementById("btnActualizarTabla").addEventListener("click", function() {
    recargarTabla();
});
//eliminar inscripto
document.getElementById("btnEliminarInscripto").addEventListener("click", async function() {
//     eliminarInscripto();
// });
// async function eliminarInscripto(){
    let idIngresado=document.getElementById("idDetalles").value;
    // alert("se va a eliminar una fila");
    // await fetch('/eliminarFilaExcel', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ id: idIngresado })
    // });
    await fetch('/modificarFilaExcel', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify([idIngresado,"",""])
    });
    console.log("se eliminó");
    recargarTabla();
});


// async function filtrarDatos(){
//     // cargarTabla();
    

    
// }


// Iterar sobre cada elemento con la clase "campos" de busqueda
Array.from(document.getElementsByClassName("campos")).forEach(camposDiv => {
   // Agregar un event listener para el evento 'input' a cada input
    camposDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', async function() {
            try {
                // let checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
                // let table = document.getElementById('tablaDatos');
                // let filas=document.querySelectorAll('#miTabla tr'); 
                await recargarTabla();
                
                
                

                // var filasTabla=document.querySelectorAll('#tablaDatos tbody tr');
                // console.log(apellidosTabla);
                const apellidoIngresado = document.getElementById("apellidoBusqueda").value;
                if(apellidoIngresado.length>0){
                    // document.querySelectorAll('#tablaDatos tbody tr').forEach(tr => {
                    let filasTabla=document.querySelectorAll('#tablaDatos tbody tr');
                    let apellidoTabla=filasTabla[1].querySelector('td:nth-child(2)');
                    filasTabla.forEach(filaTabla=>{
                        // Obtener todas las celdas dentro de la fila
                        // const cells = tr.querySelectorAll('td');
                        apellidoTabla = filaTabla.querySelector('td:nth-child(2)');
                        //if(apellidoTabla[0,apellidoIngresado.length]!=apellidoIngresado){
                        if (!(apellidoTabla.textContent.startsWith(apellidoIngresado))) {
                            filaTabla.innerHTML="";
                        }
                        // console.log(apellidoTabla.textContent);
                    });
                }
                const nombreIngresado=document.getElementById("nombreBusqueda").value;
                if(nombreIngresado.length>0){
                    let filasTabla=document.querySelectorAll('#tablaDatos tbody tr');
                    let nombreTabla=filasTabla[1].querySelector('td:nth-child(3)');
                    filasTabla.forEach(filaTabla=>{
                        // Obtener todas las celdas dentro de la fila
                        // const cells = tr.querySelectorAll('td');
                        nombreTabla = filaTabla.querySelector('td:nth-child(3)');
                        //if(apellidoTabla[0,apellidoIngresado.length]!=apellidoIngresado){
                        if (nombreTabla && !(nombreTabla.textContent.startsWith(nombreIngresado))) {
                            filaTabla.innerHTML="";
                        }
                        // console.log(apellidoTabla.textContent);
                    });
                }
                const idIngresado=document.getElementById("idBusqueda").value;
                if(idIngresado.length>0){
                    let filasTabla=document.querySelectorAll('#tablaDatos tbody tr');
                    let idTabla=filasTabla[1].querySelector('td:nth-child(1)');
                    filasTabla.forEach(filaTabla=>{
                        // Obtener todas las celdas dentro de la fila
                        // const cells = tr.querySelectorAll('td');
                        idTabla = filaTabla.querySelector('td:nth-child(1)');
                        //if(apellidoTabla[0,apellidoIngresado.length]!=apellidoIngresado){
                        if (idTabla && !(idTabla.textContent.startsWith(idIngresado))) {
                            filaTabla.innerHTML="";
                        }
                        // console.log(apellidoTabla.textContent);
                    });
                }

                const campoBusqueda=document.getElementById("lblCampo");
                const campoBusquedaIngresado=document.getElementById("valorCampoBusqueda").value;   
                if(campoBusqueda.innerText.trim()!="Campo:"){
                    let idCampo=campoBusqueda.getAttribute('value');
                    let filasTabla=document.querySelectorAll('#tablaDatos tbody tr');
                    let campoTabla=filasTabla[1].querySelector('td:nth-child(' + idCampo + ')');
                    filasTabla.forEach(filaTabla=>{
                        // Obtener todas las celdas dentro de la fila
                        // const cells = tr.querySelectorAll('td');
                        campoTabla = filaTabla.querySelector('td:nth-child(' + idCampo + ')');
                        //if(apellidoTabla[0,apellidoIngresado.length]!=apellidoIngresado){
                        if (campoBusquedaIngresado && !(campoTabla.textContent.startsWith(campoBusquedaIngresado))) {
                            filaTabla.innerHTML="";
                        }else if(campoBusquedaIngresado=="" && campoTabla.textContent!=""){
                            filaTabla.innerHTML="";
                        }
                        // console.log(apellidoTabla.textContent);
                    });
                }
                
                // table.body.innerHTML = '';
                
            }catch (error) {
                console.error('Error al filtrar datos'+error);
            }
            
        });
        
    });
});
//---------------------------------------------------------------------------------------

document.getElementById('btnCredencial').addEventListener('click', async () => {
    const { PDFDocument, rgb } = PDFLib;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([80 * 2.83465, 40 * 2.83465]);

    page.drawText('Credencial de ejemplo', {
        x: 10,
        y: page.getHeight() - 20,
        size: 12,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credencial5.pdf';
    a.click();
    URL.revokeObjectURL(url);
});

//---------------------------------------------------------------------------------------

// Esperar 2 segundos (2000 milisegundos)
// await new Promise(resolve => setTimeout(resolve, 1000));

// const divObservado = document.getElementById('tableDatos');

// // Crea una instancia de ResizeObserver
// const observador = new ResizeObserver(entries => {
//     console.log("acá");
//   for (let entry of entries) {
//     // entry.contentRect contiene el nuevo tamaño del elemento observado
//     const nuevoAncho = entry.contentRect.width;
//     const nuevoAlto = entry.contentRect.height;

//     // Llama a la función que deseas ejecutar cuando cambie el tamaño
//     miFuncion(nuevoAncho, nuevoAlto);
//   }
// });

// Observa el div seleccionado
// observador.observe(divObservado);

// function updateColumnWidths() {
//     // Obtener todas las celdas de la primera fila (encabezados)
//     const headerCells = document.querySelectorAll('thead tr:first-child th');
    
//     // Iterar sobre las celdas de encabezado y establecer el ancho de las columnas
//     headerCells.forEach(headerCell => {
//         const columnIndex = headerCell.cellIndex; // Obtener el índice de la columna
//         const columnWidth = headerCell.offsetWidth; // Obtener el ancho de la columna

//         // Obtener todas las celdas de datos en la misma columna
//         const dataCells = document.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
        
//         // Establecer el ancho de cada celda de datos en la columna
//         dataCells.forEach(dataCell => {
//             dataCell.style.width = `${16}px`;
//         });
//     });
// }
    // alert(rutaArchivo);
    // cargarArchivo(rutaArchivo);


//Función para abrir archivo
// document.getElementById('fileInput').addEventListener('change', function() {
//     var fileName = document.getElementById('fileInput').files[0].name;
//     document.getElementById('fileName').textContent = 'Archivo seleccionado: ' + fileName;
//     document.querySelector('input[type="submit"]').style.display = 'inline-block';
//     var fileNameElement = document.getElementById('fileName');
//     if (fileNameElement) {
//         var fileNameInput = document.getElementById('fileInput');
//         fileNameInput.addEventListener('change', function() {
//             var fileName = fileNameInput.files[0].name;
//             fileNameElement.textContent = 'Archivo seleccionado: ' + fileName;
//             var submitButton = document.querySelector('input[type="submit"]');
//             if (submitButton) {
//                 submitButton.style.display = 'inline-block';
//             }
//         });
//         alert('cargado');
//     } else {
//         alert('Error al cargar los datos del archivo.aaaaaaaa');
//     }
// });
// Obtener los datos del servidor y agregarlos a la tabla
// $(document).ready(function() {
//     // Manejar clic en el botón de carga
//     $('#uploadButton').click(function() {
//         var formData = new FormData($('#fileForm')[0]);
//         $.ajax({
//             url: '/upload',
//             type: 'POST',
//             data: formData,
//             processData: false,
//             contentType: false,
//             success: function(data) {
//                 // Construir la tabla con los datos recibidos
//                 $('#tablaDatos').DataTable({
//                     data: data,
//                     columns: [
//                         { data: 'ID' },
//                         { data: 'Apellido' },
//                         { data: 'Nombre' },
//                         // Agrega más columnas según tus datos
//                     ]
//                 });
//             },
//             error: function() {
//                 alert('Error al cargar los datos del archivo.');
//             }
//         });
//     });
// });
// document.addEventListener('DOMContentLoaded', function() {
//     var fileNameElement = document.getElementById('fileName');
//     if (fileNameElement) {
//         var fileNameInput = document.getElementById('fileInput');
//         fileNameInput.addEventListener('change', function() {
//             var fileName = fileNameInput.files[0].name;
//             fileNameElement.textContent = 'Archivo seleccionado: ' + fileName;
//             var submitButton = document.querySelector('input[type="submit"]');
//             if (submitButton) {
//                 submitButton.style.display = 'inline-block';
//             }
//         });
//     } else {
//         alert('Error al cargar los datos del archivo.aaaaaaaa');
//     }
// });

// $(document).ready(function() {
//     // Llamada a la ruta '/upload' para obtener los datos del archivo Excel
//     $.ajax({
//         url: '/upload',
//         type: 'POST',
//         data: new FormData($('#fileForm')[0]),
//         processData: false,
//         contentType: false,
//         success: function(data) {
//             // Construir la tabla con los datos recibidos
//             $('#tablaDatos').DataTable({
//                 data: data,
//                 columns: [
//                     { data: 'ID' },
//                     { data: 'Apellido' },
//                     { data: 'Nombre' },
//                     // Agrega más columnas aquí según tus datos
//                 ]
//             });
//         },
//         error: function() {
//             alert('Error al cargar los datos del archivo.');
//         }
//     });
// });
// window.onload = function() {
//     fetch('/upload')
//     .then(response => response.json())
//     .then(data => {
//         var tableBody = document.querySelector('#tablaDatos tbody');
//         data.forEach(function(row, index) {
//             var newRow = document.createElement('tr');
//             newRow.innerHTML = '<td>' + (index + 1) + '</td>' +
//                                 '<td>' + row['ID'] + '</td>' +
//                                 '<td>' + row['Apellido'] + '</td>';
//             // Agregar más celdas aquí para cada columna que quieras mostrar
//             tableBody.appendChild(newRow);
//         });
//     });
// };
// $(document).ready(function() {
//     // Carga los datos de tu archivo Excel en formato JSON
//     let my_data = JSON.parse('{{ my_data | tojson }}');
//     let my_cols = JSON.parse('{{ my_cols | tojson }}');
//     alert('impreso');
//     // Inicializa DataTables con los datos y columnas proporcionados
//     $('#myTable').DataTable({
//         "data": my_data,
//         "columns": my_cols
//     });
//     var row = document.createElement('tr');

//     // Agregar la celda para el número de fila
//     var cellNumber = document.createElement('td');
//     cellNumber.textContent = i + 1; // El número de fila comienza en 1
//     row.appendChild(cellNumber);

//     // Agregar celdas adicionales
//     for (var j = 0; j < 20; j++) {
//         var cell = document.createElement('td');
//         cell.textContent = 'Dato ' + (j + 1);
//         row.appendChild(cell);
//     }

//     // Agregar la fila al cuerpo de la tabla
//     tbody.appendChild(row);
// });
//-----Pestañas de detalles-------------


// function openTab(evt, tabName) {
//     var i, tabcontent, tablinks;
    
//     // Ocultar todos los contenidos de las pestañas
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }
    
//     // Desactivar todos los botones de las pestañas
//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//         tablinks[i].classList.remove("active");
//     }
    
//     // Mostrar el contenido de la pestaña seleccionada y activar su botón correspondiente
//     document.getElementById(tabName).style.display = "block";
//     evt.currentTarget.classList.add("active");
// }

// // Establecer la pestaña por defecto al cargar la página
// document.getElementById("datosPersonalesTab").style.display = "block";
// document.getElementsByClassName("tablinks")[0].classList.add("active");
// handleCheckboxInicio();
// Obtener la tabla y el cuerpo de la tabla
// var table = document.querySelector('.tabla-con-scroll table');
// var tbody = table.querySelector('tbody');

// // Crear 50 filas de ejemplo
// for (var i = 0; i < 50; i++) {
//     // Crear una nueva fila
//     var row = document.createElement('tr');

//     // Agregar la celda para el número de fila
//     var cellNumber = document.createElement('td');
//     cellNumber.textContent = i + 1; // El número de fila comienza en 1
//     row.appendChild(cellNumber);

//     // Agregar celdas adicionales
//     for (var j = 0; j < 20; j++) {
//         var cell = document.createElement('td');
//         cell.textContent = 'Dato ' + (j + 1);
//         row.appendChild(cell);
//     }

//     // Agregar la fila al cuerpo de la tabla
//     tbody.appendChild(row);
// }