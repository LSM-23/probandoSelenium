import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. CONFIGURACIÓN
export const options = {
    // Usaremos pocos usuarios para que la terminal no se inunde de mensajes
    vus: 3,
    duration: '10s',
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

    // C. Hacemos la petición POST (nota que ahora usamos http.post y pasamos los 3 argumentos)
    const respuesta = http.post(url, datos, parametros);

    // D. Convertimos la respuesta del servidor a un objeto JavaScript para poder leerla
    const respuestaJSON = respuesta.json();

    // E. Validamos la respuesta
    check(respuesta, {
        'el estado es 200': (r) => r.status === 200,
        // httpbin devuelve lo que le enviamos dentro de una propiedad llamada "json"
        'el servidor recibió el usuario correcto': (r) => respuestaJSON.json.usuario === 'estudiante_k6',
    });

    // F. EXTRA: Imprimir la respuesta en consola
    // Usamos esta condición para que solo el Usuario 1 en su primera vuelta imprima el mensaje.
    // Si no, ¡tus 3 usuarios imprimirían esto sin parar durante 10 segundos!
    if (__ITER === 0 && __VU === 1) {
        console.log('\n--- RESPUESTA DEL SERVIDOR ---');
        console.log(respuesta.body);
        console.log('------------------------------\n');
    }

    sleep(1);
}