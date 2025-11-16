// Mostrara una alerta visual si un producto tiene la cantidad igual o menor al Stock Minimo

import React from "react";

function AlertaStockMinimo({producto}){

    if (producto.cantidad > producto.StockMinimo)
        return null;

    return (

        <div className="alerta-Stock">
            El producto <b>{producto.nombre}</b> tiene bajo Stock({producto.cantidad}/{producto.StockMinimo})
        </div>
    );
}

export default AlertaStockMinimo;