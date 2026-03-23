from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# Configurar opciones para Headless (sin interfaz visual)
opciones = Options()
opciones.add_argument("--headless")
opciones.add_argument("--no-sandbox") # (Desactiva una capa de aislamiento de Chrome; es necesario para que funcione dentro de la máquina virtual de Codespaces)
opciones.add_argument("--disable-dev-shm-usage") # (Evita que Chrome colapse por falta de memoria compartida en el contenedor)

print("Iniciando Chrome de forma invisible...")

# Instanciamos el navegador usando Chrome
driver = webdriver.Chrome(options=opciones)

# Funcion para tomar captura de pantalla completa
def tomar_captura_completa(url):
    print(f"Preparando para tomar captura de pantalla completa")
    driver.get(url)
    
    # Tomar la captura de pantalla completa con chrome
    # 1. Medir el tamaño total de la página usando Javascript
    alto = driver.execute_script("""
                                return Math.max(document.body.scrollHeight,
                                document.body.offsetHeight,
                                document.documentElement.clientHeight,
                                document.documentElement.scrollHeight,
                                document.documentElement.offsetHeight);
                                """)
    ancho = driver.execute_script("return document.body.parentNode.scrollWidth")


    # 2. Ajustar el tamaño de la ventana de Chrome a esas medidas
    # set_window_size (un comando para cambiar las dimensiones exactas de la ventana del navegador)
    driver.set_window_size(ancho, alto)

    # 3. Tomar la captura de pantalla normal, pero ahora con la ventana ajustada al tamaño total de la página.
    driver.save_screenshot("mi_captura_completa_chrome.png")
    print("Captura de pantalla completa guardada como 'mi_captura_completa_chrome.png'")


# Le decimos al navegador que visite una página
driver.get("https://practicetestautomation.com/practice-test-login/")
print(f"¡Éxito! El título de la página que visitamos es: {driver.title}")

#Buscar los campos de username y password, e ingresar datos correctos
driver.find_element(By.ID, "username").send_keys("student")
driver.find_element(By.ID, "password").send_keys("Password123")

#Esperar sesion iniciada

# Hacer click en el botón de submit para intentar iniciar sesión
driver.find_element(By.ID, "submit").click()

# escuchar url de la pagina para verificar que se cambio a la pagina de bienvenida
url = "https://practicetestautomation.com/logged-in-successfully/"
if(driver.current_url == url):
    print("¡Inicio de sesión exitoso!")
else:
    print("Error: No se pudo iniciar sesión.")

tomar_captura_completa(url)

# Cerrar el proceso
driver.quit()