const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const dataModel = require('../models/dataModel');

const dataPath = path.join(__dirname, '../data.json');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads');
    },
    filename: function (req, file, cb) {
        const randomName = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, randomName + extension);
    }
});

const upload = multer({ storage: storage });

exports.editSeoData = (req, res) => {
    upload.single('favicon')(req, res, async (err) => {
        if (handleMulterError(err, res)) return;

        try {
            const editedData = req.body;
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.meta, editedData);

            if (req.file) {
                jsonData.meta.favicon = req.file.filename;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin/seo');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.editHeaderData = (req, res) => {
    upload.fields([{ name: 'logo_dark', maxCount: 1 }, { name: 'logo_light', maxCount: 1 }])(req, res, async (err) => {
        if (handleMulterError(err, res)) return;

        try {
            const editedData = req.body;
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.header, editedData);

            if (req.files['logo_dark'] && req.files['logo_dark'][0]) {
                jsonData.header.logo_dark = req.files['logo_dark'][0].filename;
            }

            if (req.files['logo_light'] && req.files['logo_light'][0]) {
                jsonData.header.logo_light = req.files['logo_light'][0].filename;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin/header');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.editHeroData = (req, res) => {
    upload.single('banner')(req, res, async (err) => {
        if (handleMulterError(err, res)) return;

        try {
            const editedData = req.body;
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.hero, editedData);

            if (req.file) {
                jsonData.hero.banner = req.file.filename;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin/hero');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.editPartnersData = async (req, res) => {
    try {
        const editedData = req.body;
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.partners, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin/partners');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.addPartnersBannerData = (req, res) => {
    upload.single('images')(req, res, async (err) => {
        if (handleMulterError(err, res)) return;

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
            res.redirect('/admin/partners');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.deletePartnersBannerData = async (req, res) => {
    try {
        const partnerImgId = parseInt(req.params.id);
        let jsonData = await dataModel.getData();

        const index = jsonData.partners.partners_img.findIndex(img => img.id === partnerImgId);

        if (index !== -1) {
            jsonData.partners.partners_img.splice(index, 1);
            await dataModel.saveData(jsonData);
            res.redirect('/admin/partners');
        } else {
            res.status(404).send('Partner image not found');
        }
    } catch (err) {
        console.error('Error deleting partner image:', err);
        res.status(500).send('Error deleting partner image');
    }
};

exports.editFeaturedData = async (req, res) => {
    try {
        const editedData = req.body;
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.featured, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin/featured');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.addFeaturedData = async (req, res) => {
    try {
        const newData = req.body;
        const jsonData = await dataModel.getData();

        if (!jsonData.featured.featured_card || !Array.isArray(jsonData.featured.featured_card)) {
            throw new Error('Invalid or missing featured_card data');
        }

        const highestId = jsonData.featured.featured_card.reduce((maxId, card) => card.id > maxId ? card.id : maxId, 0);
        newData.id = highestId + 1;

        jsonData.featured.featured_card.push(newData);
        jsonData.featured.featured_card.sort((a, b) => a.id - b.id);

        await dataModel.saveData(jsonData);
        res.redirect('/admin/featured');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.deleteFeaturedData = async (req, res) => {
    try {
        const deleteId = parseInt(req.params.id);
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

        res.redirect('/admin/featured');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
};

exports.editAboutData = (req, res) => {
    upload.single('images')(req, res, async (err) => {
        if (handleMulterError(err, res)) return;

        try {
            const editedData = req.body;
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.about, editedData);

            if (req.file) {
                jsonData.about.images = req.file.filename;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin/about');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.addAboutData = async (req, res) => {
    try {
        const newData = req.body;
        const jsonData = await dataModel.getData();

        if (!jsonData.about.about_list || !Array.isArray(jsonData.about.about_list)) {
            throw new Error('Invalid or missing about_list data');
        }

        const highestId = jsonData.about.about_list.reduce((maxId, list) => list.id > maxId ? list.id : maxId, 0);
        newData.id = highestId + 1;

        jsonData.about.about_list.push(newData);
        jsonData.about.about_list.sort((a, b) => a.id - b.id);

        await dataModel.saveData(jsonData);
        res.redirect('/admin/about');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.deleteAboutData = async (req, res) => {
    try {
        const deleteId = parseInt(req.params.id);
        const jsonData = await dataModel.getData();

        if (!jsonData.about.about_list || !Array.isArray(jsonData.about.about_list)) {
            throw new Error('Invalid or missing about_list data');
        }

        const indexToDelete = jsonData.about.about_list.findIndex(list => list.id === deleteId);

        if (indexToDelete === -1) {
            throw new Error('Data with the given ID not found');
        }

        jsonData.about.about_list.splice(indexToDelete, 1);
        await dataModel.saveData(jsonData);

        res.redirect('/admin/about');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
};

exports.addAboutCountData = async (req, res) => {
    try {
        const newData = req.body;
        const jsonData = await dataModel.getData();

        if (!jsonData.about.about_count || !Array.isArray(jsonData.about.about_count)) {
            throw new Error('Invalid or missing about_count data');
        }

        const highestId = jsonData.about.about_count.reduce((maxId, count) => count.id > maxId ? count.id : maxId, 0);
        newData.id = highestId + 1;

        jsonData.about.about_count.push(newData);
        jsonData.about.about_count.sort((a, b) => a.id - b.id);

        await dataModel.saveData(jsonData);
        res.redirect('/admin/about');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.deleteAboutCountData = async (req, res) => {
    try {
        const deleteId = parseInt(req.params.id);
        const jsonData = await dataModel.getData();

        if (!jsonData.about.about_count || !Array.isArray(jsonData.about.about_count)) {
            throw new Error('Invalid or missing about_count data');
        }

        const indexToDelete = jsonData.about.about_count.findIndex(count => count.id === deleteId);

        if (indexToDelete === -1) {
            throw new Error('Data with the given ID not found');
        }

        jsonData.about.about_count.splice(indexToDelete, 1);
        await dataModel.saveData(jsonData);

        res.redirect('/admin/about');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
};

exports.editServicesData = (req, res) => {
    upload.single('images')(req, res, async (err) => {
        if (handleMulterError(err, res)) return;

        try {
            const editedData = req.body;
            const jsonData = await dataModel.getData();
            Object.assign(jsonData.services, editedData);

            if (req.file) {
                jsonData.services.images = req.file.filename;
            }

            await dataModel.saveData(jsonData);
            res.redirect('/admin/services');
        } catch (err) {
            console.error('Error saving edited data:', err);
            res.status(500).send('Error saving edited data');
        }
    });
};

exports.addServicesData = async (req, res) => {
    try {
        const newData = req.body;
        const jsonData = await dataModel.getData();

        if (!jsonData.services.services_card || !Array.isArray(jsonData.services.services_card)) {
            throw new Error('Invalid or missing services_card data');
        }

        const highestId = jsonData.services.services_card.reduce((maxId, card) => card.id > maxId ? card.id : maxId, 0);
        newData.id = highestId + 1;

        jsonData.services.services_card.push(newData);
        jsonData.services.services_card.sort((a, b) => a.id - b.id);

        await dataModel.saveData(jsonData);
        res.redirect('/admin/services');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.deleteServicesData = async (req, res) => {
    try {
        const deleteId = parseInt(req.params.id);
        const jsonData = await dataModel.getData();

        if (!jsonData.services.services_card || !Array.isArray(jsonData.services.services_card)) {
            throw new Error('Invalid or missing services_card data');
        }

        const indexToDelete = jsonData.services.services_card.findIndex(count => count.id === deleteId);

        if (indexToDelete === -1) {
            throw new Error('Data with the given ID not found');
        }

        jsonData.services.services_card.splice(indexToDelete, 1);
        await dataModel.saveData(jsonData);

        res.redirect('/admin/services');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
};

exports.deleteFaqData = async (req, res) => {
    try {
        const deleteId = parseInt(req.params.id);
        const jsonData = await dataModel.getData();

        if (!jsonData.faq.faq_list || !Array.isArray(jsonData.faq.faq_list)) {
            throw new Error('Invalid or missing faq_list data');
        }

        const indexToDelete = jsonData.faq.faq_list.findIndex(list => list.id === deleteId);

        if (indexToDelete === -1) {
            throw new Error('Data with the given ID not found');
        }

        jsonData.faq.faq_list.splice(indexToDelete, 1);
        await dataModel.saveData(jsonData);

        res.redirect('/admin/faq');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
};

exports.addFaqData = async (req, res) => {
    try {
        const newData = req.body;
        const jsonData = await dataModel.getData();

        if (!jsonData.faq.faq_list || !Array.isArray(jsonData.faq.faq_list)) {
            throw new Error('Invalid or missing faq_list data');
        }

        const highestId = jsonData.faq.faq_list.reduce((maxId, list) => list.id > maxId ? list.id : maxId, 0);
        newData.id = highestId + 1;

        jsonData.faq.faq_list.push(newData);
        jsonData.faq.faq_list.sort((a, b) => a.id - b.id);

        await dataModel.saveData(jsonData);
        res.redirect('/admin/faq');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.editFaqData = async (req, res) => {
    try {
        const editedData = req.body;
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.faq, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin/faq');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.editCtaData = async (req, res) => {
    try {
        const editedData = req.body;
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.cta, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin/cta');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.editFooterData = async (req, res) => {
    try {
        const editedData = req.body;
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.footer, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin/footer');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.editTestimonialData = async (req, res) => {
    try {
        const editedData = req.body;
        const jsonData = await dataModel.getData();
        Object.assign(jsonData.testimonial, editedData);
        await dataModel.saveData(jsonData);
        res.redirect('/admin/testimonial');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.addTestimonialData = async (req, res) => {
    try {
        const newData = req.body;
        const jsonData = await dataModel.getData();

        if (!jsonData.testimonial.testimonial_card || !Array.isArray(jsonData.testimonial.testimonial_card)) {
            throw new Error('Invalid or missing testimonial_card data');
        }

        const highestId = jsonData.testimonial.testimonial_card.reduce((maxId, card) => card.id > maxId ? card.id : maxId, 0);
        newData.id = highestId + 1;

        jsonData.testimonial.testimonial_card.push(newData);
        jsonData.testimonial.testimonial_card.sort((a, b) => a.id - b.id);

        await dataModel.saveData(jsonData);
        res.redirect('/admin/testimonial');
    } catch (err) {
        console.error('Error saving edited data:', err);
        res.status(500).send('Error saving edited data');
    }
};

exports.deleteTestimonialData = async (req, res) => {
    try {
        const deleteId = parseInt(req.params.id);
        const jsonData = await dataModel.getData();

        if (!jsonData.testimonial.testimonial_card || !Array.isArray(jsonData.testimonial.testimonial_card)) {
            throw new Error('Invalid or missing testimonial_card data');
        }

        const indexToDelete = jsonData.testimonial.testimonial_card.findIndex(card => card.id === deleteId);

        if (indexToDelete === -1) {
            throw new Error('Data with the given ID not found');
        }

        jsonData.testimonial.testimonial_card.splice(indexToDelete, 1);
        await dataModel.saveData(jsonData);

        res.redirect('/admin/testimonial');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
};

function handleMulterError(err, res) {
    if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        res.status(400).send('Multer Error: ' + err.message);
        return true;
    } else if (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file');
        return true;
    }
    return false;
}
