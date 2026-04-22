import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. CONFIGURACIÓN
export const options = {
    // Usaremos pocos usuarios para que la terminal no se inunde de mensajes
    vus: 3,
    duration: '30s',
};

// 2. FUNCIÓN PRINCIPAL
export default function () {
    const url = 'https://httpbin.org/post';
    const token = 'mi_token_secreto_123';

    // A. Los datos que queremos enviar (el "cuerpo" o "payload" de la petición)
    const datos = JSON.stringify({
        usuario: 'estudiante_k6',
        accion: 'crear_reporte'
    });

    // B. Las cabeceras (headers), indispensables para el token y para decir que enviamos un JSON
    const parametros = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    // C. Hacemos la petición POST 
    const respuesta = http.post(url, datos, parametros);

    // D. Convertimos la respuesta del servidor a un objeto JavaScript para poder leerla
    const respuestaJSON = respuesta.json();

    // E. Validamos la respuesta
    check(respuesta, {
        'el estado es 200': (r) => r.status === 200,
        'el servidor recibió el usuario correcto': (r) => respuestaJSON.json.usuario === 'estudiante_k6',
    });

    // =========================================================
    // F. BLOQUE PARA EL EQUIPO DE QA (Historial detallado)
    // =========================================================
    
    // Empaquetamos la información clave de esta iteración en un objeto
    const registroQA = {
        usuario_virtual: __VU,
        iteracion: __ITER,
        estado: respuesta.status,
        // Guardamos directamente los datos que httpbin nos confirma que recibió
        datos_confirmados: respuestaJSON.json 
    };

    // Imprimimos el objeto en formato JSON con espaciado (el '2' da formato legible)
    console.info(JSON.stringify(registroQA, null, 2));

    // =========================================================

    sleep(1);
}