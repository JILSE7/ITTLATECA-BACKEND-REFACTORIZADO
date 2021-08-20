//const moment = require('moment');
//Express
const express = require('express');
//DB CONEXION
const dbConexion = require('./database/config');
//File
const fileUpload = require('express-fileupload');

//Habilitacion de CORS
const cors = require('cors');

//variables de entorno
require('dotenv').config();

//crear el sevidor de express
const app = express();

//conexion a la base de datos
dbConexion()

//CORS
app.use(cors());

// Directorio publico
app.use(express.static('public'))

//Lectura y parse del body
app.use(express.json());

// Note that this option available for versions 1.0.0 and newer. 
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


//Routes
app.use('/ITTLATECA', require('./routes'))

app.listen(process.env.PORT, (req,res)=>{
    console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
})