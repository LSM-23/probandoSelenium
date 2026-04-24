import http, { get } from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        // Escenario A: Mucho tráfico de gente solo mirando
        grupo_exploradores: {
            executor: 'constant-vus', // Mantiene un número constante de usuarios
            vus: 3,                   // 4 usuarios en este grupo
            duration: '10s',          // Durante 10 segundos
            exec: 'mirarProductos',   // ¡LA CLAVE! Le dice a k6 qué función debe ejecutar este grupo
        },
        
        // Escenario B: Tráfico menor de gente que ya va a pagar
        grupo_compradores: {
            executor: 'constant-vus',
            vus: 3,                   // Solo 2 usuarios en este grupo
            duration: '10s',
            exec: 'revisarCarrito',   // Apunta a la segunda función
        },
    },
};

// Códigos de colores para distinguirlos en la terminal
const colorAzul = '\x1b[34m';
const colorVerde = '\x1b[32m';
const colorReset = '\x1b[0m';

export function mirarProductos() {
    const url = 'https://dummyjson.com/products?limit=5';
    const respuesta = http.get(url);

    check(respuesta, {
        'Explorador: Catálogo cargado (200)': (r) => r.status === 200,
    });

    console.log(`${colorAzul}[Explorador ${__VU}] 👀 Revisando la lista de productos...${colorReset}`);
    
    // Los exploradores hacen clics rápidos, esperan poco
    sleep(1);
}

export function revisarCarrito() {
    const url = 'https://dummyjson.com/carts/1';
    const respuesta = http.get(url);

    check (respuesta, {
        'El carrito compro (200)': (r)=> r.status === 200,
    });

    console.log(`${colorVerde}[Comprador ${__VU}] 🛒 Calculando el total a pagar...${colorReset}`);
    
    // Los compradores se toman más tiempo para leer los totales antes de pagar
    sleep(2);
}