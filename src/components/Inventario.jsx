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
    <div>
      <h2>Inventario</h2>
      <h3>Agregar Producto</h3>

<form onSubmit={handleSubmit}>
  <input name="nombre" placeholder="Nombre" onChange={handleChange} />
  <input name="categoria" placeholder="Categoría" onChange={handleChange} />
  <input name="precio" placeholder="Precio" onChange={handleChange} />
  <input name="cantidad" placeholder="Cantidad" onChange={handleChange} />
  <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} />
  <input name="stockMinimo" placeholder="Stock Mínimo" onChange={handleChange} />

  <button type="submit">Agregar</button>
</form>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Ubicación</th>       
            <th>Stock Mínimo</th>  
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>{p.precio}</td>
              <td>{p.cantidad}</td>
              <td>{p.ubicacion}</td>
              <td>{p.stockMinimo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventario;