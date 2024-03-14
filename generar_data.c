#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <fcntl.h>

char total[1000];
char* nombres[200]; //Consideramos que hay menos de 200 imágenes por carpeta
char buff[256];
const char* todos_nombres_ropa[] = {"camisas","sudaderas","chaquetas","pantalones","zapatos","otros"};
const char* todos_nombres_outfits[] = {"outfits"};
int useless;


char *strremove(char *str, const char *sub) {
    char *p, *q, *r;
    if (*sub && (q = r = strstr(str, sub)) != NULL) {
        size_t len = strlen(sub);
        while ((r = strstr(p = r + len, sub)) != NULL) {
            while (p < r)
                *q++ = *p++;
        }
        while ((*q++ = *p++) != '\0')
            continue;
    }
    return str;
}

void Usage()
{
	sprintf(buff, "Usage: El programa total no debe recibir ningún parámetro, porque recibe el nombre de todos los programas a compilar de un archivo .txt\n");
	useless = write(1,buff,strlen(buff));
}

int main(int argc, char* argv[])
{
	if (argc == 1)
	{
    write(1,"{",strlen("{"));
    sprintf(total,"\n\t\"comments\":\n[\n\t{\n\t\t\"NOTA\":\"No es recomendable meter comentarios, pero lo haré igualmente\",\n\t\t\"name\":\"nombre descriptivo de la prenda, no pueden haber repetidos del mismo tipo de prenda\",\n\t\t\"selected\":\"'true' si quieres que aparezca seleccionada al cargar, 'false' en caso contrario\",\n\t\t\"image_src\":\"PATH a la imagen relacionada a la prenda de ropa dentro de la carpeta 'images', no se debe incluir 'images'\",\n\t\t\"type\":\"tipo de prenda. Valores validos: 'camisas','sudaderas','pantalones','zapatos','otros'. Cualquier valor distinto se clasifica como 'otros'\",\n\t\t\"dependencias\":\"atributo de outfits, prendas de las que depende o necesita\",\n\t\t\"colors\":\"colores principales que incluye el outfit\"\n\t}\n]");
    /*sprintf(total,
    "\n\t\"comments\":\n
    [\n
    \t{\n
    \t\t\"NOTA\":\"No es recomendable meter comentarios, pero lo haré igualmente\",\n
    \t\t\"name\":\"nombre descriptivo de la prenda, no pueden haber repetidos del mismo tipo de prenda\",\n
    \t\t\"selected\":\"'true' si quieres que aparezca seleccionada al cargar, 'false' en caso contrario\",\n
    \t\t\"image_src\":\"PATH a la imagen relacionada a la prenda de ropa dentro de la carpeta 'images', no se debe incluir 'images'\",\n
    \t\t\"type\":\"tipo de prenda. Valores validos: 'camisas','sudaderas','pantalones','zapatos','otros'. Cualquier valor distinto se clasifica como 'otros'\",\n
    \t\t\"dependencias\":\"atributo de outfits, prendas de las que depende o necesita\"\n
    \t}\n
    ]");*/
   
    useless = write(1,total,strlen(total));
    sprintf(total,",\n\"ropa\":\n[");
    write(1,total,strlen(total));
    int size_ropa = sizeof(todos_nombres_ropa) / sizeof(todos_nombres_ropa[0]);
    //ropa
    for (int x = 0; x < size_ropa; ++x)
    {
      const char* nombre_tipo = todos_nombres_ropa[x];
      //Actualizar el archivo de nombres de programas
      int ret2 = fork();
      if (ret2 == 0) //Hijo
      {
        int fd = open( "nombres.txt", O_WRONLY |O_CREAT |O_TRUNC, 0644);
        close( 1 );
        useless = dup( fd );
        sprintf(buff,"images/%s",nombre_tipo);
        if ( (execlp("ls", "ls",buff,(char*)NULL)) < 0)
        {
        sprintf(buff, "Error en el execlp: %d\n", errno);
        useless = write(1,buff,strlen(buff));
        }
        exit(0);
      }
      else if (ret2 == -1)
      {
        sprintf(buff, "Error en el fork\n");
        useless = write(1,buff,strlen(buff));
      }
      waitpid(-1 , NULL, 0);

      //Leer los nombres de programas del archivo
      FILE *ptr_file;
      char buf[1000];
      ptr_file =fopen("nombres.txt","r");
      if (!ptr_file) return 1;
      int n_programas = 0;
      while (fgets(buf,1000, ptr_file)!=NULL)
      {
        buf[strcspn(buf, "\n")] = 0;
        nombres[n_programas] = strdup(buf);
        ++n_programas;
      }
      fclose(ptr_file);
      char path_arr[200];
      char* name;
      char* path;
      for (int i = 0; i < n_programas; ++i) 
      {
        
        sprintf(path_arr, "%s\n", nombres[i]);
        path = strremove(path_arr,"\n");
        char path_aux[200];
        char path_tipo[200];
        sprintf(path_aux,"%s",path);
        name = strremove(path_aux,".png");
        sprintf(path_tipo,"%s/%s",nombre_tipo,path);

        if (i != 0)
        {
          sprintf(total,",\n");
          write(1,total,strlen(total));
        }
        sprintf(total,
        "{\n\t\"name\": \"%s\",\n\t\"selected\":\"false\",\n\t\"image_src\":\"%s\",\n\t\"type\":\"%s\"\n}",name,path_tipo,nombre_tipo);
        useless = write(1,total,strlen(total));
      }
      if (x != size_ropa - 1) write(1,",",strlen(","));
      write(1,"\n",strlen("\n"));
    }
    write(1,"\n]",strlen("\n]"));
    sprintf(total,",\n\"outfit\":\n[");
    write(1,total,strlen(total));
    //outfits
    int size_outfits = sizeof(todos_nombres_outfits) / sizeof(todos_nombres_outfits[0]);
    for (int x = 0; x < size_outfits; ++x)
    {
      const char* nombre_tipo = todos_nombres_outfits[x];
      //Actualizar el archivo de nombres de programas
      int ret2 = fork();
      if (ret2 == 0) //Hijo
      {
        int fd = open( "nombres.txt", O_WRONLY |O_CREAT |O_TRUNC, 0644);
        close( 1 );
        useless = dup( fd );
        sprintf(buff,"images/%s",nombre_tipo);
        if ( (execlp("ls", "ls",buff,(char*)NULL)) < 0)
        {
        sprintf(buff, "Error en el execlp: %d\n", errno);
        useless = write(1,buff,strlen(buff));
        }
        exit(0);
      }
      else if (ret2 == -1)
      {
        sprintf(buff, "Error en el fork\n");
        useless = write(1,buff,strlen(buff));
      }
      waitpid(-1 , NULL, 0);

      //Leer los nombres de programas del archivo
      FILE *ptr_file;
      char buf[1000];
      ptr_file =fopen("nombres.txt","r");
      if (!ptr_file) return 1;
      int n_programas = 0;
      while (fgets(buf,1000, ptr_file)!=NULL)
      {
        buf[strcspn(buf, "\n")] = 0;
        nombres[n_programas] = strdup(buf);
        ++n_programas;
      }
      fclose(ptr_file);
      
      char path_arr[200];
      char* name;
      char* path;
      for (int i = 0; i < n_programas; ++i) 
      {
        
        sprintf(path_arr, "%s\n", nombres[i]);
        path = strremove(path_arr,"\n");
        char path_aux[200];
        char path_tipo[200];
        sprintf(path_aux,"%s",path);
        name = strremove(path_aux,".png");
        sprintf(path_tipo,"%s/%s",nombre_tipo,path);

        if (i != 0)
        {
          sprintf(total,",\n");
          write(1,total,strlen(total));
        }
        sprintf(total,
        "{\n\t\"name\": \"%s\",\n\t\"dependencias\":\"\",\n\t\"image_src\":\"%s\",\n\t\"colors\":\"\"\n}",name,path_tipo);
        useless = write(1,total,strlen(total));
      }
      if (x != size_outfits - 1) write(1,",",strlen(","));
      write(1,"\n",strlen("\n"));
    }
    write(1,"]\n",strlen("]\n"));
    write(1,"}\n",strlen("}\n"));
    int ret4 = fork();
    if (ret4 == 0) //HIJO
    {
      execlp("rm","rm","-r","-f","nombres.txt",(char*)(NULL));
    }
  }
  else Usage();
}
