// MOSTRARA LAS VENTAS REALIZADAS

import React, {useState,useEffect} from "react";

function Ventas(){

    const [ventas, setVentas] = useState([]);

    useEffect(()=>{

        //Aqui cargaremos la venta desde el backend (GET / api/ventas)

    console.log("Cargar Ventas");
    },[]);

    return (
        <div>
            <h2>Registro de Ventas</h2>
            <button>Registrar Venta</button>
            <table>
                <thead>
                    <tr>
                        <td>ID Venta</td>
                        <td>Producto</td>
                        <td>Cantidad</td>
                        <td>Total</td>
                        <td>Vendedor</td>
                        <td>Fecha</td>
                    </tr>
                </thead>
                <tbody>
                    {ventas.length === 0?(

                        <tr><td colSpan="6">No hay ventas registradas</td></tr>
                    ):(

                        ventas.map((v)=>(
                            <tr Key={v.idVenta}>
                                <td>{v.idVenta}</td>
                                <td>{v.producto}</td>
                                <td>{v.cantidad}</td>
                                <td>{v.total}</td>
                                <td>{v.vendedor}</td>
                                <td>{new Date(v.fecha).toLocalString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Ventas;