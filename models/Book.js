const mongoose = require('mongoose');
const { readConn, writeConn } = require('../config/db');

const bookSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, default: '' },
    price: { type: Number, required: true },        // giá gốc
    vat: { type: Number, required: true },          // % VAT
    priceAfterTax: { type: Number, required: true } // giá sau thuế
  },
  {
    collection: 'books',
    timestamps: true,
    // Tắt tự tạo collection/index vì user chỉ có quyền hạn chế
    autoIndex: false,
    autoCreate: false
  }
);

// Cùng schema, gắn vào 2 kết nối khác nhau
const BookRead  = readConn.model('Book', bookSchema);   // chỉ dùng find
const BookWrite = writeConn.model('Book', bookSchema);  // chỉ dùng create

module.exports = { BookRead, BookWrite };