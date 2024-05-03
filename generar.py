from color import colors_from_img
from PIL import Image
import os
from os import listdir
from os.path import isfile, join
import sys



def image_colors_from_path(image_path):
    base_width= 50
    max_colors = 1000000
    img = Image.open(os.path.join(repr(image_path)[1:-1])) #repr convierte el string a raw string para tratar las barras como carácteres
    wpercent = (base_width / float(img.size[0]))
    hsize = int((float(img.size[1]) * float(wpercent)))
    """cropped_left = int(base_width/4)
    cropped_right = int((base_width*3)/4)
    cropped_top = int(hsize/4)
    cropped_bottom = int((hsize*3)/4)
    img = img.crop(cropped_left,cropped_top,cropped_right,cropped_bottom)
    new_width = int(base_width/2)
    new_height = int(hsize/2)
    COMENTARIO"""
    img = img.resize((base_width, hsize), Image.Resampling.LANCZOS)
    
    cropped_left = int(base_width/4)
    cropped_right = int((base_width*3)/4)
    cropped_top = int(hsize/4)
    cropped_bottom = int((hsize*3)/4)
    img = img.crop((cropped_left,cropped_top,cropped_right,cropped_bottom))
    

    #img.show()
    colors_img = colors_from_img(img,max_colors)
    return colors_img
    

todos_nombres_ropa = ["camisas","sudaderas","chaquetas","pantalones","zapatos","otros"]
todos_nombres_outfits = ["outfits"]
image_folder = "images";

with open('data_python.json', 'w') as sys.stdout:
    print("{")
    print("\n\t\"comments\":\n[\n\t{\n\t\t\"NOTA\":\"No es recomendable meter comentarios, pero lo haré igualmente\",\n\t\t\"name\":\"nombre descriptivo de la prenda, no pueden haber repetidos del mismo tipo de prenda\",\n\t\t\"selected\":\"'true' si quieres que aparezca seleccionada al cargar, 'false' en caso contrario\",\n\t\t\"image_src\":\"PATH a la imagen relacionada a la prenda de ropa dentro de la carpeta 'images', no se debe incluir 'images'\",\n\t\t\"type\":\"tipo de prenda. Valores validos: 'camisas','sudaderas','pantalones','zapatos','otros'. Cualquier valor distinto se clasifica como 'otros'\",\n\t\t\"dependencias\":\"atributo de outfits, prendas de las que depende o necesita\",\n\t\t\"colors\":\"colores principales que incluye el outfit\"\n\t}\n]")


    print(",\n\"ropa\":\n[")
    size_ropa = len(todos_nombres_ropa)

    for x in range (0,size_ropa):

        tipo_directory = todos_nombres_ropa[x]
        paths_images = listdir(image_folder+'/'+tipo_directory)
        i = 0
        for path_image in paths_images:
            
            path = path_image.replace("\n","")
            path_from_images_folder = tipo_directory+'/'+path
            image_path = image_folder+'/'+ path_from_images_folder
            colors = image_colors_from_path(image_path)
            nombre = path.removesuffix(".png")
            
            if (i != 0): print(",\n")
            i+=1
            print(
            "{\n\t\"name\": \""+nombre+"\",\n\t\"selected\":\"false\",\n\t\"image_src\":\""+path_from_images_folder+"\",\n\t\"type\":\""+tipo_directory+"\",\n\t\"colors\":\""+colors+"\"\n}")
        
        if (x != size_ropa - 1): print(",")
        print("\n")

    print("]")
    print(",\n\"outfit\":\n[")
    #Outfits
    size_outfits = len(todos_nombres_outfits)
    for x in range (0,size_outfits):

        tipo_directory = todos_nombres_outfits[x]
        paths_images = listdir(image_folder+'/'+tipo_directory)
        i = 0
        for path_image in paths_images:
            
            path = path_image.replace("\n","")
            path_from_images_folder = tipo_directory+'/'+path
            image_path = image_folder+'/'+ path_from_images_folder
            colors = image_colors_from_path(image_path)
            nombre = path.removesuffix(".png")
            
            if (i != 0): print(",\n")
            i+=1
            print(
            "{\n\t\"name\": \""+nombre+"\",\n\t\"dependencias\":\"\",\n\t\"image_src\":\""+path_from_images_folder+"\",\n\t\"colors\":\""+colors+"\"\n}")

        if (x != size_outfits - 1): print(",")
        print("\n")

    print("]")
    print("}")

    
    sys.stdout = sys.__stdout__

"""
    base_width= 50
    max_colors = 100000
    image_folder = "images"
    directories = [f for f in listdir(image_folder) if not isfile(join(image_folder, f))]
    for directory in directories:
        onlyfiles = [f for f in listdir(image_folder+'/'+directory) if isfile(join(image_folder+'/'+directory, f))]
        for currentfile in onlyfiles:
            image_path = image_folder+'/'+directory+'/'+currentfile
            img = Image.open(os.path.join(repr(image_path)[1:-1])) #repr convierte el string a raw string para tratar las barras como carácteres
            wpercent = (base_width / float(img.size[0]))
            hsize = int((float(img.size[1]) * float(wpercent)))
            img = img.resize((base_width, hsize), Image.Resampling.LANCZOS)
            colors_img = colors_from_img(img,1000000)
            print(colors_img)
    """