/**
 * TODO(developer): Uncomment these variables before running the sample.
 */


function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the data URI prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


NAME2FIELDS = {"nombre": 6, "primer_apellido": 8, "segundo_apellido": 9, "numero_cedula": 11, "numero_cedula_dos": 27, 
    "fecha_nacimiento": 12, "fecha_vencimiento":13, "lugar_nacimiento": 31, "nombre_madre": 16, "nombre_padre": 15 , "domicilio_electoral": 14, "imagen": 34};

KEY2TEXT = {"nombre": "el nombre estaba correcto", "primer_apellido": "el 1º apellido estaba correcto", "segundo_apellido": "el 2º apellido estaba correcto", "numero_cedula": "el numéro de cédula estaba correcto", "numero_cedula_dos": "el número de cédula del reverso estaba correcto", 
    "fecha_nacimiento": "la fecha de nacimiento estaba correcta", "fecha_vencimiento": "la fecha de vencimiento estaba correcta", "lugar_nacimiento": "el lugar de nacimiento estaba correcto", "nombre_madre": "el nombre de la madre estaba correcto", "nombre_padre": "el nombre del padre estaba correcto" , "domicilio_electoral": "el domicilio electoral estaba correcto"}

 
TEMPLATE = {"nombre": "NULL", "primer_apellido": "NULL", "segundo_apellido": "NULL", "numero_cedula": "NULL", "numero_cedula_dos": "NULL", 
    "fecha_nacimiento": "NULL", "fecha_vencimiento": "NULL", "lugar_nacimiento": "NULL", "nombre_madre": "NULL", "nombre_padre": "NULL", "domicilio_electoral": "NULL"};


function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}



function toggle_two_img_div() {
    // Clear the existing content of the div
    const two = $("#two-imgs-upload") 

    if(two.html() === ''){
        const newContentImgTwo = `
            <label for="cedula-frente" class="form-label">Frente de Cédula</label>
            <input class="form-control" type="file" id="cedula-frente" accept="image/png,image/jpeg"/>
            <br>
            <label for="cedula-trasera" class="form-label"> Reverso de Cédula</label>
            <input class="form-control" type="file" id="cedula-trasera" accept="image/png, image/jpg, image/jpeg"/>
            <div class="d-grip">
                <button class="submit-img" onclick="validateTwoImages()">
                    Procesar Imagenes
                </button>
            </div>
        `;
        /* <div class="form-row align-items-center">
                <div class="col-auto my-1">
                    <div class="form-group">
                        <label for="">Por favor use la contraseña enviada a su celular o correo eletrónico</label>
                        <input type="password" class="form-control" id="contrasena" value="">
                    </div>
                </div>
            </div>*/
        two.html(newContentImgTwo) 
    }else{
        two.html('')
    }
}



function toggle_one_img_div() {
    // Clear the existing content of the div
    const one = $("#one-img-upload"); 
    if(one.html() === ''){
        const newContentImgOne = `
        <label for="cedula-completa" class="form-label">Cédula Completa</label>
        <input class="form-control" type="file" id="cedula-completa" accept="image/png, image/jpeg"/>
        <div class="d-grip">
            <button class="submit-img" onclick="validateOneImage()">
                Procesar Imagenes
            </button>
        </div>
        `;
        /* <div class="form-row align-items-center">
                <div class="col-auto my-1">
                    <div class="form-group">
                        <label for="">Por favor use la contraseña enviada a su celular o correo eletrónico</label>
                        <input type="password" class="form-control" id="contrasena2" value="">
                    </div>
                </div>
        </div>*/
        one.html(newContentImgOne)
    }else{
        one.html('')
    }
}


const API_URL_IMAGE = "https://f9ee-2803-6000-e007-d7-40c3-bd8b-40ca-f4b4.ngrok-free.app/process-image"; // Python backend endpoint
const API_URL_PASSWORD = "https://f9ee-2803-6000-e007-d7-40c3-bd8b-40ca-f4b4.ngrok-free.app/verify-password";
const API_URL_ADD_RECORD ="https://f9ee-2803-6000-e007-d7-40c3-bd8b-40ca-f4b4.ngrok-free.app/quickbase-add-record";
//DIV_TMP.innerHTML += `<p>${API_URL_IMAGE}</p>`;
//DIV_TMP.innerHTML += `<p>${API_URL_PASSWORD}</p>`;
//DIV_TMP.innerHTML += `<p>${API_URL_ADD_RECORD}</p>`;
async function blobToFile(blob, fileName, mimeType) {
    return new File([blob], fileName, { type: mimeType });
}

async function validateFile(inputId, mimeTypes) {
    const input = document.getElementById(inputId);

    if (!input || input.files.length === 0) {
        showTemporaryAlert(`Por favor, suba un archivo para ${inputId}.`, 3000);
        return null;
    }
    const file = input.files[0];
    if (!mimeTypes.includes(file.type)) {
        showTemporaryAlert(`Por favor, suba un archivo tipo ${mimeTypes.join(", ")}.`, 3000);
        return null;
    }
    return file;
}

async function uploadToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch(API_URL_IMAGE, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            showTemporaryAlert(`Error del servidor: ${error.error}`, 3000);
            return null;
        }
        template = {"nombre": "NULL", "primer_apellido": "NULL", "segundo_apellido": "NULL", "numero_cedula": "NULL", "numero_cedula_dos": "NULL",  "fecha_nacimiento": "NULL", "fecha_vencimiento": "NULL", "lugar_nacimiento": "NULL", "nombre_madre": "NULL", "nombre_padre": "NULL", "domicilio_electoral": "NULL"};
        const result = await response.json();
        result.entities.forEach(entity => {
            if(template.hasOwnProperty(`${entity.key}`)){
                TEMPLATE[`${entity.key}`] = `${entity.value}`;
            }
        });
        console.log("Documento Procesado:", result);
        displayResult(template);
        showForm(template);
        
        FORM_FIELDS = result;
        return result;
    } catch (error) {
        console.error("Error subiendo la imagen", error);
        showTemporaryAlert("Hubo un error procesando la solicitud.", 3000);
        return null;
    }
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

async function validateOneImage(){
    const file = await validateFile("cedula-completa", ["image/jpeg", "image/png"]);
    if (!file) return;
    displayImage(file);
    //let password = document.getElementById("contrasena2");
    const password_bool = true//await passwordCheck(password.value);
    if(password_bool){
        showTemporaryAlert("Procesando la imagen...", 3000);
        const result = await uploadToBackend(file);
        if (result) {
            alert(`Extracted Text: ${result.text}`);
        }
    }else{
        showTemporaryAlert("Contraseña incorrecta...", 3000); 
    }
}

async function validateTwoImages(){
    const fileFrente = await validateFile("cedula-frente", ["image/jpeg", "image/png"]);
    const fileTrasera = await validateFile("cedula-trasera", ["image/jpeg", "image/png"]);

    if (!fileFrente || !fileTrasera) return;

    if (fileFrente.type !== fileTrasera.type) {
        showTemporaryAlert("Ambos archivos deben ser del mismo tipo (PNG o JPEG).", 3000);
        return;
    }

    showTemporaryAlert("Combinando las imágenes...", 3000);
    try {
        const combinedBlob = await pasteImages(fileFrente, fileTrasera);
        const combinedFile = await blobToFile(combinedBlob, "combined_image.png", fileFrente.type);
        displayImage(combinedFile);
        //let password = document.getElementById("contrasena");
        //console.log(password.innerText)
        const password_bool = true//await passwordCheck(password.value);
        if(password_bool){
            showTemporaryAlert("Procesando la imagen combinada...", 3000);
            
            const result = await uploadToBackend(combinedFile);
            if (result) {
                alert(`Extracted Text: ${result.text}`);
            }
        }else{
            showTemporaryAlert("Contraseña incorrecta...", 3000); 
        }
    } catch (error) {
        console.error("Error combinando imágenes:", error);
        showTemporaryAlert("Error combinando las imágenes.", 3000);
    }
}

// Helper function to show temporary alerts
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

// Helper function to combine two images vertically
async function pasteImages(fileFrente, fileTrasera) {
    return new Promise((resolve, reject) => {
        const imgFrente = new Image();
        const imgTrasera = new Image();

        imgFrente.onload = () => {
            imgTrasera.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const width = Math.max(imgFrente.width, imgTrasera.width);
                const height = Math.max(imgFrente.height,imgTrasera.height);
                canvas.width = width;
                canvas.height = 2 * height;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, width, 2 * height);

                ctx.drawImage(imgFrente, 0, 0, width, height);
                ctx.drawImage(imgTrasera, 0, height, width, height);

                canvas.toBlob(resolve, fileFrente.type);
            };
            const reader = new FileReader();
            reader.onload = () => (imgTrasera.src = reader.result);
            reader.readAsDataURL(fileTrasera);
        };

        const reader = new FileReader();
        reader.onload = () => (imgFrente.src = reader.result);
        reader.readAsDataURL(fileFrente);
    });
}

function showForm(dict){
            
    const output = document.getElementById("form-div");
    output.innerHTML = `<h2>Texto Extraido:</h2><p>${dict.text}</p><p>${dict}</p>`;

    if (dict.entities) {
        output.innerHTML += `<h2>Pares de Llave-Valor por Verificar:</h2><form>`;
        dict.entities.forEach(entity => {
            output.innerHTML += `<div class="form-row align-items-center">
                                    <div class="col-auto my-1">
                                        <div class="form-group">
                                            <label for="">Verifique ${entity.key}</label>
                                            <input type="text" class="form-control" id="${entity.key}_new" value="${entity.value}">
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
    if (!result || !result.entities) {
        showTemporaryAlert("No data available to upload.", 3000);
        return;
    }

    
    // Construct the XML payload
    let datArr = {};
    let fids2Return = [];
    let nombre_dic = {};
    let sent_text = ``
    // Add extracted entities
    result.entities.forEach(entity => {
        let fieldId = NAME2FIELDS[entity.key];
        if (fieldId) {
            let tmp = document.getElementById(`${entity.key}_new`);
            datArr[`${fieldId}`] = {"value":`${tmp.value}`} 
            if(entity.key == "nombre" || entity.key == "primer_apellido" || entity.key == "segundo_apellido"|| entity.key == "numero_cedula"){
                nombre_dic[entity.key] = tmp.value;
    
            }
            fids2Return.push(fieldId)
            sent_text += `<p>${entity.key}: ${tmp.value}</p>`
        }
    });
    sentDiv.innerHTML = sent_text;
    base64Img = `` + document.getElementById("display-img").alt
    
    try {
        const response = await fetch(API_URL_ADD_RECORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                "base64Image": base64Img, 
                "imageNameDictionary": nombre_dic,
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
    }

    
}


async function displayImage(file) {
    base64= await imageToBase64(file); // Store Base64 string for later use
    const reader = new FileReader();
    reader.onload = function (e) {
        const imgContainer = document.getElementById("image-display-div");
        imgContainer.innerHTML = ""; // Clear previous image
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "" + base64;
        img.style.maxWidth = "100%";
        img.style.border = "1px solid #ddd";
        img.style.borderRadius = "5px";
        img.style.marginBottom = "10px";
        img.id = "display-img";
        imgContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
}

