import { sharedHttpPoint } from '../shared.js';
let API_URL_ADD_RECORD_CLIENTES = sharedHttpPoint + "/quickbase-add-record-clientes-uno";
API_URL_CEDULA_JURIDICA = sharedHttpPoint + "/process-cedula-juridica";

let DIV_TMP = document.getElementById("url-div");

NAME2FIELDS = {"nombre_entidad": 6, "numero_identificacion": 7, "tipo_persona": 11, "correo":10, "numero_telefono":8, "genero": 9, "tipo_cliente":12};

KEY2TEXT = {"nombre_entidad": "Nombre de la entidad", "numero_identificacion": "Numero de identificación", "tipo_persona": "Tipo de persona", "correo":"Correo electrónico", "numero_telefono": "Número de telefono", "genero": "Genero de la entidad", "tipo_cliente": "Tipo de cliente"}
FID2FTEXT = {6: "Nombre de la entidad", 7: "Numero de identificación", 11: "Tipo de persona", 10:"Correo electrónico", 8: "Número de telefono", 9: "Genero de la entidad", 12: "Tipo de cliente", 3:"Record Id"}
function showTemporaryAlert(message, duration) {
    const alertDiv = document.createElement("div");
    alertDiv.innerText = message;
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.backgroundColor = "#f44336";
    alertDiv.style.color = "white";
    alertDiv.style.padding = "10px 20px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.zIndex = "1000";
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}

async function registerToQuickbase() {
    let dataArr = {};
    let fids2Return = [];
    Object.keys(NAME2FIELDS).forEach(k =>{
        tmp_input = document.getElementById(`${k}`);
        if(tmp_input.value == "" || tmp_input.value == undefined || tmp_input.value == null){
            showTemporaryAlert(`You need to provide a value for ${KEY2TEXT[k]}`, 3000);
        }
        tmp_val = tmp_input.value;
        if(k == "numero_identificacion"){
            tmp_val = tmp_val.replaceAll(/\D/g, "");

        }
        dataArr[`${NAME2FIELDS[k]}`] = {"value":`${tmp_val}` };
        fids2Return.push(NAME2FIELDS[k]);
    })    
    try {
        const response = await fetch(API_URL_ADD_RECORD_CLIENTES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                "data": [dataArr],
                "fieldsToReturn": fids2Return}),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Server Error:", error);
            throw new Error(error.message || "Failed to upload to Quickbase via server");
        }

        const r = await response.json();
        const data = r["data"];
        console.log(data);
        document.getElementById("mostrar-registro").innerHTML += Object.keys(data);
        console.log("Success:", data);
        showTemporaryAlert("¡Los datos se subieron exitosamente a Quickbase!", 3000);
        let html_paragraphs = ``
        Object.keys(data).forEach(k => {
            html_paragraphs += `<p>${FID2FTEXT[k]}: ${data[k]["value"]}</p>`;
        });
        document.getElementById("mostrar-registro").innerHTML += html_paragraphs;

    } catch (error) {
        console.error("Error subiendo a Quickbase a través del servidor:", error);
        showTemporaryAlert("Error subiendo a Quickbase a través del servidor.", 3000);
    }    
}





