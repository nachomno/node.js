// Inicio: Llamar a la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // const medidas = document.getElementsByClassName('renglon');
    // Array.from(medidas).forEach(medida => {
    //     medida.addEventListener('click', function() {
    //         document.getElementById('btnTamañoCredencial').innerText = medida.innerText.trim();
    //         document.getElementById('btnTamañoCredencial').setAttribute('value', medida.getAttribute('value'));
    //     });
    // });
    // const labels = document.getElementsByClassName('campo');
    // Array.from(labels).forEach(label => {
    //     label.addEventListener('click', function() {
    //         document.getElementById('lblCampo').innerText = label.innerText.trim();
    //         document.getElementById('lblCampo').setAttribute('value', label.getAttribute('value'));
    //     });
    // });
    // const id = document.getElementById("credencialApellido");
    // id.style.fontFamily = "'Times New Roman', Times, serif";
    // id.style.backgroundColor="black";
    // document.getElementById('credencialApellido').style.cssText = 'font-family: "Britanic Bold"; font-size: 20px;';
    // document.getElementById('credencialIDBarra').style.cssText = 'font-family: "Code39", sans-serif; font-size: 30px; barHeight: 100px';
    // document.getElementById("credencialNombre").style.cssText="background-color: black; margin: 20px;";
    
    // $("#credencialID").JsBarcode(document.getElementById("credencialID").textContent,{displayValue:true,fontSize:20,format:"CODE39",width:2,height:35});
    cargarDatos();
});

async function cargarDatos(){
    
    try{
        const response = await fetch('/datosServidor');
        if (!response.ok) {
            throw new Error('No se pudo cargar los datos');
        }
        let data = await response.json();
        let forms=document.querySelectorAll('form');
        // console.log(forms[0].querySelectorAll('select')[0].value);
        // forms[0].querySelector('input').value=data[0][0].textContent;
        let tds=document.querySelectorAll('td');
        
        forms[0].querySelectorAll('select')[0].value=data[0][0];
        // console.log(data);
        tds[0].querySelectorAll('input')[0].checked=(data[1][0]==='true');
        forms[1].querySelectorAll('select')[0].value=data[2][0];
        forms[2].querySelectorAll('select')[0].value=data[3][0];
        forms[3].querySelectorAll('select')[0].value=data[4][0];
        // const apellido = document.getElementById("credencialApellido");
        // apellido.style.fontFamily = `${data[2][0]}, sans-serif`;
        $("#etiquetaApellido").css({"font-size": data[2][0]*1.8,"font-family": data[4][0]});
        if(data[1][0]=='false'){
            $("#etiquetaApellido").css({"display": 'none'});
        }
        if(data[3][0]=="Izquierda"){
            $("#etiquetaApellido").css("margin-left", "auto");
        }else if(data[3][0]=="Derecha"){
            $("#etiquetaApellido").css("margin-right", "auto");
        }
        tds[4].querySelectorAll('input')[0].checked=(data[1][1]==='true');
        forms[4].querySelectorAll('select')[0].value=data[2][1];
        forms[5].querySelectorAll('select')[0].value=data[3][1];
        forms[6].querySelectorAll('select')[0].value=data[4][1];
        $("#etiquetaNombre").css({"font-size": data[2][1]*1.8,"font-family": data[4][1]});
        if(data[1][1]=='false'){
            $("#etiquetaNombre").css({"display": 'none'});
        }
        if(data[3][1]=="Izquierda"){
            $("#etiquetaNombre").css("margin-left", "auto");
        }else if(data[3][1]=="Derecha"){
            $("#credencialNombre").css("margin-right", "auto");
        }
        tds[8].querySelectorAll('input')[0].checked=(data[1][2]==='true');
        forms[7].querySelectorAll('select')[0].value=data[2][2];
        forms[8].querySelectorAll('select')[0].value=data[3][2];
        forms[9].querySelectorAll('select')[0].value=data[4][2];
        $("#etiquetaCredencial").css({"font-size": data[2][2]*1.8,"font-family": data[4][2]});
        if(data[1][2]=='false'){
            $("#etiquetaCredencial").css({"display": 'none'});
        }
        if(data[3][2]=="Izquierda"){
            $("#etiquetaCredencial").css("margin-left", "auto");
        }else if(data[3][2]=="Derecha"){
            $("#etiquetaCredencial").css("margin-right", "auto");
        }
        tds[12].querySelectorAll('input')[0].checked=(data[1][3]==='true');
        forms[10].querySelectorAll('select')[0].value=data[2][3];
        forms[11].querySelectorAll('select')[0].value=data[3][3];
        forms[12].querySelectorAll('select')[0].value=data[4][3];
        $("#etiqueta3erCampo").css({"font-size": data[2][3]*1.8,"font-family": data[4][3]});
        if(data[4][3]=='false'){
            $("#etiqueta3erCampo").css({"display": 'none'});
        }
        if(data[4][3]=="Izquierda"){
            $("#etiqueta3erCampo").css("margin-left", "auto");
        }else if(data[4][3]=="Derecha"){
            $("#credencial3erCampo").css("margin-right", "auto");
        }
        tds[16].querySelectorAll('input')[0].checked=(data[1][4]==='true');
        forms[13].querySelectorAll('select')[0].value=data[2][4];
        forms[14].querySelectorAll('select')[0].value=data[3][4];
        forms[15].querySelectorAll('select')[0].value=data[4][4];
        $("#etiquetaBeca").css({"font-size": data[2][4]*1.8,"font-family": data[4][4]});
        if(data[1][4]=='false'){
            $("#etiquetaBeca").css({"display": 'none'});
        }
        if(data[4][4]=="Izquierda"){
            $("#etiquetaBeca").css("margin-left", "auto");
        }else if(data[4][4]=="Derecha"){
            $("#etiquetaBeca").css("margin-right", "auto");
        }
        tds[20].querySelectorAll('input')[0].checked=(data[1][5]==='true');
        forms[16].querySelectorAll('select')[0].value=data[2][5];
        forms[17].querySelectorAll('select')[0].value=data[3][5];
        forms[18].querySelectorAll('select')[0].value=data[4][5];
        $("#etiquetaID").JsBarcode("12345",{displayValue:true,format:data[4][5],width:2,height:data[2][5]*1.5});
        // $("#etiquetaID").css({"font-size": data[2][2],"font-family": data[4][2]});
        if(data[1][5]=='false'){
            $("#etiquetaID").css({"display": 'none'});
        }
        if(data[4][5]=="Izquierda"){
            $("#etiquetaID").css("margin-left", "auto");
        }else if(data[4][5]=="Derecha"){
            $("#etiquetaID").css("margin-right", "auto");
        }
        console.log(forms); 
        // `
        // console.log(data);
    }catch(error){
        console.error('error al cargar datos de la etiqueta: ',error)
    }
};
//btn guardar Credencial
document.getElementById('btnGuardarCredencial').addEventListener('click', async function() {
    let forms=document.querySelectorAll('form');
    let tds=document.querySelectorAll('td');
    // console.log(data);
    await fetch('/guardarCredencial',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify([[forms[0].querySelectorAll('select')[0].value],
            [tds[0].querySelectorAll('input')[0].checked.toString(),
            tds[4].querySelectorAll('input')[0].checked.toString(),
            tds[8].querySelectorAll('input')[0].checked.toString(),
            tds[12].querySelectorAll('input')[0].checked.toString(),
            tds[16].querySelectorAll('input')[0].checked.toString(),
            tds[20].querySelectorAll('input')[0].checked.toString()],
            [forms[1].querySelectorAll('select')[0].value,
            forms[4].querySelectorAll('select')[0].value,
            forms[7].querySelectorAll('select')[0].value,
            forms[10].querySelectorAll('select')[0].value,
            forms[13].querySelectorAll('select')[0].value,
            forms[16].querySelectorAll('select')[0].value],
            [forms[2].querySelectorAll('select')[0].value,
            forms[5].querySelectorAll('select')[0].value,
            forms[8].querySelectorAll('select')[0].value,
            forms[11].querySelectorAll('select')[0].value,
            forms[14].querySelectorAll('select')[0].value,
            forms[17].querySelectorAll('select')[0].value],
            [forms[3].querySelectorAll('select')[0].value,
            forms[6].querySelectorAll('select')[0].value,
            forms[9].querySelectorAll('select')[0].value,
            forms[12].querySelectorAll('select')[0].value,
            forms[15].querySelectorAll('select')[0].value,
            forms[18].querySelectorAll('select')[0].value]])
    });
});

//btn pagina principal
document.getElementById('btnPaginaPrincipal').addEventListener('click', function() {

    window.location.href = 'index.html';
});

// console.log(forms[0].querySelectorAll('select')[0].value);
// forms[0].querySelector('input').value=data[0][0].textContent;
    
// let data = Array.from({ length: 5 }, () => Array(6).fill(0));
// data[0][0]=forms[0].querySelectorAll('select')[0].value;
//     data[1][0]=tds[0].querySelectorAll('input')[0].checked.toString();
//     data[2][0]=forms[1].querySelectorAll('select')[0].value;
//     data[3][0]=forms[2].querySelectorAll('select')[0].value;
//     data[4][0]=forms[3].querySelectorAll('select')[0].value;
//     data[1][1]=tds[4].querySelectorAll('input')[0].checked.toString();
//     data[2][1]=forms[4].querySelectorAll('select')[0].value;
//     data[3][1]=forms[5].querySelectorAll('select')[0].value;
//     data[4][1]=forms[6].querySelectorAll('select')[0].value;
//     data[1][2]=tds[8].querySelectorAll('input')[0].checked.toString();
//     data[2][2]=forms[7].querySelectorAll('select')[0].value;
//     data[3][2]=forms[8].querySelectorAll('select')[0].value;
//     data[4][2]=forms[9].querySelectorAll('select')[0].value;
//     data[1][3]=tds[12].querySelectorAll('input')[0].checked.toString();
//     data[2][3]=forms[10].querySelectorAll('select')[0].value;
//     data[3][3]=forms[11].querySelectorAll('select')[0].value;
//     data[4][3]=forms[12].querySelectorAll('select')[0].value;
//     data[1][4]=tds[16].querySelectorAll('input')[0].checked.toString();
//     data[2][4]=forms[13].querySelectorAll('select')[0].value;
//     data[3][4]=forms[14].querySelectorAll('select')[0].value;
//     data[4][4]=forms[15].querySelectorAll('select')[0].value;
//     data[1][5]=tds[20].querySelectorAll('input')[0].checked.toString();
//     data[2][5]=forms[16].querySelectorAll('select')[0].value;
//     data[3][5]=forms[17].querySelectorAll('select')[0].value;
//     data[4][5]=forms[18].querySelectorAll('select')[0].value;