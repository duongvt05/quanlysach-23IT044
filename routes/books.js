const express = require('express');
const router = express.Router();
const { BookRead, BookWrite } = require('../models/Book');

const MSSV = process.env.STUDENT_ID;
const PREFIX = MSSV.slice(-3);                 // "456"
const VAT = Number(MSSV.slice(-1)) + 6;        // 6 + 6 = 12

// XEM DANH SÁCH -> tài khoản READ
router.get('/', async (req, res) => {
  req.session.visits = (req.session.visits || 0) + 1;
  const flash = req.session.flash;
  delete req.session.flash;

  try {
    const docs = await BookRead.find().sort({ createdAt: -1 }).lean();
    const books = docs.map(b => ({
      ...b,
      price: b.price.toLocaleString('vi-VN'),
      priceAfterTax: b.priceAfterTax.toLocaleString('vi-VN')
    }));
    res.render('home', { books, flash, prefix: PREFIX, visits: req.session.visits });
  } catch (err) {
    res.status(500).send('Lỗi đọc dữ liệu: ' + err.message);
  }
});

// THÊM MỚI -> tài khoản WRITE
router.post('/books', async (req, res) => {
  const { code, name, author, price } = req.body;
  const p = Number(price);

  // Bộ lọc: mã phải có tiền tố 3 số cuối MSSV
  if (!code || !code.startsWith(PREFIX)) {
    req.session.flash = { type: 'error', text: `Từ chối: mã sản phẩm phải bắt đầu bằng "${PREFIX}"` };
    return res.status(400).redirect('/');
  }
  if (!name || isNaN(p) || p <= 0) {
    req.session.flash = { type: 'error', text: 'Tên hoặc giá không hợp lệ' };
    return res.redirect('/');
  }

  // Tính giá sau thuế trước khi lưu
  const priceAfterTax = Math.round(p * (1 + VAT / 100));

  try {
    await BookWrite.create({ code, name, author, price: p, vat: VAT, priceAfterTax });
    req.session.flash = { type: 'success', text: 'Thêm sách thành công!' };
  } catch (err) {
    req.session.flash = { type: 'error', text: 'Lỗi ghi dữ liệu: ' + err.message };
  }
  res.redirect('/');
});

module.exports = router;