//========================================================
// CONFIGURACION BASE DEL BACKEND
//========================================================

// Cambiar la URL si tu backend usa otro puerto.
// Vite expone variables de entorno prefijadas con VITE_.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//====================================================
// FUNCIONES AUXILIARES  DE SOLICITUD DE HTTP (FETCH)
//====================================================

/* Hace una solicitud GET al Backend */

async function get(path){

    try{

    const res = await fetch(`${API_URL}${path}`);

    if (!res.ok) throw new Error(`Error GET${path}`);
    return await res.json();

    }catch (error){

        console.error(error);
        throw error;
    }
}

//=======================
// SOLICITUD POST
//=======================

async function post(path, data){

    try{

        const res = await fetch(`${API_URL}${path}`,{

            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)     
        });

        if(!res.ok) throw new Error(`Error POST ${path}`);
        return await res.json();

    } catch (error){

        console.error(error);
        throw error;
    }
}

//===============================
// SOLICITUD PUT
//===============================

async function put(path, data){

    try{
        const res = await fetch(`${API_URL}${path}`,{
        method:"PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`Error PUT ${path}`);
        return await  res.json();
    } catch (error){

        console.error(error);
        throw error;
    }
}


//====================
// SOLICITUD DELETE
//====================

async function remove(path){

    try{

        const res = await fetch(`${API_URL}${path}`, { method:"DELETE" });
        if (!res.ok) throw new Error(`Error DELETE ${path}`);
        return await res.json();
    }catch (error){

        console.error(error);
        throw  error;
    }
}

//===============================================================
// VALIDACIONES GENERALES ( usadas antes de enviar al backend)
//===============================================================

/* Validar que un producto tenga campos correctos */

export function validarProducto(data){

    if (!data.nombre || data.nombre.trim()=== "")
        throw new Error("El nombre es obligatorio");

    if (isNaN(data.precio)|| data.precio <=0)
        throw new Error("El precio debe ser un numero valido");

    if (isNaN(data.cantidad)|| data.cantidad < 0)
        throw new Error("La cantidad debe ser un numero valido");

    if (isNaN(data.stockMinimo)|| data.stockMinimo <0)
        throw new Error("El Stock Minimo debe ser un numero valido");

    return true;
}

//================================================
// AVISO SI EL PRODUCTO ESTA BAJO DE STOCK MINIMO
//================================================

export function validarStockMinimo(producto){

    return producto.cantidad <= producto.stockMinimo;
}

//==================================================================
// FUNCIONES PRINCIPALES DEL INVENTARIO (Conectar React con Backend)
//==================================================================

/* Obtener todos */

export async function getProductos(){

    return await get("/inventario");
}

//=============================
// BUSCAR POR ID
//=============================

export async function getProductoByid(id){
    return await get(`/inventario/${id}`);
} 


//===================
// BUSCAR POR NOMBRE
//===================

export async function buscarPorNombre(nombre){

    return await get(`/inventario/buscar/${nombre}`);
}


//=================================
// CREAR UN PRODUCTO
//=================================


export async function crearProducto(data){
    validarProducto(data);
    return await post("/inventario", data);
}


//=====================================
// ACTUALIZAR UN PRODUCTO
//=====================================

export async function actualizarProducto(id, data){

    validarProducto(data);
    return await put(`/inventario/${id}`,data);

}

//======================
// ELIMINAR PRODUCTO
//======================

export async function eliminarProducto(id){

    return await remove(`/inventario/${id}`);
}