console.log('Hola mundo');

const lblOnline = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar = document.querySelector('#btnEnviar');

const socketClient = io();

socketClient.on('connect', () => {
    console.log('Conectado');
    lblOffline.style.display = 'none';
    lblOnline.style.display = '';
});

socketClient.on('disconnect', () => {
    console.log('Desconectado');
    lblOffline.style.display = '';
    lblOnline.style.display = 'none';
});

socketClient.on('res-ser', (resp)=> {
    //console.log('Servidor Respondio : ', resp);
    addRow(resp);  
});

socketClient.on('res-noti', (resp)=> {
    console.log('Servidor Respondio noti: ', resp);
    window.alert("Cliente: " + resp.client+" Mensaje: " + resp.data);  
});

btnEnviar.addEventListener('click', () => {
    const mensaje = txtMensaje.value;

    const payload = {
        data: mensaje,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString()
    };

    socketClient.emit('enviar-mensaje', payload, (id)=> {
        //console.log('Callback Server: ', id);        
        payload.client = socketClient.id;
        addRow(payload);  
    });
});

function addRow(data){
    var table = document.querySelector('#tableClients');

    var newRow = table.insertRow(table.rows.length/2+1);
                  
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    var cel3 = newRow.insertCell(2);
    var cel4 = newRow.insertCell(3);

    cel1.innerHTML = data.client;
    cel2.innerHTML = data.fecha + " " + data.hora;
    cel3.innerHTML = data.data; 
    cel4.innerHTML = '<input id="button" type="button" value="Eliminar" class="btn-danger" onclick="deleteRow(this)"/>';
}

function deleteRow(o) {
    var trs = o.parentNode.parentNode.getElementsByTagName('td');

    var payloadData = []
    for (let td of trs) {
        payloadData.push(td.innerHTML.toString());
    }

    const payload = {
        client: payloadData[0],
        fecha: payloadData[1],
        data: payloadData[2]
    };    
    
    var p=o.parentNode.parentNode;
        p.parentNode.removeChild(p);

    socketClient.emit('enviar-notificacion', payload, (id)=> {    
        window.alert("Se elimino el mensaje con la siguiente informacion: " + payload.data);     
    });
}