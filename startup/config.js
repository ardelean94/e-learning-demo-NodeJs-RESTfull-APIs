const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
        
        //our global infrastracture will take care of terminating the app
        // console.error('FATAL ERROR: jwtPrivateKey is not defined'); //to set the env variable for windows: "set eLearning_jwtPrivateKey=key_name"
        // process.exit(1);    //0 - success, anything than 0 means error
    }
}