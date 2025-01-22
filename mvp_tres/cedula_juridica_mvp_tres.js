API_PROCESAR_CEDULA_JURIDICA = "https://dc48-2803-6000-e007-d7-49b7-2ffd-6c59-d136.ngrok-free.app/procesar-cedula-juridica";
API_ADD_QUICKBASE_JURIDICA = "https://dc48-2803-6000-e007-d7-49b7-2ffd-6c59-d136.ngrok-free.app/upload-cedula-juridica-files";
NAME2FIELDS= {"razon_social_o_denominacion": 17, "domicilio": 15, "estado_actual": 14, "persona_juridica": 13};
FORM_FIELDS = null;
BASE64PDF = null;
function convertPDFToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(",")[1]; // Remove metadata prefix
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file); // Read file as Data URL
    });
}
//mostrar resultado
function displayResult(result) {
    const output = document.getElementById("key-value-pairs-div");
    if (result.entities) {
        output.innerHTML += `<h2>Pares de Llave-Valor:</h2><ul class="list-group list-group-flush">`;
        result.entities.forEach(entity => {
            output.innerHTML += `<li class="list-group-item"><strong>${entity.key}:</strong> ${entity.value} (Confidence: ${entity.confidence})</li>`;
        });
        output.innerHTML += "</ul>";
    } else {
        output.innerHTML += "<p>No se encontro el dato</p>";
    }
    
}
// Usage Example:
async function procesarCedulaJuridica(){
    const fileInput = document.getElementById("cedula-juridica");
    const file = fileInput.files[0];
    console.log(file.type);
    if (file && file.type === "application/pdf") {
        try {
            //const base64StringPDf = await convertPDFToBase64(file);
            const result = await uploadToBackend(file);
        } 
        catch (error) {
            showTemporaryAlert(`Error: ${error}`, 4000);
        }
    } else {
        showTemporaryAlert("Por favor suba un pdf valido", 4000);
    }
};

async function uploadToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch(API_PROCESAR_CEDULA_JURIDICA, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            showTemporaryAlert(`Error del servidor: ${error.error}`, 3000);
            return null;
        }
        template = {"razon_social_o_denominacion": "NULL", "domicilio": "NULL", "estado_actual": "NULL", "persona_juridica": "NULL"};
        const result = await response.json();
        alert(`Texto Extraido: ${result.text}`)
        result.entities.forEach(entity => {
            if(Object.keys(template).indexOf(`${entity.key}`) > -1){
                template[`${entity.key}`] = `${entity.value}`;
            }
        });
        console.log("Documento Procesado:", result);
        displayResult(result);
        showForm(template);
        
        FORM_FIELDS = template;
        return result.entities;
    } catch (error) {
        console.error("Error extrayendo texto del pdf", error);
        showTemporaryAlert("Hubo un error procesando la solicitud.", 3000);
        return null;
    }
}

async function sendbase64(base64String){
    try{
        const response = await fetch(API_PROCESS_CEDULA_JURIDICA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },body: JSON.stringify({ content: base64String }),
        });
        if (!response.ok) {
            const error = await response.json();
            showTemporaryAlert(`Error del servidor: ${error.error}`, 3000);
            return null;
        }
        return response.json();

    }
    catch(error){
        console.error("Error subiendo el PDF en Base64", error);
        showTemporaryAlert("Hubo un error procesando la solicitud.", 3000);
        return null;

    }

}

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

function showForm(dict){
            
    const output = document.getElementById("form-div");
    output.innerHTML = `<h2>Texto Extraido:</h2><p>${dict.text}</p><p>${dict}</p>`;

    if (Object.keys(dict)) {
        output.innerHTML += `<h2>Pares de Llave-Valor por Verificar:</h2><form>`;
        Object.keys(dict).forEach(k => {
            output.innerHTML += `<div class="form-row align-items-center">
                                    <div class="col-auto my-1">
                                        <div class="form-group">
                                            <label for="">Verifique ${k}</label>
                                            <input type="text" class="form-control" id="${k}_new" value="${dict[k]}" onkeyup="this.value = this.value.toUpperCase();">
                                        </div>
                                    </div>
                                </div>`;
        });
        output.innerHTML += "</form>";
        output.innerHTML += `<div class="btn-group d-grip">
                            <button id="subir-form-uno" class="btn-group" onclick="uploadToQuickbase()">
                                Subir a Quickbase
                            </button>
                            </div>`
    } else {
        output.innerHTML += "<p>No hay pares de LLave-Valor.</p>";
    }
}



async function uploadToQuickbase() {
    let buttonVar = document.getElementById("subir-form-uno");
    buttonVar.disabled = true;
    buttonVar.hidden = true;

    sentDiv = document.getElementById("sent-values")
    result = FORM_FIELDS 
    if (!result || Object.keys(result).length == 0) {
        showTemporaryAlert("No data available to upload.", 3000);
        return;
    }

    
    // Construct the XML payload
    let datArr = {};
    let fids2Return = [];
    let sent_text = ``
    // Add extracted entities
    Object.keys(result).forEach(k => {
        let fieldId = NAME2FIELDS[k];
        if (fieldId) {
            let tmp = document.getElementById(`${k}_new`);
            datArr[`${fieldId}`] = {"value":`${tmp.value}`} 
            fids2Return.push(fieldId)
            sent_text += `<p>${k}: ${tmp.value}</p>`
        }
    });
    sentDiv.innerHTML = sent_text;
    //const fileInput = document.getElementById("cedula-juridica");
    //const file = fileInput.files[0];
    //base64PDF = await convertPDFToBase64(file); 
    
    try {
        const response = await fetch(API_URL_ADD_JURIDICA_RECORD, {
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
        showTemporaryAlert("¡Los datos de la cedula juridica se subieron exitosamente a Quickbase!", 3000);
    } catch (error) {
        console.error("Error subiendo a Quickbase a través del servidor:", error);
        showTemporaryAlert("Error subiendo a Quickbase a través del servidor.", 3000);
    }

    
}
