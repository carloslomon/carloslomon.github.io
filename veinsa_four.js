const API_URL_CEDULA =  "http://34.68.136.153:8888//procesar-cedula"; // Python backend endpoint
const API_URL_JURIDICA =  "http://34.68.136.153:8888//procesar-cedula-juridica";
const API_URL_SUGEF =  "http://34.68.136.153:8888//procesar-documento-sugef";
const API_URL_ADD_RECORD = "http://34.68.136.153:8888//subir-quickbase";

/*async function validateFile(inputId, mimeTypes) {
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

function showTemporaryAlert(message, duration,color) {
    const alertDiv = document.createElement("div");
    alertDiv.innerText = message;
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "30px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.backgroundColor = color;
    alertDiv.style.color = "white";
    alertDiv.style.padding = "10px 20px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.zIndex = "1000";
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}
/*async function procesarCedula(){

    const cedula_input = document.getElementById("cedula-completa");
    if(!cedula_input || cedula_input.files.length===0){
        showTemporaryAlert("El documento para la cedula/dimex no se ha subido Intente otra vez", 3000, "#ff0000");
        return ;
    }
    else{
        cedula_file = cedula_input.files[0];
        if(cedula_file.type != "application/pdf" && cedula_file.type != "image/jpeg" && cedula_file.type != "image/png" ){
            showTemporaryAlert("El documento para la cedula/dimex debe ser tipo pdf, png, o jpg", 3000, "#ff0000");
            return ;
        }
        let response_cedula = null;
        const formDataCedula = new FormData();
        formDataCedula.append("file", cedula_file);
        try{
            response_cedula = await fetch(API_URL_CEDULA, {
                method:"POST",
                body: formDataCedula
            });

            if(!response_cedula.ok){
                const error = await response_cedula.json();
                showTemporaryAlert(`Error del servidor procesando cedula: ${error.error}`, 3000, "#ff0000");
            }
            
            showTemporaryAlert(`Se proces la cedula: ${response_cedula.text}`, 3000, "#00dd00");
            return response_cedula;

        }
        catch(error){
            showTemporaryAlert(`Error del servidor procesando cedula: ${error.error}`, 3000, "#ff0000");
        }
        
        
    }

}

async function procesarCedulaJuridica(){
    const juridica_input = document.getElementById("cedula-juridica");
    if(!juridica_input || juridica_input.files.length===0){
        showTemporaryAlert("El documento para el campo de la personeria/cedula juridica no se ha subido Intente otra vez", 3000, "#ff0000");
        return ;
    }
    else{
        juridica_file = juridica_input.files[0];
        if(juridica_file.type != "application/pdf"){
            showTemporaryAlert("El documento de la cédula Jurídica debe ser tipo pdf, png, o jpg", 3000, "#ff0000");
            return ;
        }
        let response_juridica = null;
        const formDataJuridica = new FormData();
        formDataJuridica.append("file", juridica_file);
        try{
            response_juridica = await fetch(API_URL_JURIDICA, {
                method:"POST",
                body: formDataJuridica
            });

            if(!response_juridica.ok){
                const error = await response_juridica.json();
                showTemporaryAlert(`Error del servidor procesando cedula: ${error.error}`, 3000, "#ff0000");
            }
            
            showTemporaryAlert(`Se proceso la cedula juridica: ${response_juridica.text}`, 3000, "#00dd00");
            return response_juridica

        }
        catch(error){
            showTemporaryAlert(`Error del servidor procesando la cedula juridica: ${error.error}`, 3000, "#ff0000");
        }        
    } 
}
async function procesarDocumentoSugef(){
    const sugef_input = document.getElementById("documento-sugef");
    if(!sugef_input || sugef_input.files.length===0){
        showTemporaryAlert("El documento para el campo de la personeria/cedula juridica no se ha subido Intente otra vez", 3000, "#ff0000");
        return ;
    }
    else{
        sugef_file = sugef_input.files[0];
        if(sugef_file.type != "application/pdf"){
            showTemporaryAlert("El documento de la SUGEF debe ser tipo pdf", 3000, "#ff0000");
            return ;
        }
        let response_sugef = null;
        const formDataSugef = new FormData();
        formDataSugef.append("file", sugef_file);
        try{
            response_sugef = await fetch(API_URL_SUGEF, {
                method:"POST",
                body: formDataSugef
            });

            if(!response_sugef.ok){
                const error = await response_sugef.json();
                showTemporaryAlert(`Error del servidor procesando documento de la SUGEF: ${error.error}`, 3000, "#ff0000");
            }
            
            showTemporaryAlert(`Se proceso el documento de la SUGEF: ${response_sugef.text}`, 3000, "#00dd00");
            return response_sugef

        }
        catch(error){
            showTemporaryAlert(`Error del servidor procesando el documento de la SUGEF: ${error.error}`, 3000, "#ff0000");
        }        
    } 
}

async function procesarTodo(){
    //let components = ["cedula-completa", "cedula-juridica", "documento-sugef"];
    template = {"domicilio": "N/A", "objeto_fines": "N/A", "razon_social_o_denominacion":"N/A","estado_actual": "N/A", "numero_persona_juridica": "N/A", "fecha_legalizacion": "N/A", 
        "fecha_nacimiento": "N/A", "vencimiento": "N/A", "apellidos": "N/A", "numero_id": "N/A",
        "cedula_juridica_entidad_tramita": "N/A", "fecha": "N/A", "nombre_entidad_tramita": "N/A", "nombre_firma": "N/A",
         "numero_identificacion_firma": "N/A",  "numero_identificacion_firma": "N/A", "usuario_autorizado_nombre_apellido": "N/A", 
         "usuario_autorizado_numero_identificacion": "N/A"
    }

    
    NAME2FID = {"domicilio": 23, "objeto_fines": 24, "razon_social_o_denominacion": 8,"estado_actual": 25, "numero_persona_juridica": 11, "fecha_legalizacion": 26, 
        "fecha_nacimiento": 27, "vencimiento": 28, "apellidos": 9, "numero_id": 10,
        "cedula_juridica_entidad_tramita": 21, "fecha": 14, "nombre_entidad_tramita": 18, "nombre_firma": 19,
         "numero_identificacion_firma": 20,  "usuario_autorizado_nombre_apellido": 16, 
         "usuario_autorizado_numero_identificacion": 17
    }
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  
    [cedula, juridica, sugef] = await Promise.all([
        procesarCedula(),
        procesarCedulaJuridica(),
        procesarDocumentoSugef()]);

    if (!cedula || !juridica || !sugef) {
        showTemporaryAlert("Uno o más documentos fallaron. Revise los errores y reintente.", 3000, "#ff0000");
        return;
    }
    cedulaResponse = await cedula.json()    
    juridicaResponse = await juridica.json();
    sugefResponse = await sugef.json()

        
    showTemporaryAlert(`Se proceso la cedula: ${cedulaResponse.text}`, 3000, "#00dd00");
    showTemporaryAlert(`Se proceso la cedula juridica: ${juridicaResponse.text}`, 3000, "#00dd00");
    showTemporaryAlert(`Se proceso el documento SUGEF: ${sugefResponse.text}`, 3000, "#00dd00");
    let primer_apellido = "";
    let segundo_apellido = "";
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  

    cedulaResponse.entities.forEach((e) => {
        if(e.key != "primer_apellido" && e.ey != "segundo_apellido"){
            if(Object.keys(template).indexOf(e.key)> -1){
                template[e.key] = e.value;

            }
        }
        else if(e.key == "primer_apellido"){
            primer_apellido = e.value
        }
        else if(e.key == "segundo_apellido"){
            segundo_apellido = e.value
        }
    })
    template["apellido"] = `${primer_apellido} ${segundo_apellido}`;
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  

    juridicaResponse.entities.forEach((e) => {
        if(Object.keys(template).indexOf(e.key)> -1 && e.value != "" && e.value != null && e.value != undefined){
            template[e.key] = e.value;

        }
        
    });
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  

    sugefResponse.entities.forEach((e) => {
        
        if(Object.keys(template).indexOf(e.key)> -1){
            template[e.key] = e.value;

        }
        
    });
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  
    let dataArr = {}
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  

    Object.keys(template).forEach(k =>{
        dataArr[NAME2FID[k]] = template[k];
    })

    try {
        const response = await fetch(API_URL_ADD_RECORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                "data": [dataArr]}),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Server Error:", error);
            throw new Error(error.message || "Fallo subiendo a Quickbase via servidor");
        }

        const data = await response.json();
        console.log("Success:", data);
        showTemporaryAlert("¡Los datos se subieron exitosamente a Quickbase!", 3000);
    } catch (error) {
        console.error("Error subiendo a Quickbase a través del servidor:", error);
        showTemporaryAlert("Error subiendo a Quickbase a través del servidor.", 3000, "#ff0000");
    }   
        
    /*let primer_apellido = "";
    let segundo_apellido = "";
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  

    cedula.entities.forEach((e) => {
        if(e.key != "primer_apellido" && e.ey != "segundo_apellido"){
            if(Object.keys(template).indexOf(e.key)> -1){
                template[e.key] = e.value;

            }
        }
        else if(e.key == "primer_apellido"){
            primer_apellido = e.value
        }
        else if(e.key == "segundo_apellido"){
            segundo_apellido = e.value
        }
    })
    template["apellido"] = `${primer_apellido} ${segundo_apellido}`;
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  


    juridica.entities.forEach((e) => {
        
        if(Object.keys(template).indexOf(e.key)> -1){
            template[e.key] = e.value;

        }
        
    });
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  

    sugef.entities.forEach((e) => {
        
        if(Object.keys(template).indexOf(e.key)> -1){
            template[e.key] = e.value;

        }
        
    });
    showTemporaryAlert("Espere sus documentos están siendo procesados", 2000, "#00dd00");  
    let dataArr = {}

    Object.keys(template).forEach(k =>{
        dataArr[NAME2FID] = template[k];
    })

    try {
        const response = await fetch(API_URL_ADD_RECORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                "data": [datArr]}),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Server Error:", error);
            throw new Error(error.message || "Fallo subiendo a Quickbase via servidor");
        }

        const data = await response.json();
        console.log("Success:", data);
        showTemporaryAlert("¡Los datos se subieron exitosamente a Quickbase!", 3000);
    } catch (error) {
        console.error("Error subiendo a Quickbase a través del servidor:", error);
        showTemporaryAlert("Error subiendo a Quickbase a través del servidor.", 3000, "#ff0000");
    }   
    
}*/


function showTemporaryAlert(message, duration, color) {
    const alertDiv = document.createElement("div");
    alertDiv.innerText = message;
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "30px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.backgroundColor = color;
    alertDiv.style.color = "white";
    alertDiv.style.padding = "10px 20px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.zIndex = "1000";
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}

async function uploadFile(apiUrl, file) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch(apiUrl, { method: "POST", body: formData });
        const responseData = await response.json();

        if (!response.ok) {
            showTemporaryAlert(`Error del servidor: ${responseData.error}`, 3000, "#ff0000");
            return null;
        }

        showTemporaryAlert(`Archivo procesado correctamente`, 3000, "#00dd00");
        return responseData;
    } catch (error) {
        showTemporaryAlert(`Error del servidor: ${error.message}`, 3000, "#ff0000");
        return null;
    }
}

async function procesarCedula() {
    const cedulaFile = document.getElementById("cedula-completa").files[0];
    if (!cedulaFile) {
        showTemporaryAlert("Suba un archivo de cédula.", 3000, "#ff0000");
        return null;
    }
    return await uploadFile(API_URL_CEDULA, cedulaFile);
}

async function procesarCedulaJuridica() {
    const juridicaFile = document.getElementById("cedula-juridica").files[0];
    if (!juridicaFile) {
        showTemporaryAlert("Suba un archivo de cédula jurídica.", 3000, "#ff0000");
        return null;
    }
    return await uploadFile(API_URL_JURIDICA, juridicaFile);
}

async function procesarDocumentoSugef() {
    const sugefFile = document.getElementById("documento-sugef").files[0];
    if (!sugefFile) {
        showTemporaryAlert("Suba un archivo SUGEF.", 3000, "#ff0000");
        return null;
    }
    return await uploadFile(API_URL_SUGEF, sugefFile);
}

async function procesarTodo() {
    showTemporaryAlert("Procesando documentos, espere...", 3000, "#00dd00");

    const [cedula, juridica, sugef] = await Promise.all([
        procesarCedula(),
        procesarCedulaJuridica(),
        procesarDocumentoSugef()
    ]);

    if (!cedula || !juridica || !sugef) {
        showTemporaryAlert("Uno o más documentos fallaron. Revise los errores y reintente.", 3000, "#ff0000");
        return;
    }

    let template = {
        "domicilio": "N/A", "objeto_fines": "N/A", "razon_social_o_denominacion": "N/A",
        "estado_actual": "N/A", "numero_persona_juridica": "N/A", "fecha_legalizacion": "N/A",
        "fecha_nacimiento": "N/A", "vencimiento": "N/A", "apellidos": "N/A", "numero_id": "N/A",
        "cedula_juridica_entidad_tramita": "N/A", "fecha": "N/A", "nombre_entidad_tramita": "N/A",
        "nombre_firma": "N/A", "numero_identificacion_firma": "N/A",
        "usuario_autorizado_nombre_apellido": "N/A", "usuario_autorizado_numero_identificacion": "N/A"
    };

    let NAME2FID = {
        "domicilio": 23, "objeto_fines": 24, "razon_social_o_denominacion": 8,
        "estado_actual": 25, "numero_persona_juridica": 11, "fecha_legalizacion": 26,
        "fecha_nacimiento": 27, "vencimiento": 28, "apellidos": 9, "numero_id": 10,
        "cedula_juridica_entidad_tramita": 21, "fecha": 14, "nombre_entidad_tramita": 18,
        "nombre_firma": 19, "numero_identificacion_firma": 20,
        "usuario_autorizado_nombre_apellido": 16, "usuario_autorizado_numero_identificacion": 17
    };
    let primer_apellido = "";
    let segundo_apellido = "";

    [...cedula.entities, ...juridica.entities, ...sugef.entities].forEach(e => {
        if (Object.keys(template).includes(e.key) && e.value) {
            template[e.key] = e.value;
        }
        if(e.key == "primer_apellido"){
            primer_apellido = e.value
        }
        if(e.key == "segundo_apellido"){
            segundo_apellido = e.value
        }
    });

    let apellidosTmp = primer_apellido + " " + segundo_apellido;
    if(apellidosTmp != " "){
        template["apellidos"] = apellidosTmp
    }

    let dataArr = {};
    Object.keys(template).forEach(k => {
        if (!template[k] || template[k] === "null" || template[k] === "") {
            console.warn(`Missing value for ${k}, setting to 'N/A'`);
            template[k] = "N/A";
        }
        dataArr[`${NAME2FID[k]}`] = {"value" : `${template[k]}`};
    });

    try {
        const response = await fetch(API_URL_ADD_RECORD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "data": [dataArr] }),
        });

        const data = await response.json();
        showTemporaryAlert("¡Datos subidos a QuickBase!", 3000, "#00dd00");

    } catch (error) {
        showTemporaryAlert("Error subiendo a QuickBase.", 3000, "#ff0000");
    }
}
