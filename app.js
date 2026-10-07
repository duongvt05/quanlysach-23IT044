require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== View engine =====
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// ===== Thông tin dùng cho Footer =====
app.locals.student = {
  name: process.env.STUDENT_NAME,
  mssv: process.env.STUDENT_ID,
  vat: Number(process.env.STUDENT_ID.slice(-1)) + 6
};

app.set('trust proxy', 1); // bắt buộc khi chạy sau proxy của Render
app.use(express.urlencoded({ extended: true }));


// ===== SESSION =====
 //app.use(require('./config/session'));


// ===== ROUTES =====
// app.use('/', require('./routes/books'));

app.listen(PORT, () => console.log(`🚀 Server chạy tại cổng ${PORT}`));