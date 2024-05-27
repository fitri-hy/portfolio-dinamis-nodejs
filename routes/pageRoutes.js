const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const adminController = require('../controllers/adminController');

router.get('/', pageController.getHomePage);

router.get('/admin', adminController.getAdminPage);
router.post('/admin/edit-seo', adminController.editSeoData);
router.post('/admin/edit-header', adminController.editHeaderData);
router.post('/admin/edit-hero', adminController.editHeroData);
router.post('/admin/edit-partners', adminController.editPartnersData);
router.post('/admin/add-partners-images', adminController.addPartnersBannerData);

module.exports = router;
