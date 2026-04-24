import http from 'k6/http';
import { check, sleep } from 'k6';

// Preparamo las opciones con
export const options = {
    vus: 5, // numero de usuarios virtuale
    duration: '20s', // Tiempo que tomara la ejecution
    //iterations: 3, // veces que se itera
};

//=========================================
// Funcion setud (ejecuta el login una vez)
//=========================================
export function setup() {
console.log('🔄 Ejecutando Setup: Iniciando sesión UNA sola vez...');
    
    const urlLogin = 'https://dummyjson.com/auth/login';
    const credenciales = JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
    });
    const parametrosLogin = { headers: { 'Content-Type': 'application/json' } };

    const respuestaLogin = http.post(urlLogin, credenciales, parametrosLogin);
    
    check(respuestaLogin, {
        'Setup: Login exitoso': (r) => r.status === 200,
    });

    // Extraemos el token (usando accessToken como descubriste)
    const tokenGenerado = respuestaLogin.json('accessToken');

    // ¡LA CLAVE! Retornamos un objeto con los datos que queremos compartir
    return {
        tokenCompartido: tokenGenerado
    };
}

//========================================================================
// Preparamos la funcion principal que ejecutara cada usuario con el token
//========================================================================
export default function (tokenDelSetud) {

    const urlSecreta = 'https://dummyjson.com/auth/me';

    const parametrosSecretos = {
        headers: {
            'Authorization': `Bearer ${tokenDelSetud.tokenCompartido}`, 
            'Content-Type': 'application/json'
        }
    };

    const respuestaSecreta = http.get(urlSecreta, parametrosSecretos);

    check(respuestaSecreta, {
        'Estamos dentro (200)': (r) => r.status === 200,
    });

    // Imprimir el cuerpo completo de la respuesta
    check(respuestaSecreta, {
        'Acceso a ruta secreta permitido': (r) => r.status === 200,
    });

    sleep(1);
}