from PIL import Image
import webcolors
import os
from os import listdir
from os.path import isfile, join


diccionario_colores = ([
    ('#ff00ff', 'purple'),('#800080', 'purple'),('#ee7dee','purple'),
    ('#00ffff', 'blue'),('#0000ff','blue'),('#000080','blue'),('#366464','blue'),('#133B5F','blue'),('#607185','blue'),
    ('#008000', 'green'),('#00ff00','green'),('#87ac11','green'),
    ('#ffff00', 'yellow'), 
    ('#ffa500', 'orange'),
    ('#ff0000', 'red'),('#800000', 'red'),('#4e050c','red'),('#90272E','red'),  
    ('#381613','brown'),('#452606','brown'),('#a17242','brown'),('#703C31','brown'),
    ('#ffffff', 'white'),('#b5bbc9','white'),('#bfb6b7','white'),
    ('#808080', 'grey'),
    ('#000000', 'black'),('#110d0c','black'),('#181212','black')])
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

base_width= 50
max_colors = 100000
dirpath = "images/chaquetas"
onlyfiles = [f for f in listdir(dirpath) if isfile(join(dirpath, f))]
for currentfile in onlyfiles:
    img = Image.open(os.path.join(repr(dirpath+'/'+currentfile)[1:-1])) #repr convierte el string a raw string para tratar las barras como carácteres
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