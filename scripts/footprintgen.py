import time
import pyautogui

def export_footprints_to_svg(output_dir, num_footprints):
    # Esperar un momento para que el editor de footprints se abra completamente
    time.sleep(3)

    # Realizar clic en la galería de footprints para asegurarse de que está activa
    pyautogui.click(x=100, y=100)

    # Iterar sobre el número de footprints a exportar
    for i in range(num_footprints):
        # Seleccionar el primer footprint de la galería
        pyautogui.hotkey('ctrl', 'a')

        # Esperar un momento para que se seleccione el footprint
        time.sleep(1)

        # Realizar la acción de plotear el footprint como SVG
        pyautogui.hotkey('ctrl', 'p')

        # Esperar un momento para que aparezca el diálogo de impresión
        time.sleep(1)

        # Escribir el nombre del archivo SVG y confirmar
        pyautogui.write(f"footprint_{i}.svg")
        pyautogui.press('enter')

        # Esperar un momento para que se realice la exportación
        time.sleep(1)

        # Navegar al siguiente footprint en la galería
        pyautogui.hotkey('down')

# Directorio de salida para los archivos SVG
output_dir = "/home/guille/hardwaretor2.pretty"  # Cambiar por el directorio de salida deseado

# Número de footprints a exportar (ajustar según sea necesario)
num_footprints = 10

# Ejecutar la función
export_footprints_to_svg(output_dir, num_footprints)
