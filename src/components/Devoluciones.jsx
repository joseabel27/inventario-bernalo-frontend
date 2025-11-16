// MOSTRARA LAS DEVOLUCIONES REALIZADAS

import React, { useState, useEffect } from "react";

function Devoluciones() {

    const [devoluciones, setDevoluciones] = useState([]);

    useEffect(() => {

        // Aqui cargaremos las devoluciones  desde el backend (GET/api/devoluciones)

        console.log("Cargar Devoluciones...");
    }, []);

    return (
        <div>
            <h2>Registro de Devoluciones</h2>
            <button> Registrar Devolucion </button>
            <table>
                <thead>
                    <tr>
                        <th>ID Producto</th>
                        <th>Motivo</th>
                        <th>Cantidad</th>
                        <th>Vendedor</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {devoluciones.legnth === 0 ? (

                        <tr><td colSpan="5">No hay devoluciones registrada</td></tr>
                    ) : (
                        devoluciones.map((d, i) => (

                            <tr key={i}>
                                <td>{d.i}</td>
                                <td>{d.motivo}</td>
                                <td>{d.cantidad}</td>
                                <td>{d.vendedor}</td>
                                <td>{new Date(d.fecha).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Devoluciones;


