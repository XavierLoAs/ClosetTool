from PIL import Image
import webcolors
from os import listdir
from os.path import isfile, join


diccionario_colores = ([
    ('#ff00ff', 'morado'),('#800080', 'morado'),('#ee7dee','morado'),
    ('#00ffff', 'azul'),('#0000ff','azul'),('#000080','azul'),('#366464','azul'),('#133B5F','azul'),('#607185','azul'),
    ('#008000', 'verde'),('#00ff00','verde'),('#87ac11','verde'),
    ('#ffff00', 'amarillo'), 
    ('#ffa500', 'naranja'),
    ('#ff0000', 'rojo'),('#800000', 'rojo'),('#4e050c','rojo'),('#90272E','rojo'),  
    ('#381613','marron'),('#452606','marron'),('#a17242','marron'),('#703C31','marron'),
    ('#ffffff', 'blanco'),('#b5bbc9','blanco'),('#bfb6b7','blanco'),
    ('#808080', 'gris'),
    ('#000000', 'negro'),('#110d0c','negro'),('#181212','negro')])
def closest_colour(requested_colour):
    min_colours = {}
    for key, name in diccionario_colores:
        r_c, g_c, b_c = webcolors.hex_to_rgb(key)
        rd = (r_c - requested_colour[0]) ** 2
        gd = (g_c - requested_colour[1]) ** 2
        bd = (b_c - requested_colour[2]) ** 2
        if (rd+gd+bd == 0): return [name,name,name] #Si es color exacto, devolver directamente
        min_colours[(rd + gd + bd)] = name
    best_3_colors = sorted(min_colours.items())[0:3]
    #print(best_3_colors)
    if best_3_colors[0][0]*2 < best_3_colors[1][0]: return [best_3_colors[0][1],best_3_colors[0][1],best_3_colors[0][1]]
    elif best_3_colors[1][0]*2 < best_3_colors[2][0]: return [best_3_colors[0][1],best_3_colors[0][1],best_3_colors[1][1]]
    return [best_3_colors[0][1],best_3_colors[1][1],best_3_colors[2][1]]
    #return [min_colours[min(min_colours.keys())]]  #Devuelve el nombre del color que se aleje menos del color que le has pasado

def colour_ponderation(index):
    index = int(index)
    if (index == 0): return 70
    elif (index == 1): return 20
    else: return 10

"""
base_width= 50
max_colors = 100000
image_path = "images"
directories = [f for f in listdir(image_path) if not isfile(join(image_path, f))]
print(directories)
for directory in directories:
    onlyfiles = [f for f in listdir(image_path+'/'+directory) if isfile(join(image_path+'/'+directory, f))]
    print(onlyfiles)
    for currentfile in onlyfiles:
        img = Image.open(os.path.join(repr(image_path+'/'+directory+'/'+currentfile)[1:-1])) #repr convierte el string a raw string para tratar las barras como carácteres
        print(currentfile)
        wpercent = (base_width / float(img.size[0]))
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((base_width, hsize), Image.Resampling.LANCZOS)

        colortuples = img.convert('RGB').getcolors(max_colors)
        list_colors_clothing = {}
        for colortuple in colortuples:

            requested_colour = colortuple[1]
            best_3_colors_name = closest_colour(requested_colour)
            
            index = 0
            for color_name in best_3_colors_name:
                #print(color_name)
                if color_name not in list_colors_clothing.keys(): list_colors_clothing[color_name] = colour_ponderation(index)
                else: list_colors_clothing[color_name] += colour_ponderation(index)
                index += 1
            

        #print(list_colors_clothing)
        list_colors_clothing = sorted(list_colors_clothing.items(), key =lambda x:x[1],reverse=True)
        lista_defintiva = []
        total_pixels = len(colortuples)*100
        for color, apariciones in list_colors_clothing:
            print(color+": "+str(apariciones)+", "+str((apariciones/total_pixels)*100)+"%")
            if ((apariciones/total_pixels)*100 >= 10): lista_defintiva.append(color)


        #print(lista_defintiva)

        string_lista = ' '.join(str(color_definitivo) for color_definitivo in lista_defintiva)
        print(string_lista)
        #img.show(title=string_lista)
"""

def colors_from_img(img,max_colors):

    colortuples = img.convert('RGB').getcolors(max_colors)

    list_colors_clothing = {}
    for colortuple in colortuples:

        requested_colour = colortuple[1]
        best_3_colors_name = closest_colour(requested_colour)
        
        index = 0
        for color_name in best_3_colors_name:
            #print(color_name)
            if color_name not in list_colors_clothing.keys(): list_colors_clothing[color_name] = colour_ponderation(index)
            else: list_colors_clothing[color_name] += colour_ponderation(index)
            index += 1
        

    #print(list_colors_clothing)
    list_colors_clothing = sorted(list_colors_clothing.items(), key =lambda x:x[1],reverse=True)
    lista_defintiva = []
    total_pixels = len(colortuples)*100
    for color, apariciones in list_colors_clothing:
        #print(color+": "+str(apariciones)+", "+str((apariciones/total_pixels)*100)+"%")
        if ((apariciones/total_pixels)*100 >= 10): lista_defintiva.append(color)


    #print(lista_defintiva)

    string_lista = ' '.join(str(color_definitivo) for color_definitivo in lista_defintiva)
    return string_lista
    #print(string_lista)
    #img.show(title=string_lista)