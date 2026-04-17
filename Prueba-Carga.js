// Importamos los módulos necesarios de k6
// 'http' nos permite hacer las peticiones a la web o API
import http from 'k6/http';
// 'check' nos sirve para validar que la respuesta sea correcta (ej. que devuelva un status 200)
import { check } from 'k6';
// 'sleep' pausa la ejecución para simular el tiempo que un usuario real tarda en leer la página
import { sleep } from 'k6';

// 1. CONFIGURACIÓN (Opciones de la prueba)
export const options = {
    // vus = Virtual Users (Usuarios Virtuales). 
    // Aquí simularemos 10 usuarios conectados al mismo tiempo.
    vus: 10,
    
    // duration = Cuánto tiempo durará la prueba. 
    // En este caso, la prueba se ejecutará durante 30 segundos.
    duration: '30s',
};

// 2. FUNCIÓN PRINCIPAL (El comportamiento del usuario)
// Esta función principal se ejecutará repetidamente por cada usuario virtual
export default function () {
    // Definimos la URL que vamos a probar. 
    // Usamos una API pública de prueba diseñada específicamente para esto.
    const url = 'https://test.k6.io';

    // Hacemos una petición GET a la URL
    const respuesta = http.get(url);

    // Verificamos que la petición haya sido exitosa
    // Comprobamos si el estado HTTP de la respuesta es 200 (OK)
    check(respuesta, {
        'el estado es 200': (r) => r.status === 200,
    });

    // Hacemos que el usuario virtual espere 1 segundo antes de volver a intentar
    // Esto simula el comportamiento humano realista
    sleep(1);
}