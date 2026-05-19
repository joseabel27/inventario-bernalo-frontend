import { useEffect, useState, useRef } from "react";



const API = "http://localhost:3000";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
const [productoEditando, setProductoEditando] = useState(null);
  const fichaRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    cantidad: "",
    ubicacion: "",
    stockMinimo: ""
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const productosFiltrados = productos.filter((p) =>
  p.nombre.toLowerCase().includes(busqueda.toLowerCase())
);
  const generarUbicaciones = () => {
  const letras = "ABCDEFGHIJ".split("");
  const ubicaciones = [];

  letras.forEach((letra) => {
    for (let i = 1; i <= 3; i++) {
      ubicaciones.push(`Estante ${letra}${i}`);
    }
  });

  return ubicaciones;
};

const ubicaciones = generarUbicaciones();

  // =========================
  // ESTILOS
  // =========================
  const inputStyle =
    "w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

  // =========================
  // INPUTS
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* GUARDAR EDICIONES */
  const guardarEdicion = () => {
  fetch(`http://localhost:3000/api/inventario/${productoEditando.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(productoEditando)
  })
    .then((res) => res.json())
    .then(() => {
      alert("Producto actualizado ✅");

      setModoEdicion(false);
      setProductoSeleccionado(null);

      return fetch("http://localhost:3000/api/inventario");
    })
    .then((res) => res.json())
    .then((data) => setProductos(data))
    .catch((err) => console.error(err));
} 

  // =========================
  // AGREGAR PRODUCTO
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (productos.some(p => p.nombre.toLowerCase() === form.nombre.toLowerCase())) {
      alert("Producto ya existe");
      return;
    }

    fetch(`${API}/api/inventario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        precio: Number(form.precio),
        cantidad: Number(form.cantidad),
        stockMinimo: Number(form.stockMinimo)
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Producto agregado ✅");
        return fetch(`${API}/api/inventario`);
      })
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error(err));
  };

  // =========================
  // ELIMINAR PRODUCTO
  // =========================
  const eliminar = (id) => {
    fetch(`${API}/api/inventario/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        alert("Producto eliminado ❌");
        return fetch(`${API}/api/inventario`);
      })
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error(err));
  };

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {
    fetch(`${API}/api/inventario`)
      .then(res => res.json())
      .then((data) => {
  console.log("DATA COMPLETA:", JSON.stringify(data, null, 2)); // 👈 EXACTAMENTE AQUÍ
  setProductos(data);
})
      .catch(err => console.error(err));
  }, []);
  

  return (
    <div className="space-y-8 p-6">

      {/* HEADER */}
      <div>
        <h2 className="text-4xl font-extrabold text-white">📦 Inventario</h2>
        <p className="text-slate-400">Gestiona tus productos fácilmente</p>
      </div>

      {/* FORMULARIO */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <h3 className="text-2xl text-white font-bold mb-4">➕ Agregar Producto</h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="nombre" placeholder="Nombre" onChange={handleChange} className={inputStyle} required />

          <select name="categoria" onChange={handleChange} className={inputStyle} required>
            <option value="">Categoría</option>
            <option value="Grameras">Grameras</option>
            <option value="Basculas">Balanzas</option>
            <option value="Balanzas">Basculas</option>
            <option value="Dinamometros">Dinamómetros</option>
            <option value="Celdas">Celdas</option>
            <option value="Repuestos">Repuestos</option>
            <option value="Horeka">Horeka</option>
          </select>

          <input name="precio" type="number" placeholder="Precio" onChange={handleChange} className={inputStyle} required />
          <input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} className={inputStyle} required />

          <select name="ubicacion" onChange={handleChange} className={inputStyle} required>
  <option value="">Selecciona ubicación</option>

  {ubicaciones.map((ubi) => (
    <option key={ubi} value={ubi}>
      {ubi}
    </option>
  ))}
</select>
          <input name="stockMinimo" type="number" placeholder="Stock mínimo" onChange={handleChange} className={inputStyle} required />

          <button className="md:col-span-2 bg-sky-500 hover:bg-sky-400 text-black font-bold py-3 rounded-2xl">
            ✅ Agregar Producto
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-white font-bold">📊 Productos</h3>
          <p className="text-slate-400">Total: {productos.length}</p>
        </div>

<div className="mb-4">
  <div className="relative">
    <input
      type="text"
      placeholder="🔍 Buscar producto..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
    />

    {/* Icono */}
    <span className="absolute right-4 top-3 text-slate-400">
      🔎
    </span>
  </div>
</div>
{/* ******************SELECCION DE PRODUCTO PARA MOSTRAR FICHA*************************************** */}
{productoSeleccionado && (
  <div ref={fichaRef}className="bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-xl mb-6">

    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl text-white font-bold">
        📦 {productoSeleccionado.nombre}
      </h3>

      <button
        onClick={() => setProductoSeleccionado(null)}
        className="text-red-400 hover:text-red-300"
      >
        ✖
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* IMAGEN */}
      <div className="flex justify-center">
        <img
  src={productoSeleccionado.imagen || "https://via.placeholder.com/250"}
  alt={productoSeleccionado.nombre}
  className="w-full max-w-xs md:max-w-sm h-auto object-contain rounded-2xl border border-slate-700"
/>
      </div>

      {/* INFO */}
      <div className="space-y-2 text-slate-300">
        <p><strong>ID:</strong> {productoSeleccionado.id}</p>
        <p><strong>Categoría:</strong> {productoSeleccionado.categoria}</p>
        <p><strong>Precio:</strong><p>
  {productoSeleccionado.precio.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP"
  })}
</p></p>

        <p><strong>Cantidad:</strong> {productoSeleccionado.cantidad}</p>
        <p><strong>Ubicación:</strong> {productoSeleccionado.ubicacion}</p>
        <p><strong>Stock mínimo:</strong> {productoSeleccionado.stockMinimo}</p>
            <button
  onClick={() => {
    setModoEdicion(true);
    setProductoEditando(productoSeleccionado);
  }}
  className="bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-xl text-black font-bold mt-4"
>
  ✏️ Editar
</button>
      </div>
  

    </div>
    
  </div>
)}

{/* FORMULARIO EDITAR PRODUCTO */}

{modoEdicion && productoEditando && (
  <div className="bg-slate-950 rounded-3xl p-6 mt-6 border border-slate-800">
    <h3 className="text-2xl text-white font-bold mb-4">✏️ Editar Producto</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* NOMBRE */}
      <input
        value={productoEditando.nombre}
        onChange={(e) =>
          setProductoEditando({ ...productoEditando, nombre: e.target.value })
        }
        className={inputStyle}
      />

      {/* CATEGORIA */}
      <select
        value={productoEditando.categoria}
        onChange={(e) =>
          setProductoEditando({ ...productoEditando, categoria: e.target.value })
        }
        className={inputStyle}
      >
        <option value="Basculas">Basculas</option>
        <option value="Balanzas">Balanzas</option>
        <option value="Celdas">Celdas</option>
        <option value="Repuestos">Repuestos</option>
        <option value="Horeca">Horeca</option>
      </select>

      {/* PRECIO */}
      <input
        type="number"
        value={productoEditando.precio}
        onChange={(e) =>
          setProductoEditando({
            ...productoEditando,
            precio: Number(e.target.value)
          })
        }
        className={inputStyle}
      />

      {/* CANTIDAD */}
      <input
        type="number"
        value={productoEditando.cantidad}
        onChange={(e) =>
          setProductoEditando({
            ...productoEditando,
            cantidad: Number(e.target.value)
          })
        }
        className={inputStyle}
      />

      {/* UBICACION */}
      <input
        value={productoEditando.ubicacion}
        onChange={(e) =>
          setProductoEditando({
            ...productoEditando,
            ubicacion: e.target.value
          })
        }
        className={inputStyle}
      />

      {/* STOCK MINIMO */}
      <input
        type="number"
        value={productoEditando.stockMinimo}
        onChange={(e) =>
          setProductoEditando({
            ...productoEditando,
            stockMinimo: Number(e.target.value)
          })
        }
        className={inputStyle}
      />
    </div>

    {/* BOTONES */}
    <div className="mt-6 flex gap-3">
      <button
        onClick={guardarEdicion}
        className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-2xl font-bold text-black"
      >
        💾 Guardar
      </button>

      <button
        onClick={() => setModoEdicion(false)}
        className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-2xl text-white"
      >
        Cancelar
      </button>
    </div>
  </div>
)}
{/* ***************************************************************************************/}
        <table className="w-full">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-right">Precio</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3">Ubicación</th>
              <th className="p-3">Stock Min</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

        
           <tbody>
  {productosFiltrados.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center p-6 text-slate-500">
        🔍 No se encontraron productos
      </td>
    </tr>
  ) : (
    productosFiltrados.map((p) => (
               <tr
  key={p.id}
 onClick={() => {
  setProductoSeleccionado(p);
  setTimeout(() => {
    fichaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 100);
}}
  className={`cursor-pointer border-t border-slate-800 hover:bg-slate-900 ${
    p.cantidad <= p.stockMinimo ? "bg-red-900/40" : ""
  }`}
>
                  <td className="p-3">#{p.id}</td>
                  <td className="p-3 text-white font-semibold">{p.nombre}</td>
                  <td className="p-3">{p.categoria}</td>
                  <td className="p-3 text-right">
  {p.precio.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP"
  })}
</td>

                  {/* CANTIDAD CON ALERTA */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.cantidad <= p.stockMinimo
                          ? "bg-red-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {p.cantidad}
                    </span>
                  </td>

                  <td className="p-3">{p.ubicacion}</td>
                  <td className="p-3 text-center">{p.stockMinimo}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => eliminar(p.id)}
                      className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-white text-sm"
                    >
                      🗑️ Eliminar
                    </button>
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

export default Inventario;