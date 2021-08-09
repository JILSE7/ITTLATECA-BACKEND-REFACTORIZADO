//Definiendo nuestro esquema de usuarios;
const {Schema, model} = require('mongoose');


const libroSchema = Schema({
   nombre: {
       type: String,
       required: true
   },
   autor: {
       type: String,
       required: true
   },
   editorial : {
       type: String,
       required: true
   },
   edicion: {
    type: String,
    required: false
   },
   categoria: {
       type: Array,
       required: true
   },
   existencias: {
       type: String,
       required: true
   },
   disponibles: {
        type: String,
        required: true
   },
   ubicacion: {
       type: String,
       required: true
   },
    prestamos:{//si existe algun libro prestado, mostrara quien lo tiene
       type: [Schema.Types.ObjectId],
       ref: 'Prestamo',
       default:[]
     },
     activo: {
         type: Boolean,
         required: true,
         default: true
     }

});
//Editandop el schema
libroSchema.method('toJSON', function(){
    const {__v, _id, ...libro} = this.toObject();
    libro.idLibro = _id;
    return libro;
})

//exportando el modelo
module.exports = model('Libro', libroSchema)