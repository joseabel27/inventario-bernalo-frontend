// Aca configuramos las rutas principales del sistema.

import React from "react";
import {Routes, Route} from "react-router-dom";

import Navbar from "./components/Navbar..jsx";
import Inventario from "./components/Inventario.jsx";
import Ventas from "./components/Ventas.jsx";
import Devoluciones from "./components/Devoluciones.jsx";

function App(){

  return (
    <>
    {/*Barra de Navegacion*/}
    <Navbar/>

    {/*Contenido segun la ruta*/}

    <div className="container">
      <Routes>
        <Route path="/" element={<Inventario/>}/>
        <Route path="/ventas" element = {<Ventas/>}/>
        <Route path="/devoluciones" element = {<Devoluciones/>}/>
      </Routes>
    </div>
    </>
  );
}

export default App;