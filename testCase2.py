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

# Le decimos al navegador que visite una página
driver.get("https://practicetestautomation.com/practice-test-login/")
print(f"¡Éxito! El título de la página que visitamos es: {driver.title}")

#Buscar los campos de username y password, e ingresar datos incorrectos
driver.find_element(By.ID, "username").send_keys("incorrectUser")
driver.find_element(By.ID, "password").send_keys("Password123")

# Hacer click en el botón de submit para intentar iniciar sesión
driver.find_element(By.ID, "submit").click()

# Buscar el mensaje de error que aparece al ingresar credenciales incorrectas
error = driver.find_element(By.ID, "error").text

# Verificar que el mensaje de error sea el esperado
if(AssertionError("Your username is invalid!" in error)):
    print("El mensaje de error es correcto.")
else:
    print("El mensaje de error es incorrecto.")


# Tomar la captura de pantalla completa con chrome
# 1. Medir el tamaño total de la página usando Javascript
ancho = driver.execute_script("return document.body.parentNode.scrollWidth")
alto = driver.execute_script("return document.body.parentNode.scrollHeight")

# 2. Ajustar el tamaño de la ventana de Chrome a esas medidas
# set_window_size (un comando para cambiar las dimensiones exactas de la ventana del navegador)
driver.set_window_size(ancho, alto)

# 3. Tomar la captura de pantalla normal, pero ahora con la ventana ajustada al tamaño total de la página.
driver.save_screenshot("mi_captura_completa_chrome.png")
print("Captura de pantalla completa guardada como 'mi_captura_completa_chrome.png'")


# Cerrar el proceso
driver.quit()