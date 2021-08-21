const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadImage = async(pathImagen) => {
    const {secure_url} = await cloudinary.uploader.upload(pathImagen);
    return secure_url;
}


const validarImagen = (imagen, extensionesValidas =  ['png', 'jpg', 'jpeg', 'gif']) => {

            //Validando la extencios
           const nombreCortado = imagen.split('.')
           const extension  =nombreCortado[nombreCortado.length- 1];
            console.log(extension);
           //validar extensiones
           if(!extensionesValidas.includes(extension)){
                return {
                    ok:false,
                    extension
                }
           }else{
               return {
                    ok:true
               };

           }
    
};


const extraerIdImagen  = (imagen) => {
    const nombreArr = imagen.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [idImage] = nombre.split('.');
    return idImage
}


module.exports = {
    validarImagen,
    extraerIdImagen,
    uploadImage
}