const config = require('config');

//to set the env variable for windows: "set eLearning_jwtPrivateKey=key_name"
//set jwt key to heroku: heroku config:set eLearning_jwtPrivateKey=key_name
//set NODE_ENV to prod: heroku config:set NODE_ENV=production

module.exports = function() {
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
        
        //our global infrastracture will take care of terminating the app
        
        // console.error('FATAL ERROR: jwtPrivateKey is not defined'); 
        // process.exit(1);    //0 - success, anything than 0 means error
    }
}