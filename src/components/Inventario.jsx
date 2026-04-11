// MOSTRARA LOS PRODUCTOS DEL INVENTARIO

import { useEffect, useState } from "react";

function Inventario() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/inventario")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos del backend:", data);
        setProductos(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h2>Inventario</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Cantidad</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventario;