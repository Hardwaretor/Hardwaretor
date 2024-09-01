import bpy
import os
import subprocess

def procesar_archivo(ruta_wrl):
    try:
        # Obtener el nombre del archivo sin la extensión
        nombre_sin_extension = os.path.splitext(os.path.basename(ruta_wrl))[0]

        # Ruta de salida para el archivo .obj
        ruta_salida_obj = os.path.join(os.path.dirname(ruta_wrl), nombre_sin_extension + ".obj")

        # Verificar si ya existe un archivo .obj para este .wrl
        if os.path.exists(ruta_salida_obj):
            print(f"El archivo .obj ya existe para {nombre_sin_extension}. Omitiendo conversión.")
            return

        # Limpiar la escena actual
        bpy.ops.object.select_all(action='DESELECT')
        bpy.ops.object.select_by_type(type='MESH')
        bpy.ops.object.delete()

        # Importar el archivo .wrl
        bpy.ops.import_scene.x3d(filepath=ruta_wrl)
        print(f"Archivo importado correctamente: {ruta_wrl}")

        # Seleccionar el objeto de malla
        mesh_obj = bpy.context.selected_objects[-1]

        # Ruta de salida para el archivo .stl
        ruta_salida_stl = os.path.join(os.path.dirname(ruta_wrl), nombre_sin_extension + ".stl")
        print(f"Convirtiendo y guardando como: {nombre_sin_extension}.stl")

        # Exportar la geometría a formato .stl
        bpy.ops.export_mesh.stl(filepath=ruta_salida_stl, use_selection=True)
        print(f"Archivo .stl guardado correctamente: {ruta_salida_stl}")

        # Convertir el archivo .stl a .obj usando meshlabserver
        ruta_salida_obj = os.path.join(os.path.dirname(ruta_wrl), nombre_sin_extension + ".obj")
        print(f"Convirtiendo y guardando como: {nombre_sin_extension}.obj")
        subprocess.run(["meshlabserver", "-i", ruta_salida_stl, "-o", ruta_salida_obj])
        print(f"Archivo .obj guardado correctamente: {ruta_salida_obj}")

    except Exception as e:
        print(f"Error al procesar {ruta_wrl}: {str(e)}")

# Carpeta que contiene los archivos .wrl
carpeta = "/home/guille/hardwaretor/dmodels/"

# Iterar sobre todos los archivos .wrl en la carpeta
for archivo in os.listdir(carpeta):
    if archivo.endswith(".wrl"):
        ruta_wrl = os.path.join(carpeta, archivo)
        print(f"Procesando archivo: {ruta_wrl}")
        procesar_archivo(ruta_wrl)
