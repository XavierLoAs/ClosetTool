/*const selectBtnPrendas = document.querySelector(".sel-prendas"),
itemsprendas = selectBtnPrendas.parentElement.querySelectorAll(".item");

selectBtnPrendas.addEventListener("click", () => {selectBtnPrendas.classList.toggle("open");});

itemsprendas.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");
        
        let checked = selectBtnPrendas.parentElement.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text-prendas");

            if(checked && checked.length > 0){
                btnText.innerText = `${checked.length} Selected`;
            }else{
                btnText.innerText = "Select Color Prendas";
            }
    });
})*/

//'[class^=image_outfit]'
//'[class^=sel]'
const selectBtns = document.querySelectorAll('[class^=sel]');
console.log(selectBtns);
selectBtns.forEach(selectBtn => {
  console.log(selectBtn);
  items = selectBtn.parentElement.querySelectorAll(".item");    

  selectBtn.addEventListener("click", () => {selectBtn.classList.toggle("open");});

  items.forEach(item => {
      item.addEventListener("click", () => {
          item.classList.toggle("checked");
          
          let checked = selectBtn.parentElement.querySelectorAll(".checked");
          if (selectBtn.className.includes("prendas"))
          {
            btnText = selectBtn.querySelector(".btn-text-prendas");

            if(checked && checked.length > 0) btnText.innerText = `${checked.length} Selected`;
            else btnText.innerText = "Select Color Prendas";
          }
          else
          {
            btnText = selectBtn.querySelector(".btn-text-outfit");

            if(checked && checked.length > 0) btnText.innerText = `${checked.length} Selected`;
            else btnText.innerText = "Select Color Outfit";
          }     
      });
  })
})



var fileLoaded = false;
var newArr;
var dependenciasMap={};
var coloresMap={};
var coloresRopaMap={};
function loadFile() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
    fileLoaded = true;
  }

  function receivedText(e) {
    let lines = e.target.result;
    newArr = JSON.parse(lines); 
    var string_JSON = JSON.stringify(newArr);
    console.log(string_JSON);
    if (/<|>|!|\*|=|;|\(|\)/.test(string_JSON))
    {
      alert("Que coño te piensas que haces saboteando mi página? No se pueden incluir los siguientes carácteres en el .JSON: <>!*=;()");
      return;
    }
    var div_outfits = document.getElementById("outfits_generados");
    var ropa = newArr.ropa;
    var i = 0;
    var elements_camisas = [];
    var elements_pantalones = [];
    var elements_zapatos = [];
    var elements_sudaderas = [];
    var elements_chaquetas = [];
    var elements_otros = [];

    //Clasificamos cada tipo de ropa en un array distinto (es necesario para organizar los divs de columnas y filas)
    for (i = 0; i < ropa.length; ++i)
    {
      var type_ropa = ropa[i].type;
      if (type_ropa == "camisas") elements_camisas.push(ropa[i]);
      else if (type_ropa == "sudaderas") elements_sudaderas.push(ropa[i]);
      else if (type_ropa == "chaquetas") elements_chaquetas.push(ropa[i]);
      else if (type_ropa == "pantalones") elements_pantalones.push(ropa[i]);
      else if (type_ropa == "zapatos") elements_zapatos.push(ropa[i]);
      else elements_otros.push(ropa[i]);
    }

    //var all_elements = [{elements_camisas,"imagenes_usuario_camisas"},{elements_pantalones,"imagenes_usuario_camisas"},{elements_zapatos,"imagenes_usuario_camisas"},{elements_otros,"imagenes_usuario_camisas"}];
    var all_elements = [
      {
        "prendas":elements_camisas,
        "id_div":"imagenes_usuario_camisas"
      },
      {
        "prendas":elements_sudaderas,
        "id_div":"imagenes_usuario_sudaderas"
      },
      {
        "prendas":elements_chaquetas,
        "id_div":"imagenes_usuario_chaquetas"
      },
      {
        "prendas":elements_pantalones,
        "id_div":"imagenes_usuario_pantalones"
      },
      {
        "prendas":elements_zapatos,
        "id_div":"imagenes_usuario_zapatos"
      },
      {
        "prendas":elements_otros,
        "id_div":"imagenes_usuario_otros"
      }
    ]

    var index_all_ropa = 0;
    for(x = 0; x < all_elements.length; ++x)
    {
      var array_tipo_actual = all_elements[x];
      var id_div_actual = array_tipo_actual.id_div;
      var ropa_tipo_actual = array_tipo_actual.prendas;
      var full_string = "";
      var div_imagenes = document.getElementById(id_div_actual);
      for (i = 0; i < ropa_tipo_actual.length; ++i) 
      {
        var name_ropa = ropa_tipo_actual[i].name;
        var image_path = ropa_tipo_actual[i].image_src;
        var coloresRopaActual = ropa_tipo_actual[i].colors;
        if (coloresRopaActual == null || coloresRopaActual == undefined) coloresRopaMap[name_ropa] = "";
        else coloresRopaMap[name_ropa] = coloresRopaActual;
        
        if (i%4 == 0) full_string += "<div class='row'>";
        full_string += "<div class='column'><input type='checkbox' name='"+name_ropa+"' class='checkbox_ropa' id='myCheckBox"+index_all_ropa.toString()+"'/>" + "<label for='myCheckBox"+index_all_ropa.toString()+"'><img class ='image_ropa' src = 'images/"+image_path+"' /></label></div>";
        if (i == ropa.length - 1 || i%4 == 3) full_string += "</div>";
        ++index_all_ropa;
      }
      div_imagenes.innerHTML = full_string;
    }

    for (i = 0; i < ropa.length; ++i)
    {
      if (ropa[i].selected == "true") document.getElementById("myCheckBox"+i.toString()).checked = true;
    }
    
    var outfits = newArr.outfit;
    full_string = "";
    for (i = 0; i < outfits.length; ++i)
    {
      var name_outfit = outfits[i].name;
      dependenciasMap[name_outfit] = outfits[i].dependencias;
      coloresMap[name_outfit] = outfits[i].colors;
      var image_path = outfits[i].image_src;
      if (i%4 == 0) full_string += "<div class='row'>";
      full_string += `<div class="column_outfit"> <button class="outfit_button" onclick="findOutfit(event,'`+name_outfit+`')" id ="ButtonOutfit"> <img name = "`+name_outfit+`" class ="image_outfit" src = "images/`+image_path+`" /></button><p style="display:none;clear:both">`+outfits[i].dependencias+`</p></div>`;
      if (i == ropa.length - 1 || i%4 == 3) full_string += "</div>";
    }
    
    div_outfits.innerHTML = full_string;

    submitImages(); //Inicializar
  }
}
function HideAllPrendas()
{
  var ropa = document.getElementsByClassName("checkbox_ropa");
  for (i = 0; i < ropa.length; ++i) ropa[i].parentElement.style.display = "none";
}

function ShowAllPrendas()
{
  var ropa = document.getElementsByClassName("checkbox_ropa");
  for (i = 0; i < ropa.length; ++i) ropa[i].parentElement.style.display = "block";
}

  function DeselectAll()
{
  console.log("deSELECT");
  var ropa = document.getElementsByClassName("checkbox_ropa");
  for (i = 0; i < ropa.length; ++i) ropa[i].checked = false;
}

function SelectAll()
{
  var ropa = document.getElementsByClassName("checkbox_ropa");
  for (i = 0; i < ropa.length; ++i) ropa[i].checked = true;
}

  function UpdateRopa()
{ 
  
  if (!fileLoaded)
  {
    alert("You have to load a JSON file first to update clothing");
    return;
  }
    //console.log("COLORES ROPA:",coloresRopaMap);
    //Quitamos la sombra a todas las prendas
    var ropa = document.getElementsByClassName("checkbox_ropa");
    for (l = 0; l < ropa.length; ++l)
    {
      var label_prenda = ropa[l].parentElement.getElementsByTagName("label")[0];
      var image_prenda = label_prenda.getElementsByTagName("img")[0];
      image_prenda.style.filter="drop-shadow(0 0 0 #ffffff)";
    }

    let checked = document.querySelector(".sel-prendas").parentElement.querySelectorAll(".checked");
    var colors = "";
    for (h = 0; h < checked.length; ++h) {
      colors = colors + " " + checked[h].innerText.toString().toLowerCase();
    }
    var ColorsArr = colors.split(" ");
    for (i = 0; i < ropa.length; ++i)
    {
      console.log(ropa[i]);
      var name_ropa = ropa[i].name;
      var colors_ropa = coloresRopaMap[name_ropa];
      var show = false;
      for (k = 1; k < ColorsArr.length; ++k) 
      {
        if (colors_ropa.includes(ColorsArr[k].toLowerCase()))
        {
          //console.log("El color incluido ha estado" + ColorsArr[k].toLowerCase());
          show = true;
          break;
        }
        //else console.log("El color "+ColorsArr[k]+ " no está incluido en "+colors_ropa);
      }
      if (ColorsArr.length == 0 || (ColorsArr.length == 1 && ColorsArr[0]=="") )
      {
        //console.log("Muestro por condición especial");
        show = true; //Si no se selecciona ningún color, todos los outfits son elegibles independientemente del color
      }
      if (show)
      {
        ropa[i].parentElement.style.display = "block";
        
      }
      else
      {
        ropa[i].checked = false;
        ropa[i].parentElement.style.display = "none";
      }
    }
}
  function submitImages()
{
  if (!fileLoaded)
  {
    alert("You have to load a JSON file first to submit images");
    return;
  }
    var checkboxs = document.getElementsByClassName("checkbox_ropa");
    
    //Quitamos la sombra a todas las prendas

    for (l = 0; l < checkboxs.length; ++l)
    {
      var label_prenda = checkboxs[l].parentElement.getElementsByTagName("label")[0];
      var image_prenda = label_prenda.getElementsByTagName("img")[0];
      image_prenda.style.filter="drop-shadow(0 0 0 #ffffff)";

    }
    var outfits = document.querySelectorAll('[class^=image_outfit]');
    let checked = document.querySelector(".select-btn").parentElement.querySelectorAll(".checked");
    var colors = "";
    //De todos los botones marcadis del boton de selección de prendas, hacemos un string de colores con el texto interno. 
    //NOTA: Se podria cambiar el texto interno por id para hacerlo más expandible.
    for (h = 0; h < checked.length; ++h) {
      colors = colors + " " + checked[h].innerText.toString().toLowerCase();
    }
    //console.log(colors);
    var ColorsArr = colors.split(" ");
    for (i = 0; i < outfits.length; ++i)
    {
      //console.log(outfits[i]);
      outfits[i].style.filter="drop-shadow(0 0 0 #ffffff)";
      var full_name_outfit = outfits[i].name;
      const array_ropa = dependenciasMap[full_name_outfit].split(" ");
      var colors_outfit = coloresMap[full_name_outfit];
      var show = false;
      //Para cada color de outfits, miramos si el outfit lo contiene. Si encuentra alguno, sale y continua
      for (k = 1; k < ColorsArr.length; ++k) 
      {
        if (colors_outfit.includes(ColorsArr[k].toLowerCase()))
        {
          //console.log("El color incluido ha estado" + ColorsArr[k].toLowerCase());
          show = true;
          break;
        }
        //else console.log("El color "+ColorsArr[k]+ " no está incluido en "+colors_outfit);
      }
      if (ColorsArr.length == 0 || (ColorsArr.length == 1 && ColorsArr[0]=="") )
      {
        console.log("Muestro por condición especial");
        show = true; //Si no se selecciona ningún color, todos los outfits son elegibles independientemente del color
      }
      if (show)
      {
        //Por cada prenda de ropa, comprobamos que esté marcado. Si hay alguna que no está marcada, no mostramos el outfit
        for(j = 0; j < array_ropa.length; ++j)
        {
          var prenda_actual = document.getElementsByName(array_ropa[j]);
          if (prenda_actual.length > 0)
          {
            if (!prenda_actual[0].checked)
            { 
              show = false;
              break;
            }
          }
          
        }
        if (show) outfits[i].parentElement.parentElement.style.display = "block";
        else outfits[i].parentElement.parentElement.style.display = "none";
      }
      else outfits[i].parentElement.parentElement.style.display = "none";
    }
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function findOutfit(evt, outfit_name) {
  var color_shadow = "#5477d8";
  const array_ropa_outfit = dependenciasMap[outfit_name].split(" ");
  var outfit = document.getElementsByName(outfit_name)[0];
  outfit.classList.toggle("checked");
  if (outfit.className.includes("checked")) 
  {
    outfit.style.filter = "drop-shadow(7px 7px 30px "+color_shadow+")";
    //outfit.parentElement.parentElement.getElementsByTagName("p")[0].style.display="block";
    for (j = 0; j < array_ropa_outfit.length; ++j)
    {
      var label_prenda = document.getElementsByName(array_ropa_outfit[j]);
      if (label_prenda.length > 0) 
      {
        label_prenda = label_prenda[0].parentElement.getElementsByTagName("label")[0];
        var image_prenda = label_prenda.getElementsByTagName("img")[0];
        label_prenda.parentElement.style.display = "block";
        image_prenda.style.filter="drop-shadow(7px 7px 7px "+color_shadow+")";
      }
    }
  }
  else 
  {
    //outfit.parentElement.parentElement.getElementsByTagName("p")[0].style.display="none";
    outfit.style.filter = "drop-shadow(0 0 0 #000000)";
    for (j = 0; j < array_ropa_outfit.length; ++j)
    {
      var label_prenda = document.getElementsByName(array_ropa_outfit[j])[0].parentElement.getElementsByTagName("label")[0];
      var image_prenda = label_prenda.getElementsByTagName("img")[0];
      image_prenda.style.filter="drop-shadow(0 0 0 #000000)";
    }
  }
}

function download(filepath,filename) {
  console.log("PRUEBA DOWNLOAD");
  const a = document.createElement('a');
  a.href = filepath;
  a.download = filename;
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
