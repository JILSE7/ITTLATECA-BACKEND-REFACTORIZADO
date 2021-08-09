const token = require('./Validar-token');
const campos = require('./validar-campos');
const role = require('./Validar-role');
const usuario = require('./Validar-usuario');


module.exports = {
    ...campos,
    ...role,
    ...token,
    ...usuario
}