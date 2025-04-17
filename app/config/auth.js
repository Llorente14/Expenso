const { Title } = require("chart.js");
const bcrypt = require('bcrypt');
const User = require('../model/Users.js')

exports.getSettingsPage = (req, res) => {
    res.render('pages/settings', {
      user: req.user ,// pastikan middleware auth mengisi ini
      title: 'Profile Settings',
      req:req,
     
    });
  };
  
  exports.updateProfile = async (req, res) => {
    const { gmail, name, password } = req.body;
    const userId = req.user._id;
  
    try {
      const update = { gmail, name };
      if (password) {
        // hash password dulu
        update.password = await bcrypt.hash(password, 10);
      }
  
      await User.findByIdAndUpdate(userId, update) // update user di database;
      res.redirect('/settings?success=ada');
    } catch (err) {
      console.error(err);
      res.redirect('/settings?sucess=tada');
    }
  };
  

exports.checkAuthenticated= async(req, res, next)=> {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect("/auth/login");
  }

  //Middleware agar user harus login untuk masuk ke dashboard ataupun sebaliknya

exports. checkNotAuthenticated= async(req, res, next)=> {
    if (req.isAuthenticated()) {
      return res.redirect("/expenses");
    }
    next();
  }