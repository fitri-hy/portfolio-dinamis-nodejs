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

exports.deletePartnersBannerData = async (req, res) => {
    const partnerImgId = req.params.id;

    try {
        let jsonData = await dataModel.getData();

        const index = jsonData.partners.partners_img.findIndex(img => img.id === parseInt(partnerImgId));

        if (index !== -1) {
            jsonData.partners.partners_img.splice(index, 1);

            await dataModel.saveData(jsonData);

            res.redirect('/admin');
        } else {
            res.status(404).send('Partner image not found');
        }
    } catch (err) {
        console.error('Error deleting partner image:', err);
        res.status(500).send('Error deleting partner image');
    }
};

exports.editFeaturedData = async (req, res) => {
    const editedData = req.body;
    try {
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.featured, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.addFeaturedData = async (req, res) => {
    const newData = req.body;
    try {
        const jsonData = await dataModel.getData();
        
        if (!jsonData.featured.featured_card || !Array.isArray(jsonData.featured.featured_card)) {
            throw new Error('Invalid or missing featured_card data');
        }

        const highestId = jsonData.featured.featured_card.reduce((maxId, card) => {
            return card.id > maxId ? card.id : maxId;
        }, 0);

        newData.id = highestId + 1;

        jsonData.featured.featured_card.push(newData);

        jsonData.featured.featured_card.sort((a, b) => a.id - b.id);

        await dataModel.saveData(jsonData);

        res.redirect('/admin');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.deleteFeaturedData = async (req, res) => {
    const deleteId = parseInt(req.params.id);
    try {
        const jsonData = await dataModel.getData();
        
        if (!jsonData.featured.featured_card || !Array.isArray(jsonData.featured.featured_card)) {
            throw new Error('Invalid or missing featured_card data');
        }

        const indexToDelete = jsonData.featured.featured_card.findIndex(card => card.id === deleteId);

        if (indexToDelete === -1) {
            throw new Error('Data with the given ID not found');
        }

        jsonData.featured.featured_card.splice(indexToDelete, 1);

        await dataModel.saveData(jsonData);

        res.redirect('/admin');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
};
