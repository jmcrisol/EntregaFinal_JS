/*  Simulador de dashboard para manejar stock de ecommerce y que impacte en la página del Store */ 


// Comprobar si el elemento "Stock" existe en el "local storage", si no existe se carga y si existe no pisarlo
if (!localStorage.getItem('Stock')) {
  fetch('./js/stock.json')
  .then(response => response.json())
  .then(json => {
      const jsonString = JSON.stringify(json);
      localStorage.setItem('Stock', jsonString);
  });
}

//Funciones para mantener actualizado el DOM 
actualizar = () => {pintarStock();obtenerCantidadStock();pintarPublicados();comprar();sacar();agregar();del();}

// Pintar en el DOM al cargar la página
window.addEventListener("load", () => {actualizar()});






//:::::::::::::::::::::::::::::      COMIENZO DEL DASHBOARD       :::::::::::::::::::::::::::::::::

// Función para reiniciar las cantidades del simulador tomadas del JSON al presionar botón "reestablecer"
const reestablecerStock = () => {
  fetch('./js/stock.json')
  .then(response => response.json())
  .then(json => {
      const jsonString = JSON.stringify(json);
      localStorage.setItem('Stock', jsonString);
      actualizar();
  });
  Toastify({
    text: "Se recargó el stock inicial",
    duration: 2000,
    destination: "",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: false, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #0d6efd, #169e83)",
      color: "#ffffff",
    
    },
    onClick: function(){} // Callback after click
  }).showToast();
}
const botonReestablecer = document.getElementById("reestablecer");
botonReestablecer.addEventListener("click", reestablecerStock)




//Pintar los productos en el DOM
const pintarStock = () => {
  const limpiar = document.getElementById("listaStock")
  limpiar.innerHTML = "";
  const jsonStock = localStorage.getItem('Stock');
  const stock = JSON.parse(jsonStock);
  
    for (let s of stock) {
      let contenedor = document.createElement("li");
      contenedor.className = "stock-dark list-group-item list-group-item-action d-flex justify-content-between lh-sm copiar-objeto"
      contenedor.innerHTML = `
        <div>
        
        <h6 class="my-0">${s.nombre}</h6>
        <i class="botonMas bi bi-plus-circle me-1" style="color: #43bb43;" data-nombre="${s.nombre}" ></i>
        <i class="botonMenos bi bi-dash-circle me-2" style="color: #ff9974;" data-nombre="${s.nombre}"></i>
        <small class="text-muted">Disponibles: ${s.disponible}</small>
        </div>
        <div>
          <span class="text-muted me-3 precio-producto">$${s.precio}</span>
          <button class="eliminar-boton btn btn-outline-secondary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" data-nombre=${s.nombre}>Eliminar</button>
        </div>
    
    `;
      document.getElementById("listaStock").appendChild(contenedor);
    }
  };

  // Recuento de productos para pintarlos en el Badge
  async function obtenerCantidadStock() {
    try {
      const stockString = localStorage.getItem('Stock');
      const stock = JSON.parse(stockString);
      const propiedades = Object.keys(stock);
      const numObjetos = propiedades.length;
  
      (function pintarCantidadStock() {
        let n = document.getElementById("cantidadStock")
        n.innerHTML = `${numObjetos}`
      })();

    } catch (error) {
      console.error(error);
    }
  };

// Función para el botón eliminar
  function del () {
    const listaDeBotonesEliminar = document.querySelectorAll(".eliminar-boton");
    for (let botonEliminar of listaDeBotonesEliminar) {
      botonEliminar.addEventListener("click", () => {
        const stockString = localStorage.getItem('Stock');
        const nombre = botonEliminar.getAttribute("data-nombre");
        let stock = JSON.parse(stockString);
        const indice = stock.findIndex(objeto => objeto.nombre === nombre);
        stock.splice(indice, 1);
        const stockStringModificado = JSON.stringify(stock);
        localStorage.setItem('Stock', stockStringModificado);
        actualizar();
        Toastify({
          text: "Se eliminó el producto",
          duration: 2000,
          destination: "",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #0d6efd, #ff5050)",
            color: "#ffffff",
          
          },
          onClick: function(){} // Callback after click
        }).showToast();
      
      },)
    }
  };
  
//Función para el icono "+"
  function agregar (){
    let botonesAgregar = document.querySelectorAll(".botonMas");
    for (let botonAgregar of botonesAgregar) {
      const nombre = botonAgregar.getAttribute("data-nombre");
      botonAgregar.addEventListener("click", () => {
        const nombre = botonAgregar.getAttribute("data-nombre");
        const jsonString = localStorage.getItem('Stock');
        const array = JSON.parse(jsonString);
        const indice = array.findIndex(objeto => objeto.nombre === nombre);
        array[indice].disponible ++;
        const nuevoJsonString = JSON.stringify(array);
        localStorage.setItem('Stock', nuevoJsonString);
        actualizar();
        Toastify({
          text: "Se agregó una unidad",
          duration: 1000,
          destination: "",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #0d6efd, #169e83)",
            color: "#ffffff",
          
          },
          onClick: function(){} // Callback after click
        }).showToast();
      });
    };
    
  };

//Función para el icono "-"
  function sacar (){
    let botonesSacar = document.querySelectorAll(".botonMenos");
    for (let botonSacar of botonesSacar) {
      const nombre = botonSacar.getAttribute("data-nombre");
      botonSacar.addEventListener("click", () => {
        const nombre = botonSacar.getAttribute("data-nombre");
        const jsonString = localStorage.getItem('Stock');
        const array = JSON.parse(jsonString);
        const indice = array.findIndex(objeto => objeto.nombre === nombre);
        array[indice].disponible = array[indice].disponible > 0 ? array[indice].disponible - 1 : array[indice].disponible;
        const nuevoJsonString = JSON.stringify(array);
        localStorage.setItem('Stock', nuevoJsonString);
        actualizar();
        if (array[indice].disponible > 0) {
          Toastify({
            text: "Se quitó una unidad",
            duration: 1000,
            destination: "",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #0d6efd, #ff5050)",
              color: "#ffffff",
            
            },
            onClick: function(){} // Callback after click
          }).showToast();
          
        }
        
      });
    };
    
  };





//:::::::::::::::::::::::::::     FUNCIONES PARA EL MODAL   :::::::::::::::::::::::::::::::::: 


//Funcion para agregar productos al array y enviar al LocalStorage
function carga() {
  class Producto {
    constructor(nombre, precio, disponible) {
      this.nombre = document.getElementById("nombreInput").value.toUpperCase();
      this.precio = parseFloat(document.getElementById("precioInput").value);
      this.disponible = parseInt( document.getElementById("disponibleInput").value);
    }
  }
  const stockString = localStorage.getItem('Stock');
  let stock = JSON.parse(stockString);
  //Si el producto existe lo reemplazo con las nuevas cantidades y precio
  const nuevoProducto = new Producto();
  let productoExistente = stock.find(producto => producto.nombre === nuevoProducto.nombre);
  if (productoExistente) {
    // reemplazar producto existente con el nuevo producto
    stock = stock.map(producto => producto.nombre === nuevoProducto.nombre ? nuevoProducto : producto);
  } else {
    // agregar nuevo producto al arreglo
    stock.push(nuevoProducto);
  }
  const stockStringModificado = JSON.stringify(stock);
  localStorage.setItem('Stock', stockStringModificado);

  //Limpia los campos de texto al terminar de cargar un producto
  const campoTexto = (input) => {
    let campo = document.getElementById(input);
    campo.value = '';
    campo.blur();
  };
  campoTexto("nombreInput");
  campoTexto("precioInput");
  campoTexto("disponibleInput");
}

//Acción del Botón ACEPTAR
let botonAceptarCarga = document.getElementById("btn-productos");
  botonAceptarCarga.addEventListener("click", ()=>{
    carga();
    actualizar();
    Toastify({
      text: "Se agregó el producto al stock",
      duration: 2000,
      destination: "",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #0d6efd, #169e83)",
        color: "#ffffff",
      
      },
      onClick: function(){} // Callback after click
    }).showToast();
    
  })


//Función para tomar el ENTER en los campos de texto
function enter (input) {
    let teclaAceptarCarga1 = document.getElementById(input);
    teclaAceptarCarga1.addEventListener("keydown", function(event) {
        if (event.key === 'Enter') {
            carga();
            actualizar();
        }})
  }
enter("nombreInput");
enter("precioInput");
enter("disponibleInput");






//:::::::::::::::::::::::::::::    COMIENZO DEL STORE  ::::::::::::::::::::::::::::::::::::::::::::::::


//Pintar los productos del Stock en el DOM
const pintarPublicados = () => {
  const limpiar = document.getElementById("publicados");
  limpiar.innerHTML = "";
  const jsonStock = localStorage.getItem("Stock");
  const stock = JSON.parse(jsonStock);

  for (let s of stock) {
    let contenedor = document.createElement("div");
    contenedor.className = "card text-bg-dark my-3";
    contenedor.style = "width: 18rem;";
    contenedor.innerHTML = `    
    <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false">
    <title>Placeholder</title>
    <rect width="100%" height="100%" fill="#7b6f9d"></rect>
    <text x="15%" y="50%" fill="#dee2e6" dy="0.3em">${s.nombre}</text></svg>
    <div class="card-body">
      <h5 class="card-title">${s.nombre}</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      <p class="card-text">Unidades disponibles:  ${s.disponible}</p>
      <button type="button" class="btn boton-dark boton-comprar" data-nombre= "${s.nombre}" >Comprar</button>
    </div>
  </div>
      `;
    if (s.disponible==0) {
      contenedor.innerHTML=contenedor.innerHTML.replace(`<p class="card-text">Unidades disponibles:  ${s.disponible}</p>`,`<p class="card-text">Agotado</p>`);
      contenedor.innerHTML=contenedor.innerHTML.replace(`class="btn boton-dark boton-comprar"`,`class="btn boton-dark" disabled`)      
    }
    document.getElementById("publicados").appendChild(contenedor);
  }
};





//Función del botón comprar para ir descontando una unidad al hacer click 
const comprar = () => {
  let botonesComprar = document.querySelectorAll(".boton-comprar");
  for (let botonComprar of botonesComprar) {
    const nombre = botonComprar.getAttribute("data-nombre");
    botonComprar.addEventListener("click", (event) => {
      event.preventDefault();
      const nombre = botonComprar.getAttribute("data-nombre");
      const jsonString = localStorage.getItem("Stock");
      const array = JSON.parse(jsonString);
      const indice = array.findIndex((objeto) => objeto.nombre === nombre);
      array[indice].disponible =
        array[indice].disponible > 0 ? array[indice].disponible - 1 : array[indice].disponible;
      const nuevoJsonString = JSON.stringify(array);
      localStorage.setItem("Stock", nuevoJsonString);
      actualizar();
      if (array[indice].disponible >= 0) {
        Toastify({
          text: "Se compró una unidad",
          duration: 1000,
          destination: "",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #0d6efd, #169e83)",
            color: "#ffffff",
          },
          onClick: function () {}, // Callback after click
        }).showToast();
        };
        
      } 
    );
  }
};


