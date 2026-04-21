import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. CONFIGURACIÓN
export const options = {
    // Usaremos 5 usuarios durante 15 segundos para esta prueba rápida
    vus: 2,
    duration: '10s',
};

// 2. FUNCIÓN PRINCIPAL
export default function () {
    const url = 'https://httpbin.org/bearer';
    
    // Este es nuestro token de prueba. 
    // En tu sistema real, aquí iría tu token JWT o tu API Key.
    const token = 'Listo';

    // Configuramos los parámetros de la petición, incluyendo las cabeceras (headers)
    const parametros = {
        headers: {
            // El formato "Bearer <token>" es el estándar más común en la industria
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    // Hacemos la petición GET, pasando la URL y los parámetros con el token
    const respuesta = http.get(url, parametros);

    // Validamos que el servidor nos haya dejado entrar
    check(respuesta, {
        // Un 200 significa "OK, puedes pasar"
        'el estado es 200': (r) => r.status === 200,
        // Un 401 significaría "No autorizado" (puedes probar rompiendo el token a propósito para ver este error)
    });

    if (__ITER === 0 && __VU === 1) {
        console.log('\n--- RESPUESTA DEL SERVIDOR ---');
        console.log(respuesta.body);
        console.log('------------------------------\n');
    }

    sleep(1);
}