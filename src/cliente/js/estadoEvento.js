

// Inicio: Llamar a la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('/cargarTabla');
    
    if (!response.ok) {
        throw new Error('No se pudo cargar el archivo');
    }
    let data = await response.json();
    let inscriptos = document.getElementById('lblInscriptos');
    let presentes = document.getElementById('lblPresentes');
    let preacreditados = document.getElementById('lblPreacreditados');
    let cantidadPresentes=0, cantidadPreacreditados=0;
    inscriptos.innerHTML = `Inscriptos:&nbsp;&nbsp;${data.length}&nbsp;&nbsp;`;

    
    for (let i = 0; i < data.length; i++) {
        const participante = data[i].slice(0,49); // Obtener los datos de la fila actual
        if(["x", "X"].includes(participante[7])){
            cantidadPresentes+=1;
        }
        if(["x", "X"].includes(participante[37])){
            cantidadPreacreditados+=1;
        }
    }
    presentes.innerHTML=`Presentes:&nbsp;&nbsp;${cantidadPresentes}`;
    preacreditados.innerHTML=`Preacreditados:&nbsp;&nbsp;${cantidadPreacreditados}&nbsp;&nbsp;&nbsp;&nbsp;`;
    // try {
    //     let response = await fetch('/llenarEstado', {
    //         method: 'POST'
    //     });
        
    //     if (response.ok) {
    //         recargarTabla();
    //     } else {
    //         alert('Error al guardar el archivo en el servidor.');
    //     }
    // } catch (error) {
    //     alert('Error al realizar la solicitud:', error);
    // }
});
//estado del evento
//btn pagina principal
document.getElementById('btnPaginaPrincipal').addEventListener('click', function() {

    window.location.href = 'index.html';
});

//------------------ Configurar Etiquetas----------------------





