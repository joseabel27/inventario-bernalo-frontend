// MOSTRARA LOS PRODUCTOS DEL INVENTARIO

import React, { useState, useEffect } from "react";

function Inventario() {

    const [productos, setProductos] = useState([]);

    useEffect(() => {

        // Aquí mas adelante haremos la peticion del backend ( Get / api /inventario)
        console.log("Cargar Inventario...");
    }, []);

    return (
        <div>
            <h2>Inventario Actual</h2>
            <button>Agregar Producto</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Ubicacion</th>
                        <th>Stock Minimo</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.length === 0 ? (
                        <tr><td colSpan="6">Sin Productos Disponibles</td></tr>
                    ) : (
                        productos.map((p) => (
                            <tr Key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>{p.categoria}</td>
                                <td>{p.cantidad}</td>
                                <td>{p.precio}</td>
                                <td>{p.ubicacion}</td>
                                <td>{p.stockMinimo}</td>
                                <td>
                                    <button>Editar</button>
                                    <button>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Inventario;
