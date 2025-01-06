const API_URL_PASSWORD = " http://192.168.0.10:8080/verify-password";
const API_URL_EDIT_RECORD = " http://192.168.0.10:8080/quickbase-edit-record";
const API_URL_QUERY_RECORD = " http://192.168.0.10:8080/quickbase-query-records";
//const API_URL_DELETE_RECORD = "http://192.168.0.6:8080/quickbase-delete-record";
const API_GET_CEDULA_DICTIONARIES = " http://192.168.0.10:8080/qbget-cedula-table-dictionaries";
let RECORD_ID = null;
async function get_cedula_dictionaries(){
    try{
        const response = await fetch(API_GET_CEDULA_DICTIONARIES, {
            method: "GET",
            headers: {
                "Content-Type": "application/json", // Specify JSON format
            }, // Convert the object to a JSON string
        });

        if (!response.ok) {
            const error = await response.json();
            showTemporaryAlert(`Error del servidor: ${error.error}`, 3000);
            return null;
        }

        const result = await response.json();
        console.log(result)
        return result; // Ensure boolean comparison
    } catch (error) {
        console.error("Error procesando el texto", error);
        showTemporaryAlert("Hubo un error procesando la solicitud.", 3000);
        return null;
    }

}
async function initializeDictionaries() {
    const dictionaries = await get_cedula_dictionaries();
    if (dictionaries) {
        LABEL_2_FID = dictionaries.label_2_fid;
        FID_2_LABEL = dictionaries.fid_2_label;
    }
}
initializeDictionaries();
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

async function passwordCheck(password) {
    if (!password || password.length < 8) {
        showTemporaryAlert("La contraseña debe tener al menos 8 caracteres.", 3000);
        return false;
    }

    try {
        const response = await fetch(API_URL_PASSWORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify JSON format
            },
            body: JSON.stringify({ password }), // Convert the object to a JSON string
        });

        if (!response.ok) {
            const error = await response.json();
            showTemporaryAlert(`Error del servidor: ${error.error}`, 3000);
            return null;
        }

        const result = await response.json();
        return result.value === "true"; // Ensure boolean comparison
    } catch (error) {
        console.error("Error procesando el texto", error);
        showTemporaryAlert("Hubo un error procesando la solicitud.", 3000);
        return null;
    }
}
async function queryQuickbase(){
    
    password = document.getElementById("password-search").value;
    let verified = await passwordCheck(password);
    if(verified){
        numero_cedula = document.getElementById("search-numero-cedula").value;
        nombre = document.getElementById("search-nombre-cedula").value;
        primer_apellido =  document.getElementById("search-primer-apellido-cedula").value;
        segundo_apellido =  document.getElementById("search-segundo-apellido-cedula").value;
        if( numero_cedula == "" || nombre == "" || primer_apellido == "" || segundo_apellido == ""){
            showTemporaryAlert("Escriba todos los campos", 3000);  
        }else{
            dataJson = {"data": {"numero_cedula": numero_cedula, "nombre": nombre, "primer_apellido": primer_apellido, "segundo_apellido": segundo_apellido}}
            try {
                const response = await fetch(API_URL_QUERY_RECORD, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataJson)
                });
        
                if (!response.ok) {
                    const error = await response.json();
                    console.error("Server Error:", error);
                    throw new Error(error.message || "Failed to upload to Quickbase via server");
                }
        
                const divData = await response.json();
                kv_pairs = divData["data"][0];
                text = `<h1>Pares de LLave-Valor Actuales</h1>`; 
                form_text = `<h1>Valores para editar</h1><form id="edit_form">`;
                kv_pairs.entities.forEach(e => {
                    text += `<p>ID: ${e.key}; Etiqueta: ${FID_2_LABEL[e.key]}; Valor: ${e.value}</p>`
                    if(FID_2_LABEL[e.key] != record_id || FID_2_LABEL[e.key] != "date_created" ){
                        form_text += `<div class="form-row align-items-center">
                                        <div class="col-auto my-1">
                                            <div class="form-group">
                                                <label for="">Edite ${FID_2_LABEL[e.key]} si es necesario</label>
                                                <input type="text" class="form-control" id="${FID_2_LABEL[e.key]}" value="${e.value}">
                                            </div>
                                        </div>
                                    </div>`
                    }else{
                        if(FID_2_LABEL[e.key] == record_id ){
                            RECORD_ID = [e.key, {"value": e.value}]
                        }
                    }
                });
                form_text += `</form>
                            <div class="btn-group d-grip">
                                <button id="update-record" class="btn-group" onclick="uploadUpdateToQuickbase()">
                                    Subir a Quickbase
                                </button>
                            </div>`

                document.getElementById("editar").innerHTML = form_text;
                console.log("Success:", data);
                showTemporaryAlert("¡Los datos se obtuvieron exitosamente a Quickbase!", 3000);
            } catch (error) {
                console.error("Error subiendo a Quickbase a través del servidor:", error);
                showTemporaryAlert("Error subiendo a Quickbase a través del servidor.", 3000);
                
            }
        }

    }else{
        showTemporaryAlert("Contraseña incorrecta...", 3000); 
    }
}

async function uploadUpdateToQuickbase() {
    sentDiv =document.getElementById("result-display"); 
    let buttonVar = document.getElementById("update-record");
    buttonVar.disabled = true;
    buttonVar.hidden = true;

    formElements = document.getElementById("edit-form").elements;
    
    // Construct the XML payload
    let datArr = {"3":RECORD_ID[1]};
    let fids2Return = [3];
    let sent_text = `${RECORD_ID[0]}: ${RECORD_ID[1]["value"]}`;
    // Add extracted entities
    Object.values(formElements).forEach(entity => {
        let fieldId = LABEL_2_FID[entity.id];
        if (fieldId) {
            
            datArr[`${fieldId}`] = {"value":`${entity.value}`} 
            fids2Return.push(fieldId)
            sent_text += `<p>${entity.id}: ${entity.value}</p>`
        }
    });
    sentDiv.innerHTML = sent_text;
    
    
    try {
        const response = await fetch(API_URL_EDIT_RECORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                "data": [datArr],
                "fieldsToReturn": fids2Return}),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Server Error:", error);
            throw new Error(error.message || "Failed to upload to Quickbase via server");
        }

        const data = await response.json();
        console.log("Success:", data);
        showTemporaryAlert("¡Los datos se subieron exitosamente a Quickbase!", 3000);
    } catch (error) {
        console.error("Error subiendo a Quickbase a través del servidor:", error);
        showTemporaryAlert("Error subiendo a Quickbase a través del servidor.", 3000);
        buttonVar.disabled=false;
        buttonVar.hidden = false;
    }

    
}


