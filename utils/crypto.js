const {createHmac} = require('node:crypto');

function generateHmacSignature(data, salt) {
    const hash = createHmac('sha256', salt);
    hash.update(data);
    return hash.digest('hex');
}

module.exports = {
    generateHmacSignature
};
