// MOSTRARA LAS VENTAS REALIZADAS

import React, {useState,useEffect} from "react";

function Ventas(){

const [ventas, setVentas] = useState([]);


/* const [ventas, setVentas] = useState([]); */

const [productos, setProductos] = useState([]);

const [venta, setVenta] = useState({
  vendedor: "",
  ciudad: "",
  cliente: "",
  tipoDocumento: "FVP",
  factura: ""
});

const [busqueda, setBusqueda] = useState("");

const [cantidad, setCantidad] = useState(1);

const [carrito, setCarrito] = useState([]);
const [servicioManual, setServicioManual] = useState({
  descripcion: "",
  precio: "",
  cantidad: 1
});
const [buscarVenta, setBuscarVenta] = useState("");
const [ventaDespacho, setVentaDespacho] = useState(null);

const [ventaEditando, setVentaEditando] = useState(null);

const [formEditar, setFormEditar] = useState({
  vendedor: "",
  ciudad: "",
  cliente: "",
  tipoDocumento: "",
  factura: ""
});


const handleEditarChange = (e) => {

  setFormEditar({
    ...formEditar,
    [e.target.name]: e.target.value
  });

};

const [transportadora, setTransportadora] =
  useState("");

const [numeroGuia, setNumeroGuia] =
  useState("");

const cargarVentas = () => {

  fetch("http://localhost:3000/api/ventas")
    .then((res) => res.json())
    .then((data) => setVentas(data))
    .catch((err) => console.error(err));

};

const editarVenta = (venta) => {

  setVentaEditando(venta);

  setFormEditar({
    vendedor: venta.vendedor,
    ciudad: venta.ciudad,
    cliente: venta.cliente,
    tipoDocumento: venta.tipoDocumento,
    factura: venta.factura
  });

};

const guardarEdicion = async () => {

  try {

    const subtotal = formEditar.carrito.reduce(
  (acc, item) => acc + (item.precio * item.cantidad),
  0
);

const iva = subtotal * 0.19;

const total = subtotal + iva;

    const response = await fetch(
      `http://localhost:3000/api/ventas/${ventaEditando.idVenta}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
       body: JSON.stringify({
  ...formEditar,
  subtotal,
  iva,
  total
})
      }
    );

    const data = await response.json();

    alert(data.mensaje);

    setVentaEditando(null);

    cargarVentas();

  } catch (error) {

    console.error(error);

    alert("Error al actualizar");

  }

};

const eliminarFactura = async (idVenta) => {

  const confirmar = window.confirm(
    "¿Eliminar esta factura?"
  );

  if (!confirmar) return;

  try {

    const response = await fetch(
      `http://localhost:3000/api/ventas/${idVenta}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    alert(data.mensaje);

    cargarVentas();

  } catch (error) {

    console.error(error);

    alert("Error al eliminar");

  }

};

const ventasFiltradas = ventas.filter((v) => {

  const texto = buscarVenta.toLowerCase();

  return (

    v.factura?.toLowerCase().includes(texto) ||

    v.cliente?.toLowerCase().includes(texto) ||

    v.vendedor?.toLowerCase().includes(texto) ||

    v.ciudad?.toLowerCase().includes(texto)

  );

});

  useEffect(() => {

    
    // Cargar productos desde backend
    fetch("http://localhost:3000/api/inventario")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));

      //Cargar ventas

       cargarVentas();

       

}, []);

const handleChange = (e) => {
  setVenta({
    ...venta,
    [e.target.name]: e.target.value
  });
};

const productosFiltrados = productos.filter((p) =>
  p.nombre.toLowerCase().includes(busqueda.toLowerCase())
);

const handleServicioChange = (e) => {

  setServicioManual({
    ...servicioManual,
    [e.target.name]: e.target.value
  });

};

const agregarAlCarrito = (producto) => {

  const existente = carrito.find(
    (item) => item.id === producto.id
  );

  if (existente) {

    const nuevoCarrito = carrito.map((item) =>

      item.id === producto.id
        ? {
            ...item,
            cantidad: item.cantidad + Number(cantidad),
            subtotal:
              (item.cantidad + Number(cantidad)) * item.precio
          }
        : item
    );

    setCarrito(nuevoCarrito);

  } else {

    setCarrito([
      ...carrito,
      {
        ...producto,
        cantidad: Number(cantidad),
        subtotal: producto.precio * Number(cantidad)
      }
    ]);

  }

  setBusqueda("");
  setCantidad(1);
};

const agregarServicio = () => {

  if (
    !servicioManual.descripcion ||
    !servicioManual.precio
  ) {

    alert("Completa descripción y precio");

    return;
  }

  const nuevoServicio = {

    id: Date.now(),

    tipo: "servicio",

    nombre: servicioManual.descripcion,

    precio: Number(servicioManual.precio),

    cantidad: Number(servicioManual.cantidad),

    subtotal:
      Number(servicioManual.precio) *
      Number(servicioManual.cantidad)

  };

  setCarrito([
    ...carrito,
    nuevoServicio
  ]);

  setServicioManual({
    descripcion: "",
    precio: "",
    cantidad: 1
  });

};


const eliminarDelCarrito = (id) => {

  const nuevoCarrito = carrito.filter(
    (item) => item.id !== id
  );

  setCarrito(nuevoCarrito);
};

const totalGeneral = carrito.reduce(
  (acc, item) => acc + item.subtotal,
  0
);

const iva = totalGeneral * 0.19;

const totalConIVA = totalGeneral + iva;


const despacharVenta = async (idVenta) => {

  if (!transportadora || !numeroGuia) {

    alert("Completa transportadora y guía");

    return;
  }

  try {

    const response = await fetch(

      `http://localhost:3000/api/ventas/${idVenta}/despachar`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          numeroGuia,
          transportadora

        })

      }

    );

    const data = await response.json();

    alert(data.mensaje);

    cargarVentas();

    setVentaDespacho(null);

    setTransportadora("");

    setNumeroGuia("");

  } catch (error) {

    console.error(error);

    alert("Error al despachar");

  }

};
  const registrarVenta = async () => {

  // VALIDAR CARRITO
  if (carrito.length === 0) {

    alert("Agrega productos al carrito");

    return;
  }

  try {

    const response = await fetch(
      "http://localhost:3000/api/ventas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          vendedor: venta.vendedor,
          ciudad: venta.ciudad,
          cliente: venta.cliente,
          tipoDocumento: venta.tipoDocumento,
          factura: venta.factura,
          estado: "Armando Pedido",
          numeroGuia: "",
          carrito,

          subtotal: totalGeneral,
          iva,
          total: totalConIVA

        })

      }
    );

    const data = await response.json();

    // ERROR
    if (!response.ok) {

      alert(data.mensaje);

      return;
    }

    // OK
    alert("Venta registrada correctamente ✅");

    // =========================
    // RECARGAR INVENTARIO
    // =========================
    const inventarioActualizado = await fetch(
      "http://localhost:3000/api/inventario"
    );

    const productosActualizados =
      await inventarioActualizado.json();

    setProductos(productosActualizados);
    cargarVentas();

    // =========================
    // LIMPIAR FORMULARIO
    // =========================
    setCarrito([]);

    setBusqueda("");

    setVenta({
      vendedor: "",
      ciudad: "",
      cliente: "",
      tipoDocumento: "FVP",
      factura: ""
    });

  } catch (error) {

    console.error(error);

    alert("Error al registrar venta");

  }

};

    return (
  <div className="space-y-8 p-6">

    {/* HEADER */}
    <div>
      <h2 className="text-4xl font-extrabold text-white">
        💰 Ventas
      </h2>

      <p className="text-slate-400">
        Registrar ventas y descontar stock automáticamente
      </p>
    </div>

    {/* FORMULARIO */}
    <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800">

      <h3 className="text-2xl font-bold text-white mb-6">
        🧾 Registrar Venta
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* VENDEDOR */}
        <input
          name="vendedor"
          placeholder="Nombre del vendedor"
          value={venta.vendedor}
          onChange={handleChange}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
        />

        {/* CIUDAD */}
        <input
          name="ciudad"
          placeholder="Ciudad"
          value={venta.ciudad}
          onChange={handleChange}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
        />

        {/* CLIENTE */}
        <input
          name="cliente"
          placeholder="Cliente"
          value={venta.cliente}
          onChange={handleChange}
          className="w-full md:w-auto bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
        />

        {/* FACTURA */}

        {/* TIPO DOCUMENTO */}
<select
  name="tipoDocumento"
  value={venta.tipoDocumento}
  onChange={handleChange}
  className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
>

  <option value="FVP">
    Factura Venta (FVP)
  </option>

  <option value="DESP">
    Remisión Despacho (DESP)
  </option>

</select>
<input
  name="factura"
  placeholder="Número CM"
  
  value={venta.factura}
  onChange={handleChange}
  className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
/>
        </div>

        {/* PRODUCTO */}
        {/* BUSCADOR PRODUCTO */}
<div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mt-6">

  <h3 className="text-white font-bold mb-4">
    🔎 Buscar Producto
  </h3>

  <input
    type="text"
    placeholder="Buscar producto..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="w-full md:w-1/2 bg-slate-800 border border-slate-700 rounded-2xl p-3 text-white"
  />

  {/* RESULTADOS */}
  <div className="mt-4 max-h-64 overflow-y-auto space-y-2">

    {busqueda !== "" && productosFiltrados.map((p) => (

      <div
        key={p.id}
        className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center"
      >

        <div>
          <p className="text-white font-semibold">
            {p.nombre}
          </p>

          <p className="text-slate-400 text-sm">
            Stock: {p.cantidad}
          </p>
        </div>

        <div className="flex gap-2 items-center">

          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-20 bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
          />

          <button
            onClick={() => agregarAlCarrito(p)}
            className="bg-sky-500 hover:bg-sky-400 px-4 py-2 rounded-xl font-bold text-black"
          >
            ➕
          </button>

        </div>

      </div>

    ))}

  </div>

</div>

{/* CARRITO */}

{/* SERVICIOS MANUALES */}
<div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mt-6">

  <h3 className="text-white font-bold mb-4">
    🛠️ Agregar Servicio
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

    <input
      type="text"
      name="descripcion"
      placeholder="Descripción"
      value={servicioManual.descripcion}
      onChange={handleServicioChange}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-white"
    />

    <input
      type="number"
      name="precio"
      placeholder="Precio"
      value={servicioManual.precio}
      onChange={handleServicioChange}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-white"
    />

    <input
      type="number"
      name="cantidad"
      min="1"
      value={servicioManual.cantidad}
      onChange={handleServicioChange}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-white"
    />

    <button
      onClick={agregarServicio}
      className="bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-2xl"
    >
      ➕ Agregar Servicio
    </button>

  </div>

</div>

<div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden mt-6">

  <div className="p-4 border-b border-slate-800">
    <h3 className="text-white font-bold">
      🛒 Carrito
    </h3>
  </div>

  <table className="w-full">

    <thead className="bg-slate-900 text-slate-300">

      <tr>
        <th className="p-3 text-left">Producto</th>
        <th className="p-3 text-center">Cantidad</th>
        <th className="p-3 text-right">Precio</th>
        <th className="p-3 text-right">Subtotal</th>
        <th className="p-3 text-center">Acciones</th>
      </tr>

    </thead>

    <tbody>

      {carrito.length === 0 ? (

        <tr>
          <td colSpan="5" className="text-center p-6 text-slate-500">
            No hay productos agregados
          </td>
        </tr>

      ) : (

        carrito.map((item) => (

          <tr key={item.id} className="border-t border-slate-800">

            <td className="p-3 text-white">
              {item.nombre}
            </td>

            <td className="p-3 text-center text-white">
              {item.cantidad}
            </td>

            <td className="p-3 text-right text-white">
              {item.precio.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP"
              })}
            </td>

            <td className="p-3 text-right text-emerald-400 font-bold">

              {item.subtotal.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP"
              })}

            </td>

            <td className="p-3 text-center">

              <button
                onClick={() => eliminarDelCarrito(item.id)}
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-xl text-white"
              >
                ❌
              </button>

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

<div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 mt-6">

  <h3 className="text-2xl font-bold text-white">
    💰 Total General
  </h3>

  <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 mt-6">

  <h3 className="text-2xl font-bold text-white mb-6">
    💰 Resumen Factura
  </h3>

  {/* SUBTOTAL */}
  <div className="flex justify-between text-slate-300 mb-3">

    <span>Subtotal:</span>

    <span>
      {totalGeneral.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
      })}
    </span>

  </div>

  {/* IVA */}
  <div className="flex justify-between text-slate-300 mb-3">

    <span>IVA (19%):</span>

    <span>
      {iva.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
      })}
    </span>

  </div>

  {/* TOTAL */}
  <div className="border-t border-slate-700 pt-4 flex justify-between">

    <span className="text-2xl font-bold text-white">
      Total:
    </span>

    <span className="text-3xl font-extrabold text-emerald-400">

      {totalConIVA.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
      })}

    </span>

  </div>

</div>
</div>

      

     

      <button
        onClick={registrarVenta}
        className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-2xl"
      >
        💸 Finalizar Venta
      </button>

    </div>

    {ventaEditando && (

  <div className="bg-slate-950 rounded-3xl border border-yellow-600 p-6 mb-8">

    <h3 className="text-2xl font-bold text-yellow-400 mb-6">
      ✏️ Editar Factura
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <input
        name="cliente"
        value={formEditar.cliente}
        onChange={handleEditarChange}
        placeholder="Cliente"
        className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
      />

      <input
        name="vendedor"
        value={formEditar.vendedor}
        onChange={handleEditarChange}
        placeholder="Vendedor"
        className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
      />

      <input
        name="ciudad"
        value={formEditar.ciudad}
        onChange={handleEditarChange}
        placeholder="Ciudad"
        className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
      />

      <select
        name="tipoDocumento"
        value={formEditar.tipoDocumento}
        onChange={handleEditarChange}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
      >
        <option value="FVP">
          Factura Venta (FVP)
        </option>

        <option value="DESP">
          Remisión Despacho (DESP)
        </option>
      </select>

      <input
        name="factura"
        value={formEditar.factura}
        onChange={handleEditarChange}
        placeholder="Número factura"
        className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
      />

      
    </div>

    <h3 className="text-white font-bold mt-6 mb-3">
  📦 Productos de la factura
</h3>

<div className="space-y-2">
  {ventaEditando.carrito?.map((item, index) => (

    <div
      key={index}
      className="bg-slate-800 p-3 rounded-xl flex items-center gap-3"
    >

      <div className="flex-1 text-white">
        {item.nombre}
      </div>

      <input
        type="number"
        min="1"
        value={item.cantidad}
        onChange={(e) => {

          const nuevoCarrito =
            [...ventaEditando.carrito];

          nuevoCarrito[index].cantidad =
            Number(e.target.value);

          nuevoCarrito[index].subtotal =
            nuevoCarrito[index].cantidad *
            nuevoCarrito[index].precio;

         setVentaEditando({
  ...ventaEditando,
  carrito: nuevoCarrito
});

setFormEditar({
  ...formEditar,
  carrito: nuevoCarrito
});

        }}
        className="w-24 bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
      />

      <button
        onClick={() => {

          const nuevoCarrito =
            ventaEditando.carrito.filter(
              (_, i) => i !== index
            );

          setVentaEditando({
  ...ventaEditando,
  carrito: nuevoCarrito
});

setFormEditar({
  ...formEditar,
  carrito: nuevoCarrito
});

        }}
        className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-xl text-white"
      >
        ❌
      </button>

    </div>

  ))}
</div>

    

    

    <div className="flex gap-3 mt-6">

      <button
        onClick={guardarEdicion}
        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-2xl"
      >
        💾 Guardar
      </button>

      <button
        onClick={() => setVentaEditando(null)}
        className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl"
      >
        Cancelar
      </button>

    </div>

  </div>

)}
{/* HISTORIAL DE VENTAS */}
<div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden mt-8">

  <div className="p-4 border-b border-slate-800">

    <h3 className="text-2xl font-bold text-white">
      📊 Historial de Ventas
    </h3>

    <input
  type="text"
  placeholder="🔎 Buscar factura, cliente, vendedor o ciudad..."
  value={buscarVenta}
  onChange={(e) => setBuscarVenta(e.target.value)}
  className="mt-4 w-full md:w-1/2 bg-slate-900 border border-slate-700 rounded-2xl p-3 text-white"
/>

  </div>

  <table className="w-full">

    <thead className="bg-slate-900 text-slate-300">

      <tr>
        <th className="p-3 text-left">Factura</th>
        <th className="p-3 text-left">Cliente</th>
        <th className="p-3 text-left">Ciudad</th>
        <th className="p-3 text-left">Vendedor</th>
        <th className="p-3 text-center">Estado</th>
        <th className="p-3 text-center">Guía</th>
        <th className="p-3 text-center">
  Transportadora
</th>
        <th className="p-3 text-right">Total</th>
        <th className="p-3 text-center">Fecha</th>
        <th className="p-3 text-center">Acciones</th>
      </tr>

    </thead>

    <tbody>

      {ventas.length === 0 ? (

        <tr>
          <td
            colSpan="6"
            className="text-center p-6 text-slate-500"
          >
            No hay ventas registradas
          </td>
        </tr>

      ) : (

       ventasFiltradas.map((v) => (

          <tr
            key={v.idVenta}
            className="border-t border-slate-800"
          >

            <td className="p-3 text-white font-semibold">
              {v.tipoDocumento}-{v.factura}
            </td>

            <td className="p-3 text-white">
              {v.cliente}
            </td>

            <td className="p-3 text-white">
              {v.ciudad}
            </td>

            <td className="p-3 text-white">
              {v.vendedor}
            </td>

            <td className="p-3 text-center">

  <span
    className={`px-3 py-1 rounded-xl text-sm font-bold ${
      v.estado === "Despachado"
        ? "bg-emerald-500 text-black"
        : "bg-yellow-500 text-black"
    }`}
  >
    {v.estado}
  </span>

</td>

<td className="p-3 text-center text-white">

  {v.numeroGuia || "-"}

</td>

<td className="p-3 text-center text-white">

  {v.transportadora || "-"}

</td>

            <td className="p-3 text-right text-emerald-400 font-bold">

              {v.total.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP"
              })}

            </td>

            <td className="p-3 text-center text-slate-300">

              {new Date(v.fecha).toLocaleDateString("es-CO")}

            </td>

            <td className="p-3 text-center">

{v.estado !== "Despachado" ? (

  ventaDespacho === v.idVenta ? (

    <div className="flex flex-col gap-2">

      <select
        value={transportadora}
        onChange={(e) =>
          setTransportadora(e.target.value)
        }
        className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
      >

        <option value="">
          Seleccionar
        </option>

        <option>Interrapidisimo</option>
        <option>Servi Entrega</option>
        <option>Envia</option>
        <option>TCC</option>
        <option>Estelar Expres</option>
        <option>Z-Expres</option>
        <option>Los Cachacos</option>
        <option>Transportes Nariño</option>
        <option>Jhonatan</option>
        <option>Don Oscar</option>
        

      </select>

      <input
        type="text"
        placeholder="Número guía"
        value={numeroGuia}
        onChange={(e) =>
          setNumeroGuia(e.target.value)
        }
        className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
      />

      <button
        onClick={() => despacharVenta(v.idVenta)}
        className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-2 rounded-xl font-bold"
      >
        Guardar
      </button>

    </div>

  ) : (

    <button
      onClick={() => setVentaDespacho(v.idVenta)}
      className="bg-sky-500 hover:bg-sky-400 text-black px-4 py-2 rounded-xl font-bold"
    >
      🚚 Despachar
    </button>

  )

) : (

  <span className="text-emerald-400 font-bold">
    ✅ Enviado
  </span>

)}

<div className="mt-2 flex gap-2 justify-center">

  <button
    onClick={() => editarVenta(v)}
    className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-xl font-bold"
  >
    ✏️ Editar
  </button>

  <button
    onClick={() => eliminarFactura(v.idVenta)}
    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-xl font-bold"
  >
    🗑️
  </button>

</div>

</td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>
  </div>
);
}
export default Ventas;