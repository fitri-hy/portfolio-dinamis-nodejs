const multer = require('multer');
const path = require('path');
const dataModel = require('../models/dataModel');

const dataPath = path.join(__dirname, '../data.json');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/test');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

exports.getAdminPage = (req, res) => {
    dataModel.getData()
        .then(jsonData => {
            res.render('admin/index', {
                jsonData: jsonData
            });
        })
        .catch(err => {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Error reading JSON file');
        });
};

exports.editSeoData = async (req, res) => {
    upload.single('favicon')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(500).send('Multer Error');
        } else if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send('Error uploading file');
        }

        const editedData = req.body;

        try {
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.meta, editedData);

            if (req.file) {
                jsonData.meta.favicon = req.file.originalname;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.editHeaderData = async (req, res) => {
    upload.fields([{ name: 'logo_dark', maxCount: 1 }, { name: 'logo_light', maxCount: 1 }])(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(500).send('Multer Error');
        } else if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send('Error uploading file');
        }

        const editedData = req.body;

        try {
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.header, editedData);

            if (req.files['logo_dark'] && req.files['logo_dark'][0]) {
                jsonData.header.logo_dark = req.files['logo_dark'][0].originalname;
            }

            if (req.files['logo_light'] && req.files['logo_light'][0]) {
                jsonData.header.logo_light = req.files['logo_light'][0].originalname;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.editHeroData = async (req, res) => {
    upload.single('banner')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(500).send('Multer Error');
        } else if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send('Error uploading file');
        }

        const editedData = req.body;

        try {
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.hero, editedData);

            if (req.file) {
                jsonData.hero.banner = req.file.originalname;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.editPartnersData = async (req, res) => {
    const editedData = req.body;
    try {
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.partners, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.addPartnersBannerData = async (req, res) => {
    upload.single('images')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).send('Multer Error: ' + err.message); // Send specific multer error
        } else if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send('Error uploading file');
        }

        try {
            const jsonData = await dataModel.getData();

            // Calculate the next sequential id
            const existingIds = jsonData.partners.partners_img.map(img => img.id);
            const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

            const newPartnerImg = {
                id: nextId,
                images: req.file ? req.file.filename : ''
            };

            jsonData.partners.partners_img.push(newPartnerImg);

            await dataModel.saveData(jsonData);
            res.redirect('/admin');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};