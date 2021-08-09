

const generateUser = (nombre, apellidos, email, telefono = '', numeroC, carrera, type, activo, prestamos=[], uid) => {
    return {
        nombre, 
        apellidos,
        email, 
        telefono, 
        numeroC, 
        carrera, 
        type, 
        activo, 
        prestamos,
        uid
    };
};


module.exports = {
    generateUser
}