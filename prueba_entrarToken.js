import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. CARGAMOS LA CONFIGURACIÓN
// La función open() es nativa de k6 y lee archivos locales.
const config = JSON.parse(open('./config.json'));

export const options = {
    // Metodo tradicional de un escenario
    vus: 2,
    duration: '20s',
    //iterations: 5,

    // Metodo de varios escenarios
    // stages: [
    //     // FASE 1 (Subida / Ramp-up): En 10 segundos, pasamos de 0 a 5 usuarios.
    //     { duration: '5s', target: 1 },
        
    //     // FASE 2 (Mantenimiento): Durante 15 segundos, mantenemos a esos 5 usuarios constantes.
    //     { duration: '5s', target: 3 },
        
    //     // FASE 3 (Bajada / Ramp-down): En 10 segundos, los usuarios bajan gradualmente de 5 a 0.
    //     { duration: '5s', target: 0 },
    // ],

    // ==========================================
    // ¡NUEVO! UMBRALES DE RENDIMIENTO (Thresholds)
    // ==========================================
    thresholds: {
        // Regla 1: El 95% de las peticiones debe tardar menos de 300ms.
        // (Puedes cambiar este 300 a 10 para forzar que la prueba falle y veas el error rojo)
        http_req_duration: ['p(95)<30'],
        
        // Regla 2: Menos del 1% de las peticiones pueden fallar (errores 400 o 500)
        http_req_failed: ['rate<0.01'], 
    },
};

// 2. SETUP (Login)
export function setup() {
    console.log('🔄 Iniciando sesión con datos del config.json...');
    
    // Armamos la URL uniendo la base del config con la ruta específica
    const urlLogin = `${config.urlBase}/auth/login`;
    
    // Usamos las credenciales del config
    const credenciales = JSON.stringify({
        username: config.usuarioPrueba,
        password: config.passwordPrueba,
    });
    const parametrosLogin = { headers: { 'Content-Type': 'application/json' } };

    const respuestaLogin = http.post(urlLogin, credenciales, parametrosLogin);
    
    check(respuestaLogin, {
        'Setup: Login exitoso': (r) => r.status === 200,
    });

    return {
        tokenCompartido: respuestaLogin.json('accessToken')
    };
}

// 3. FUNCIÓN PRINCIPAL
export default function (datosDelSetup) {
    // 1. Definimos los de la terminal (ANSI)
    const colorVerde = '\x1b[32m';
    const colorRojo = '\x1b[31m';
    const colorReset = '\x1b[0m'; // Súper importante para devolver la terminal a la normalidad

    // Nuevamente usamos la URL base del config
    const urlSecreta = `${config.urlBase}/auth/me`;

    const parametrosSecretos = {
        headers: {
            'Authorization': `Bearer ${datosDelSetup.tokenCompartido}`, 
            'Content-Type': 'application/json' 
        }
    };

    const respuestaSecreta = http.get(urlSecreta, parametrosSecretos);

    let respuestas = check(respuestaSecreta, {
        'Acceso permitido': (r) => r.status === 200,
    });

    if (respuestas) {
        console.log(`${colorVerde}✅ Respuesta exitosa${colorReset}`);
    } else {
        console.log(`${colorRojo}🟥 Respuesta fallida${colorReset}`);
    }

    sleep(1);
}