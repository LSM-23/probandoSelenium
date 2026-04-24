import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 3,
    duration: '10s',
}

// Códigos de colores para la terminal
const colorAmarillo = '\x1b[33m';
const colorAzul = '\x1b[34m';
const colorRojo = '\x1b[31m';
const colorReset = '\x1b[0m';

export function setup(){
    console.log(`${colorAmarillo}🔄 [SETUP] Iniciando... Creando datos de prueba.${colorReset}`);

    const urlCrear = 'https://dummyjson.com/products/add';
    const datos = JSON.stringify({title: 'producto de prueba'});
    const parametros = {headers: {'Content-Type': 'application/json'}}

    const respuesta = http.post(urlCrear, datos, parametros);
    const idGenerado = respuesta.json('id');

    console.log(`${colorAmarillo}🔄 [SETUP] Producto creado con ID: ${idGenerado}${colorReset}\n`);

    // Retornamos el ID para que los VUs y el Teardown lo puedan usar
    return { idProducto: idGenerado };
}

// ==========================================
// 2. FUNCIÓN PRINCIPAL: LA PRUEBA (Se ejecuta por cada VU)
// ==========================================

export default function(datosDelSetup){
    const urlConsultar = `https://dummyjson.com/products/1`;
    const respuesta = http.get(urlConsultar);

    check(respuesta, {
        "Consulta exitosa (200)": (r)=> r.status === 200,
    });

    // Un log discreto para saber que están trabajando
    if (__ITER === 0) {
         console.log(`${colorAzul}[Usuario ${__VU}] Consultando producto ${datosDelSetup.idProducto}...${colorReset}`);
    }

    sleep(1);
}

// ==========================================
// 3. TEARDOWN: LIMPIEZA (Se ejecuta 1 vez al final)
// ==========================================

export function Teardown(datosDelSetup){
    console.log(`\n${colorRojo}🧹 [TEARDOWN] La prueba terminó. Iniciando limpieza...${colorReset}`);

    const urlBorrar = `https://dummyjson.com/products/2`;

    const respuestaBorrar = http.del(urlBorrar);

    if (respuestaBorrar.status === 200) {
        console.log(`${colorRojo}🧹 [TEARDOWN] Producto ${datosDelSetup.idProducto} eliminado correctamente. ¡Base de datos limpia!${colorReset}\n`);
    } else {
        console.error('Error al intentar limpiar la base de datos.');
    }
}