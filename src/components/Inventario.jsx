import { useEffect, useState } from "react";

const API = "http://localhost:3000";

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
      .then(data => setProductos(data))
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
            <option value="Basculas">Basculas</option>
            <option value="Balanzas">Balanzas</option>
            <option value="Celdas">Celdas</option>
            <option value="Repuestos">Repuestos</option>
          </select>

          <input name="precio" type="number" placeholder="Precio" onChange={handleChange} className={inputStyle} required />
          <input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} className={inputStyle} required />

          <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} className={inputStyle} required />
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
            {productos.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-slate-500">
                  No hay productos
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr
                  key={p.id}
                  className={`border-t border-slate-800 hover:bg-slate-900 ${
                    p.cantidad <= p.stockMinimo ? "bg-red-900/40" : ""
                  }`}
                >
                  <td className="p-3">#{p.id}</td>
                  <td className="p-3 text-white font-semibold">{p.nombre}</td>
                  <td className="p-3">{p.categoria}</td>
                  <td className="p-3 text-right">${p.precio}</td>

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