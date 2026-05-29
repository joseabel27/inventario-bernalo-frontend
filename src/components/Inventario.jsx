// MOSTRARA LOS PRODUCTOS DEL INVENTARIO

import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Inventario() {
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
  nombre: "",
  categoria: "",
  precio: "",
  cantidad: "",
  ubicacion: "",
  stockMinimo: ""
});

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = (e) => {
  e.preventDefault();

  fetch(`${BASE_URL}/api/inventario`, {
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
    .then((res) => res.json())
    .then(() => {
      alert("Producto agregado ✅");

      return fetch(`${BASE_URL}/api/inventario`);
    })
    .then((res) => res.json())
    .then((data) => setProductos(data))
    .catch((error) => console.error("Error:", error));
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
const eliminar = (id) => {
  fetch(`${BASE_URL}/api/inventario/${id}`, {
    method: "DELETE"
  })
    .then((res) => res.json())
    .then(() => {
      alert("Producto eliminado ❌");

      // Recargar lista
      return fetch(`${BASE_URL}/api/inventario`);
    })
    .then((res) => res.json())
    .then((data) => setProductos(data))
    .catch((error) => console.error("Error:", error));
};
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

  useEffect(() => {
    fetch(`${BASE_URL}/api/inventario`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos del backend:", data);
        setProductos(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  console.log("Renderizando componente Inventario");

  return (
    <div className="space-y-8">
      {/* Título */}
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-white mb-2">📦 Inventario</h2>
        <p className="text-slate-400">Gestiona todos tus productos con un estilo elegante y oscuro</p>
      </div>

      {/* Formulario */}
      <div className="bg-slate-950 rounded-3xl shadow-2xl shadow-black/20 p-6 border border-slate-800">
        <h3 className="text-2xl font-bold text-white mb-6">➕ Agregar Producto</h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            name="nombre" 
            placeholder="Nombre del producto" 
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            required
          />
          <input 
            name="categoria" 
            placeholder="Categoría" 
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            required
          />
          <input 
            name="precio" 
            placeholder="Precio" 
            type="number"
            step="0.01"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            required
          />
          <input 
            name="cantidad" 
            placeholder="Cantidad" 
            type="number"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            required
          />
          <input 
            name="ubicacion" 
            placeholder="Ubicación" 
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            required
          />
          <input 
            name="stockMinimo" 
            placeholder="Stock Mínimo" 
            type="number"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            required
          />

          <button 
            type="submit"
            className="md:col-span-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            ✅ Agregar Producto
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-slate-950 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-slate-800">
        <div className="px-6 py-5 bg-slate-900/90 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white">📊 Listado de Productos</h3>
          <p className="text-sm text-slate-400">Total: {productos.length} productos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Categoría</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Precio</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">Cantidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Ubicación</th>       
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">Stock Min.</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No hay productos en el inventario. ¡Agrega uno!
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">#{p.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-semibold">{p.nombre}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-sky-300">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-200 font-semibold text-right">${p.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.cantidad <= p.stockMinimo 
                          ? 'bg-red-600 text-red-100' 
                          : 'bg-emerald-600 text-emerald-100'
                      }`}>
                        {p.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{p.ubicacion}</td>
                    <td className="px-6 py-4 text-sm text-center text-slate-300">{p.stockMinimo}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button 
                        onClick={() => eliminar(p.id)}
                        className="rounded-2xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
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
    </div>
  );
}

export default Inventario;