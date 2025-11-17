//PREGUNTA SI EXISTE UN LOCALSTORAGE DE PRODUCTOS PARA CREARLO CON PRODUCTOS POR DEFECTO SI ES NECESARIO.
if (!localStorage.getItem('productos')) {
  let productosDefault = [
    { codigo: "1000", descripcion: "Leche entera 1L La Serenísima", categoria: "Lacteos", precio: 850 },
    { codigo: "1001", descripcion: "Pan de molde blanco Fargo 550g", categoria: "Panaderia", precio: 1200 },
    { codigo: "1002", descripcion: "Queso cremoso 1kg", categoria: "Lacteos", precio: 4600 },
    { codigo: "1003", descripcion: "Aceite de girasol Natura 1.5L", categoria: "Aceites", precio: 2900 },
    { codigo: "1004", descripcion: "Fideos spaghetti Matarazzo 500g", categoria: "Almacen", precio: 950 }
  ];
  localStorage.setItem('productos', JSON.stringify(productosDefault));
  console.log('Los productos se guardaron en el localStorage');
} else {
  console.log('Productos cargados desde el localStorage');
}

// SE CARGAN LOS PRODUCTOS DESDE EL LOCALSTORAGE.
let productos = JSON.parse(localStorage.getItem('productos'));
cargarProductos();
cargarCategorias();

//MUESTRA LOS PRODUCTOS EN LA TABLA.
function cargarProductos() {
  const contenedorProductos = document.getElementById('tabla-productos');
  contenedorProductos.innerHTML = '';
  for (const producto of productos) {
    const item = document.createElement('tr');
    item.innerHTML = `
    <td>${producto.codigo}</td>
    <td>${producto.descripcion}</td>
    <td>$${producto.precio}</td>
    <td>${producto.categoria}</td>
    <td><button class="btn agregar" id="item${producto.codigo}">Agregar</button></td>
    `;
    contenedorProductos.appendChild(item);
    const btnAgregar = document.getElementById(`item${producto.codigo}`);
    btnAgregar.addEventListener('click', () => agregarCarrito(producto.codigo));
  }
}

//CREO CARRITO Y LLAMO LA FUNCION DE MOSTRAR.
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total;
cargarCarrito();

//FUNCION MOSTRAR/ACTUALIZAR CARRITO
function cargarCarrito() {
  const contCarrito = document.getElementById('lista-carrito');
  contCarrito.innerHTML = '';
  total = 0;
  if (carrito.length > 0) {
    for (const itemCarrito of carrito) {
      let subtotal = itemCarrito.cantidad * itemCarrito.precio;
      total += subtotal;
      const item = document.createElement('li')
      item.innerHTML = `<p>${itemCarrito.descripcion}<br>
    ${itemCarrito.cantidad} x $${itemCarrito.precio} = $${subtotal}</p>
    <button id="itemCarrito${itemCarrito.codigo}">Eliminar</button>`;
      contCarrito.appendChild(item);
      const btnElimProd = document.getElementById(`itemCarrito${itemCarrito.codigo}`);
      btnElimProd.addEventListener('click', () => eliminarProductoCarrito(itemCarrito.codigo));
    }
  } else {
    const aviso = document.createElement('li');
    aviso.innerHTML = 'No hay productos en el carrito';
    contCarrito.appendChild(aviso);
  }
  const totalCarrito = document.getElementById('total');
  totalCarrito.innerText = `$${total}`;
}

//FUNCION AGREGAR AL CARRITO.
function agregarCarrito(codigo) {
  let buscarCarrito = carrito.find(p => p.codigo === codigo);
  if (buscarCarrito !== undefined) {
    buscarCarrito.cantidad++;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Cantidad del producto actualizada');
    cargarCarrito();
  } else {
    let buscarProducto = productos.find(p => p.codigo === codigo);
    let descrip = buscarProducto.descripcion;
    let precio = buscarProducto.precio;
    carrito.push({ codigo: codigo, descripcion: descrip, precio: precio, cantidad: 1 });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Producto agregado al carrito');
    cargarCarrito();
  }
}

//FUNCION ELIMINAR DEL CARRITO
function eliminarProductoCarrito(codigo) {
  carrito = carrito.filter(p => p.codigo !== codigo);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  console.log('Producto eliminado del carrito');
  cargarCarrito();
}

//FUNCION CARGAR CATEGORIAS EXISTENTES EN MODAL AÑADIR PRODUCTO
function cargarCategorias() {
  const categorias = [];
  for (const producto of productos) {
    let buscarCat = categorias.find(p => p === producto.categoria);
    if (buscarCat === undefined) {
      categorias.push(producto.categoria);
    }
  }
  const selectModal = document.getElementById('listaCategorias');
  selectModal.innerHTML = '';
  for (const categoria of categorias) {
    const option = document.createElement('option');
    option.setAttribute('value', categoria);
    selectModal.appendChild(option);
  }
}

//FUNCION ABRIR MODAL AÑADIR PRODUCTO
const btnAnadir = document.getElementById('btn-anadir');
btnAnadir.addEventListener('click', () => document.getElementById('modalOverlay').style.display = "flex");

//FUNCION CERRAR MODAL AÑADIR PRODUCTO
const btnCerrar = document.getElementById('btn-cerrar');
btnCerrar.addEventListener('click', () => document.getElementById('modalOverlay').style.display = "none");

//FUNCION GUARDAR PRODUCTO DE MODAL AÑADIR PRODUCTO
const btnGuardar = document.getElementById('btn-guardar');
btnGuardar.addEventListener('click', () => {
  const inputCodigo = document.getElementById('codigo').value;
  let verifCodigo = productos.find(p => p.codigo === inputCodigo)
  if (verifCodigo !== undefined) {
    alert('Codigo del producto ya existente');
  } else {
    const inputDescripcion = document.getElementById('descripcion').value;
    const inputCategoria = document.getElementById('categoria').value;
    const inputPrecio = document.getElementById('precio').value;
    productos.push({ codigo: inputCodigo, descripcion: inputDescripcion, categoria: inputCategoria, precio: inputPrecio });
    localStorage.setItem('productos', JSON.stringify(productos));
    document.getElementById('formularioAgregarProducto').reset();
    console.log('Producto agregado al localStorage');
    alert('Producto añadido con exito!');
    cargarProductos();
    cargarCategorias();
  }
})

//FUNCION ABRIR MODAL ELIMINAR PRODUCTO
const btnEliminarProd = document.getElementById('btn-eliminar');
btnEliminarProd.addEventListener('click', () => document.getElementById('modalEliminar').style.display = "flex");

//FUNCION CERRAR MODAL ELIMINAR PRODUCTO
const btnCancelar = document.getElementById('btn-cancelar');
btnCancelar.addEventListener('click', () => document.getElementById('modalEliminar').style.display = "none");

//FUNCION ELIMINAR PRODUCTO
const btnEliminar = document.getElementById('btn-eliminar-modal');
btnEliminar.addEventListener('click', () => {
  const codigoEliminar = document.getElementById('codigoEliminar').value;
  let verifCodigo = productos.find(p => p.codigo === codigoEliminar);
  if (verifCodigo === undefined) {
    alert('Codigo del producto no existe en tu lista');
  } else {
    let confirmacion = confirm(`Seguro que quieres eliminar el producto con el codigo ${codigoEliminar}`);
    if (confirmacion) {
      productos = productos.filter(p => p.codigo !== codigoEliminar);
      localStorage.setItem('productos', JSON.stringify(productos));
      document.getElementById('formularioEliminarProducto').reset();
      alert('Producto eliminado')
      console.log(`Producto con el codigo ${codigoEliminar} eliminado`);
      cargarProductos();
    }
  }
});

//FUNCION COBRAR
const btnCobrar = document.getElementById('btn-cobrar');
btnCobrar.addEventListener('click', () => {
  carrito = [];
  localStorage.clear('carrito');
  alert(`¡Cobraste $${total} por tu venta!`);
  cargarCarrito();
});