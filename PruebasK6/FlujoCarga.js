import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1, // Mantén 1 usuario mientras validas que el flujo funciona
    duration: '10s',
};

export default function () {
    // =========================================================
    // PASO 1: LOGIN Y OBTENCIÓN DEL TOKEN
    // =========================================================
    
    // A. Define la URL de tu sistema donde se hace el login
    const urlLogin = 'https://api.tusistema.com/login'; 
    
    // B. Prepara los tres campos que tu sistema requiere
    const credenciales = JSON.stringify({
        empresa: 'MiEmpresa_SA',
        usuario: 'juan_perez',
        contraseña: 'PasswordSeguro123!'
    });

    // C. Indicamos que enviamos un JSON
    const parametrosLogin = {
        headers: { 'Content-Type': 'application/json' },
    };

    // D. Ejecutamos la petición POST para iniciar sesión
    const respuestaLogin = http.post(urlLogin, credenciales, parametrosLogin);

    // Verificamos que el login haya sido exitoso
    const loginExitoso = check(respuestaLogin, {
        'Login fue exitoso (200)': (r) => r.status === 200,
    });

    // Si el login falla, detenemos esta iteración y probamos de nuevo
    if (!loginExitoso) {
        console.error('El login falló, abortando esta vuelta.');
        return; 
    }

    // E. ¡LA MAGIA! Extraemos el token dinámico de la respuesta.
    // OJO: Asumimos que tu API responde con algo como { "token": "eyJh..." }
    // Si tu API lo llama "accessToken" o "jwt", cambia la palabra 'token' abajo.
    const miTokenDinamico = respuestaLogin.json('token');


    // =========================================================
    // PASO 2: USAR EL TOKEN EN UNA NUEVA PETICIÓN POST
    // =========================================================

    // F. Define la URL donde vas a crear un registro o hacer una acción
    const urlAccion = 'https://api.tusistema.com/crear-dato';
    
    // G. El JSON con los datos de tu nueva acción
    const datosAccion = JSON.stringify({
        modulo: 'ventas',
        cantidad: 50,
        descripcion: 'Prueba de carga automatizada'
    });

    // H. Configuramos las cabeceras INYECTANDO nuestro token dinámico
    const parametrosAccion = {
        headers: {
            'Authorization': `Bearer ${miTokenDinamico}`, // Aquí entra el token recién horneado
            'Content-Type': 'application/json',
        },
    };

    // I. Enviamos la petición final
    const respuestaAccion = http.post(urlAccion, datosAccion, parametrosAccion);

    // J. Validamos que nuestra acción fue permitida por el servidor
    check(respuestaAccion, {
        'Accion con token exitosa (200 o 201)': (r) => r.status === 200 || r.status === 201,
    });

    // Pausa simulando al usuario
    sleep(1);
}