const express = require('express');
const router = express.Router();
const adminPageController = require('../controllers/adminPageController');
const pageController = require('../controllers/pageController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const requireLogin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.use('/admin', requireLogin);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

router.get('/', pageController.getHomePage);

router.get('/admin', adminPageController.Dashboard);
router.get('/admin/seo', adminPageController.Seo);
router.get('/admin/header', adminPageController.Header);
router.get('/admin/hero', adminPageController.Hero);
router.get('/admin/partners', adminPageController.Partners);
router.get('/admin/featured', adminPageController.Featured);
router.get('/admin/about', adminPageController.About);
router.get('/admin/services', adminPageController.Services);

router.get('/admin/testimonial', adminPageController.Testimonial);
router.get('/admin/faq', adminPageController.Faq);
router.get('/admin/cta', adminPageController.Cta);
router.get('/admin/footer', adminPageController.Footer);

router.post('/admin/edit-seo', requireLogin, adminController.editSeoData);
router.post('/admin/edit-header', requireLogin, adminController.editHeaderData);
router.post('/admin/edit-hero', requireLogin, adminController.editHeroData);

router.post('/admin/edit-partners', requireLogin, adminController.editPartnersData);
router.post('/admin/add-partners-images', requireLogin, adminController.addPartnersBannerData);
router.post('/admin/delete-partners-images/:id', requireLogin, adminController.deletePartnersBannerData);

router.post('/admin/edit-featured', requireLogin, adminController.editFeaturedData);
router.post('/admin/add-featured', requireLogin, adminController.addFeaturedData);
router.post('/admin/delete-featured/:id', requireLogin, adminController.deleteFeaturedData);

router.post('/admin/edit-about', requireLogin, adminController.editAboutData);
router.post('/admin/add-about-list', requireLogin, adminController.addAboutData);
router.post('/admin/delete-about-list/:id', requireLogin, adminController.deleteAboutData);
router.post('/admin/add-about-count', requireLogin, adminController.addAboutCountData);
router.post('/admin/delete-about-count/:id', requireLogin, adminController.deleteAboutCountData);

router.post('/admin/edit-services', requireLogin, adminController.editServicesData);
router.post('/admin/add-services', requireLogin, adminController.addServicesData);
router.post('/admin/delete-services/:id', requireLogin, adminController.deleteServicesData);

router.post('/admin/edit-testimonial', requireLogin, adminController.editTestimonialData);
router.post('/admin/add-testimonial', requireLogin, adminController.addTestimonialData);
router.post('/admin/delete-testimonial/:id', requireLogin, adminController.deleteTestimonialData);

router.post('/admin/edit-faq', requireLogin, adminController.editFaqData);
router.post('/admin/add-faq', requireLogin, adminController.addFaqData);
router.post('/admin/delete-faq/:id', requireLogin, adminController.deleteFaqData);

router.post('/admin/edit-cta', requireLogin, adminController.editCtaData);

router.post('/admin/edit-footer', requireLogin, adminController.editFooterData);

module.exports = router;
