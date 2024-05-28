const path = require('path');
const dataModel = require('../models/dataModel');
const dataPath = path.join(__dirname, '../data.json');

exports.Dashboard = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/index', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Seo = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/seo', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Header = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/header', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Hero = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/hero', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Partners = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/partners', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Featured = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/featured', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.About = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/about', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Services = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/services', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Testimonial = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/testimonial', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Faq = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/faq', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Cta = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/cta', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};

exports.Footer = async (req, res) => {
    try {
        const jsonData = await dataModel.getData();
        res.render('admin/section/footer', { jsonData });
    } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(500).send('Error reading JSON file');
    }
};