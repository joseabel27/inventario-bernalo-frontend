// MENU SUPERIOR DE NAVEGACION

import React from "react";
import {Link} from  "react-router-dom";

function Navbar(){

    return (

        <nav className ="navbar">
            <h1>Inventario Bernalo</h1>
            <ul>
                <li><Link to="/">Inventario</Link></li>
                <li><Link to="/ventas">Ventas</Link></li>
                <li><Link to="/devoluciones">Devoluciones</Link></li>
            
            </ul>
        </nav>
    );
}

export default Navbar;