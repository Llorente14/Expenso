const express = require('express');
const router = express.Router();
const Category = require('../app/model/Category');
const { checkAuthenticated } = require('../app/config/auth');

// Tampilkan halaman kategori
router.get('/categories', checkAuthenticated, async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.render('pages/category', {
    title: 'Kategori',
    user: req.user,
    categories,
  });
});

// Tambah kategori
router.post('/categories', checkAuthenticated, async (req, res) => {
  try {
    await Category.create({
      name: req.body.name,
      user: req.user._id,
    });
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.redirect('/categories');
  }
});

// Hapus kategori (opsional)
router.get('/delete/:id', checkAuthenticated, async (req, res) => {
  await Category.deleteOne({ _id: req.params.id, user: req.user._id });
  res.redirect('/categories');
});

module.exports = router;
