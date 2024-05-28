const fs = require('fs');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

const authController = {
  getLogin: (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.render('login', { message: '', jsonData: null });
      } else {
        const jsonData = JSON.parse(data);
        res.render('login', { message: '', jsonData: jsonData });
      }
    });
  },

  postLogin: async (req, res) => {
    const { username, password } = req.body;
    const admin = new Admin();

    try {
      const isValid = await admin.isValid(username, password);
      if (isValid) {
        req.session.isLoggedIn = true;
        res.redirect('/admin');
      } else {
        fs.readFile('data.json', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading JSON file:', err);
            res.render('login', { message: 'Username atau password salah', jsonData: null });
          } else {
            const jsonData = JSON.parse(data);
            res.render('login', { message: 'Username atau password salah', jsonData: jsonData });
          }
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.render('login', { message: 'Terjadi kesalahan saat login', jsonData: null });
    }
  },

  logout: (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect('/login');
  }
};

module.exports = authController;
