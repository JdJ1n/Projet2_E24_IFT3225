const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const password = 'ift3225';
hashPassword(password).then(hashedPassword => {
    console.log(hashedPassword);
});
