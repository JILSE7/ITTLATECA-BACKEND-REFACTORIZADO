//Definiendo nuestro esquema de usuarios;
const {Schema, model} = require('mongoose');


const prestamoSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    userAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    libro: {
        type: Schema.Types.ObjectId,
        ref: 'Libro',
        // required: true
    },
    fechaRetiro: {
        type: String,
        required: true
    },
    fechaDevolucion: {
        type: String,
        required: true
    },
    devolucion: {
        type: Boolean,
        default: false
    },
    observaciones: {
        type: String,
        default: 'Prestamo'
    },
    activo: {
        type: Boolean,
        default:true
    }
})

//Editandop el schema
prestamoSchema.method('toJSON', function(){
    const {__v, _id, ...prestamo} = this.toObject();
    prestamo.idPrestamo = _id;
    return prestamo;
})

//exportando el modelo
module.exports = model('Prestamo', prestamoSchema)