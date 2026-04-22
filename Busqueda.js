import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. CONFIGURACIÓN
export const options = {
    vus: 3,          // 3 usuarios virtuales
    duration: '15s', // Durante 15 segundos
};

// 2. DATOS DINÁMICOS
// Lista de palabras clave que simularán lo que la gente teclea en tu buscador
const terminosBusqueda = ['laptop', 'phone', 'shoes', 'watch', 'tablet', 'perfume'];

// 3. FUNCIÓN PRINCIPAL
export default function () {
    // A. Elegimos un término de búsqueda al azar de nuestra lista
    const terminoAleatorio = terminosBusqueda[Math.floor(Math.random() * terminosBusqueda.length)];

    // B. Construimos la URL inyectando la palabra elegida (?q=palabra)
    const url = `https://dummyjson.com/products/search?q=${terminoAleatorio}`;

    // C. Configuramos las cabeceras (En un GET no hay "body", pero sí headers)
    const parametros = {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer tu_token` // Descomenta esto si tu API real pide token
        },
    };

    // D. Ejecutamos la petición GET
    const respuesta = http.get(url, parametros);
    
    // Convertimos la respuesta a JSON para poder leer qué encontró
    const respuestaJSON = respuesta.json();

    // E. Validamos que la búsqueda fue exitosa
    check(respuesta, {
        'el estado es 200 (OK)': (r) => r.status === 200,
        // dummyjson nos devuelve un campo "total" indicando cuántos items encontró
        'la API devolvió la propiedad total': (r) => respuestaJSON.total !== undefined,
    });

    // =========================================================
    // F. BLOQUE PARA EL EQUIPO DE QA
    // =========================================================
    const registroQA = {
        usuario_virtual: __VU,
        busqueda_realizada: terminoAleatorio, // Qué palabra buscó este usuario
        resultados_encontrados: respuestaJSON.total, // Cuántos items le devolvió la BD
        // ¡NUEVO! Métrica muy útil: Cuántos milisegundos tardó exactamente esta búsqueda
        tiempo_respuesta_ms: respuesta.timings.duration 
    };

    console.info(JSON.stringify(registroQA));
    // =========================================================

    sleep(1);
}