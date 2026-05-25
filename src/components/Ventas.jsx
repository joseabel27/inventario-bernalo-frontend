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
const [buscarVenta, setBuscarVenta] = useState("");

const cargarVentas = () => {

  fetch("http://localhost:3000/api/ventas")
    .then((res) => res.json())
    .then((data) => setVentas(data))
    .catch((err) => console.error(err));

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
        <th className="p-3 text-right">Total</th>
        <th className="p-3 text-center">Fecha</th>
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

            <td className="p-3 text-right text-emerald-400 font-bold">

              {v.total.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP"
              })}

            </td>

            <td className="p-3 text-center text-slate-300">

              {new Date(v.fecha).toLocaleDateString("es-CO")}

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