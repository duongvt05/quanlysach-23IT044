const mongoose = require('mongoose');

// Hai kết nối độc lập, mỗi kết nối một tài khoản
const readConn  = mongoose.createConnection(process.env.MONGO_URI_READ);
const writeConn = mongoose.createConnection(process.env.MONGO_URI_WRITE);

readConn.on('connected',  () => console.log('✅ READ connection OK'));
writeConn.on('connected', () => console.log('✅ WRITE connection OK'));
readConn.on('error',  e => console.error('READ error:', e.message));
writeConn.on('error', e => console.error('WRITE error:', e.message));

module.exports = { readConn, writeConn };