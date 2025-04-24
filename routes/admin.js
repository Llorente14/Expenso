
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt'); // Add this
const User = require("../app/model/Users");
const { checkAuthenticated } = require('../app/config/auth');

//Halaman Berisi Table User
router.get("/adminPanel", checkAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    let filter = {};
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { gmail: { $regex: searchQuery, $options: "i" } }
      ];
    }

    // Pagination
    const perPage = 5;
    const page = parseInt(req.query.page) || 1;

    const count = await User.countDocuments(filter);
    const startIndex = count === 0 ? 0 : (page - 1) * perPage + 1;
    const endIndex = Math.min(startIndex + perPage - 1, count);
    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    const data = await User.find(filter)
      .sort({ createAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render("pages/adminPanel", {
      title: "Admin Panel",
      data,
      user: req.user,
      searchQuery,
      counter: {
        startIndex,
        endIndex,
        count,
      },
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    req.flash("error", "Gagal memuat data");
    res.render("pages/adminPanel", { title: "Admin Panel", data: [] });
  }
});

//Halaman Berisi Table User untuk change role user
router.get("/adminRole",checkAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    let filter = {};
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { gmail: { $regex: searchQuery, $options: "i" } }
      ];
    }

    // Pagination
    const perPage = 5;
    const page = parseInt(req.query.page) || 1;

    const count = await User.countDocuments(filter);
    const startIndex = count === 0 ? 0 : (page - 1) * perPage + 1;
    const endIndex = Math.min(startIndex + perPage - 1, count);
    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    const data = await User.find(filter)
      .sort({ createAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render("pages/adminRole", {
      title: "Admin Panel",
      data,
      user: req.user,
      searchQuery,
      counter: {
        startIndex,
        endIndex,
        count,
      },
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    req.flash("error", "Gagal memuat data");
    res.render("pages/adminPanel", { title: "Admin Panel", data: [] });
  }}); 

//Halaman Berisi Form Add Data
router.get("/adminRole/add", checkAuthenticated, (req, res) => {
  res.render("pages/userAdd", {
    title: "Tambah User by Admin",
    user: req.user,
  });
})

//Endpoint untuk menambah user
router.post("/adminRole/add", checkAuthenticated, async (req, res) => {
  try {
    const { username, gmail, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("gmail "+ gmail)
    const newUser = new User({
      name: username,
      gmail: gmail,
      password: hashedPassword,
      role: "user",
    });

    await User.create(newUser);
    res.redirect("/adminRole");
  } catch (error) {
    console.error("Error adding user:", error);
    req.flash("error", "Gagal menambah user");  
  }
});

//Endpoint untuk edit user di Table adminPanel (Update)
router.post("/adminPanel/edit/:id", checkAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id; 
      const { username, email, password } = req.body; 
  
      const updates = {
        name: username,
        gmail: email,
      };
  
      if (password && password.trim() !== "") {
        updates.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, message: "Failed to update user" });
    }
  });

//Endpoint untuk edit user di Table adminRole (Update)
  router.post('/adminRole/edit/:id', checkAuthenticated, async (req, res) => {
    try {
      const { name, role } = req.body;
  
      const updates = { name, role };
  
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ success: false, message: 'Failed to update user role' });
    }
  });

router.post('/users/update/:id', checkAuthenticated, async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      gmail: req.body.gmail
    };
    console.log('Request Body:', req.body);
    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/users/delete/:id', checkAuthenticated, async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      req.flash('error', 'User not found');
    } else {
      req.flash('success', 'User deleted successfully');
    }
    res.redirect('/adminPanel');
  } catch (error) {
    req.flash('error', 'Failed to delete user');
    res.redirect('/adminPanel');
  }
});

router.post('/users/role/:id', checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Prevent changing own role
    if (id === req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot change your own role' 
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating user role' 
    });
  }
});

module.exports = router;