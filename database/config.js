const mongoose = require('mongoose');


const dbConexion = async() => {
    try {
            await mongoose.connect(process.env.DB_CN, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })

            console.log('> DATABASE ONLINE <');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos');
    }

}


module.exports = dbConexion;