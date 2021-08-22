const {response} = require('express');
//Modelos
const { Usuario, Prestamo, Libro } = require("../models");


//Insertando nuevo prestamo
const nuevoPrestamo = (userId, adminId, idLibro, body) => {

    return new Promise(async(resolve, reject) => {
        const   user = await Usuario.findById(userId);
        //1.- Veificando que el usuario exista y este activo
        if(!user){
            return reject(`Este usuario no existe en la base de datos`);
        }else if(!user.activo){
            return reject(`El usuario ${user.nombre} no esta activo en la base`);
        };

        //2.-Verificando que no se repitan los prestamos
        const prestamoV = await Prestamo.findOne({"usuario": userId, "libro" :idLibro, "devolucion": false});
        console.log(prestamoV); 
        if(prestamoV){
            return reject(`El usuario ${user.nombre} ya ha hecho el retiro de este libro`);
        }

        //Extrayendo las existencias del libro
        const libroExistencias = await Libro.findById(idLibro);
        
        if(!libroExistencias){
            return  reject(`El Libro con id ${idLibro} no esta activo en la base`);
            
        }else if(libroExistencias.disponibles == 0 || libroExistencias.existencias == 0){
            return  reject(`Lo sentimos, ya no quedan libros disponibles de este titulo ${libroExistencias.nombre}`);
        };
        console.log(libroExistencias);
        const newPrestamo = {
            usuario : userId,
            userAdmin: adminId,
            libro: idLibro,
           ...body
        }
        console.log(newPrestamo);

        //Nueva Instancia del prestamo
        const prestamo = new Prestamo(newPrestamo);
        
        //Grabando el prestamo en la bd
        await prestamo.save();

        //actualizando los libros disponibles del libro
        await Libro.findByIdAndUpdate(idLibro,{"disponibles": String(Number(libroExistencias.disponibles) - 1), "prestamos" : [...libroExistencias.prestamos, prestamo._id] },{useFindAndModify:false})
        await Usuario.findByIdAndUpdate(userId, {prestamos: [...user.prestamos, prestamo._id]});


        resolve(prestamo);
    });
};


const actualizarPrestamo = async( res=response, prestamoId, body) =>{
     try { 

        const prestamo = await Prestamo.findById(prestamoId); //buscando el prestamo
        console.log(prestamo);
        if(!prestamo){//si no existe el prestamo
             return res.status(404).json({
                 ok: false,
                 msg: "Este prestamo no esta registrado en la base de datos, favor de verificar el id"
             })
         }

         //Nuevo prestamo actualizado
         const nuevoPrestamo = {
             ...body
            }

            //Extrayendo los prestamos del usuario
            const {prestamos: prestamosUsuario} = await Usuario.findById(prestamo.usuario).select('prestamos')
            console.log('prestamos del usuario', prestamosUsuario); 
            
            
            //Si se quiere realizar la devolucion del libro
            if(nuevoPrestamo.devolucion){
                //Extrayendo info del libro
                const libro = await Libro.findById(prestamo.libro);
                const {disponibles, existencias} = libro;
                
                
                if( disponibles >= existencias){ //Si ya no hay mas
                    return res.status(404).json({
                        ok: false,
                        msg: "Ya no puedes realizar mas devoluciones, porque ya no tienes mas existencias de este titulo"
                    })
                }
                //Devolviendo libro
                await Libro.findByIdAndUpdate(prestamo.libro,{ "disponibles": String(Number(disponibles) + 1),  "prestamos" : libro.prestamos.filter(prestamo => prestamo  != prestamoId )});
                
            //Quitando el prestamo al usuario
            const newPrestamosUsuario = prestamosUsuario.filter(prestamo => prestamo != prestamoId);
            //Actualizando los prestamos del usuario
            await Usuario.findByIdAndUpdate(prestamo.user, {prestamos: newPrestamosUsuario});
        } 


        //ACTUALIZANDO EL PRESTAMO
        const prestamoActualizado = await Prestamo.findByIdAndUpdate(prestamoId,nuevoPrestamo, {new: true, useFindAndModify: true})
        console.log('prestamoActualizado', prestamoActualizado);
        res.status(200).json({
            ok: true,
             evento: prestamoActualizado
         })
         
        } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Problema interno, Verifique el id del libro, si el problema persiste hable con el administrador'
        })
     }

};




const eliminarPrestamo = async( res=response, prestamoId, userId, libroId) => {

    return new Promise(async(resolve, reject) => {

        const [user, prestamo, libro] = await Promise.all([
            Usuario.findById(userId),
            Prestamo.findById(prestamoId),
            Libro.findById(libroId)
        ]);

       //1.- Veificando que el usuario, prestamo y libro existan
        if(!user){
            return reject(`Este usuario no existe en la base de datos`);
        };
        if(!prestamo){
            return reject(`Este prestamo no existe en la base`);
        };
        if(!libro){
            return reject(`Este libro no existe en la base`);
        };


        const {devolucion} = prestamo;
        
        //Extrayendo los prestamos del usuario
        const {prestamos: prestamosUsuario} = user
        console.log('prestamos del usuario', prestamosUsuario); 

         //Extrayendo info del libro
         const {disponibles, existencias} = libro;
         
         if(devolucion){
            //No tienes que devolver al stock
            console.log('no tengo que hacer devolver el libro al stock porque ya esta devuelto, pero si quitarselo al usuario');
            const newPrestamosUsuario = prestamosUsuario.filter(prestamo => prestamo != prestamoId);
            console.log('quitando el prestamo', newPrestamosUsuario);
            await Usuario.findByIdAndUpdate( userId, {prestamos: newPrestamosUsuario});
        }else{
            if(((disponibles*1) + 1) > (existencias*1)){
                console.log('no puedo hacer el borrado');
                return reject('El numero disponibles de los libros no pueden superar las existencias de un libro')
            }else{
                console.log('puedo hacer el borrado');
                console.log(libro.prestamos);
                console.log(libro.prestamos.filter(prestamo => prestamo  != prestamoId) );

                    //Devolviendo libro y quitandole el prestamo
                    await Libro.findByIdAndUpdate(libroId,{ "disponibles": String(Number(disponibles) + 1),  "prestamos" : libro.prestamos.filter(prestamo => prestamo  != prestamoId )});
                
                    //Quitando el prestamo al usuario y actualizando
                    const newPrestamosUsuario = prestamosUsuario.filter(prestamo => prestamo != prestamoId);
                    await Usuario.findByIdAndUpdate( userId, {prestamos: newPrestamosUsuario});
                    console.log('quitando el prestamo', newPrestamosUsuario);

            }
        } 
        
        resolve(true);
    });
                
};


 




module.exports = {
    nuevoPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
}