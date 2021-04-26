const brypt = require('bcrypt');

async function runt(){
    const salt = await brypt.genSalt(10);
    const hashed = await brypt.hash('1234', salt);
    console.log(salt);
    console.log(hashed);
}

runt();