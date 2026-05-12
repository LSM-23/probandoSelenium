import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * CONFIGURACIÓN DE LA PRUEBA (Options)
 * Como buenos ingenieros, primero definimos el escenario de carga y los criterios de éxito (SLA/SLO).
 */
// export let options = {
//   // Escenarios: Definimos cómo evolucionará el número de Usuarios Virtuales (VUs)
//   vus: 2, // Número de Usuarios Virtuales concurrentes
//   iterations: 5, // Número total de iteraciones a ejecutar (opcional, se puede usar duration)


//   // stages: [
//   //   { duration: '5s', target: 2 },  // Ramp-up: Subida gradual para calentar el sistema
//   //   { duration: '10s', target: 5 }, // Plateau: Carga sostenida para medir estabilidad
//   //   { duration: '10s', target: 0 },  // Ramp-down: Bajada gradual para observar recuperación
//   // ],
  
//   // Umbrales (Thresholds): Aquí definimos qué consideramos un "aprobado" o "suspenso"
//   thresholds: {
//     // No permitimos más del 5% de errores. Si falla demasiado, abortamos (fail-fast).
//     http_req_failed: [{
//       threshold: 'rate<=0.05',
//       abortOnFail: true,
//     }],
//     // El 95% de las peticiones deben resolverse en menos de 100ms.
//     http_req_duration: ['p(95)<=100'],
//     // El 99% de nuestras validaciones (checks) deben ser exitosas.
//     checks: ['rate>=0.99'],
//   },
// };

/**
 * FUNCIÓN PRINCIPAL (VU Logic)
 * Este es el código que ejecutará cada Usuario Virtual (VU) de forma iterativa.
 */
// export default function() {
//   let url = 'https://httpbin.org/post';
  
//   // Realizamos una petición POST. Siempre es buena práctica capturar la respuesta.
//   let response = http.post(url, 'Hello world!');
  
//   // Validaciones (Checks): No basta con que el servidor responda, 
//   // debemos verificar que el contenido es el esperado.
//   check(response, {
//       'Application says hello': (r) => r.body.includes('Hello world!')
//   });

//   // Tiempo de pensamiento (Think Time): En el mundo real, los usuarios no hacen clic 
//   // instantáneamente. Usamos un sleep aleatorio para simular comportamiento humano.
//   sleep(Math.random() * 5);


// }

export let options = {
  vus: 1,
  iterations: 1,
};

export default function() {

  let response = http.get('https://quickpizza.grafana.com/my_messages.php');
  check(response, {
      'is Unauthorized': r => r.body.includes('Login'),
  })

  let csrfToken = response.html().find("input[name=csrftoken]").attr("value");

  // Get random username and password from array
  let username = 'admin';
  let password = '123';

  response = http.post('https://quickpizza.grafana.com/admin.php', { login: username, password: password, csrftoken: csrfToken });
  check(response, {
      'is status 200': (r) => r.status === 200,
      'is login successful': r => r.body.includes('Welcome, admin'),
      })
}