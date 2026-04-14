// MOSTRARA LOS PRODUCTOS DEL INVENTARIO

import { useEffect, useState } from "react";

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

  fetch("http://localhost:3000/api/inventario", {
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

      return fetch("http://localhost:3000/api/inventario");
    })
    .then((res) => res.json())
    .then((data) => setProductos(data))
    .catch((error) => console.error("Error:", error));
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
const eliminar = (id) => {
  fetch(`http://localhost:3000/api/inventario/${id}`, {
    method: "DELETE"
  })
    .then((res) => res.json())
    .then(() => {
      alert("Producto eliminado ❌");

      // Recargar lista
      return fetch("http://localhost:3000/api/inventario");
    })
    .then((res) => res.json())
    .then((data) => setProductos(data))
    .catch((error) => console.error("Error:", error));
};
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

  useEffect(() => {
    fetch("http://localhost:3000/api/inventario")
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
        <h2 className="text-4xl font-bold text-gray-900 mb-2">📦 Inventario</h2>
        <p className="text-gray-600">Gestiona todos tus productos de forma eficiente</p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">➕ Agregar Producto</h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            name="nombre" 
            placeholder="Nombre del producto" 
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input 
            name="categoria" 
            placeholder="Categoría" 
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input 
            name="precio" 
            placeholder="Precio" 
            type="number"
            step="0.01"
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input 
            name="cantidad" 
            placeholder="Cantidad" 
            type="number"
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input 
            name="ubicacion" 
            placeholder="Ubicación" 
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input 
            name="stockMinimo" 
            placeholder="Stock Mínimo" 
            type="number"
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          <button 
            type="submit"
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ✅ Agregar Producto
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">📊 Listado de Productos</h3>
          <p className="text-sm text-gray-600">Total: {productos.length} productos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>       
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Stock Min.</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No hay productos en el inventario. ¡Agrega uno!
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">#{p.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{p.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold text-right">${p.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.cantidad <= p.stockMinimo 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {p.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.ubicacion}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">{p.stockMinimo}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button 
                        onClick={() => eliminar(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-xs font-semibold"
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