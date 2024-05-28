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

router.post('/admin/edit-seo', adminController.editSeoData);
router.post('/admin/edit-header', adminController.editHeaderData);
router.post('/admin/edit-hero', adminController.editHeroData);

router.post('/admin/edit-partners', adminController.editPartnersData);
router.post('/admin/add-partners-images', adminController.addPartnersBannerData);
router.post('/admin/delete-partners-images/:id', adminController.deletePartnersBannerData);

router.post('/admin/edit-featured', adminController.editFeaturedData);
router.post('/admin/add-featured', adminController.addFeaturedData);
router.post('/admin/delete-featured/:id', adminController.deleteFeaturedData);

router.post('/admin/edit-about', adminController.editAboutData);
router.post('/admin/add-about-list', adminController.addAboutData);
router.post('/admin/delete-about-list/:id', adminController.deleteAboutData);
router.post('/admin/add-about-count', adminController.addAboutCountData);
router.post('/admin/delete-about-count/:id', adminController.deleteAboutCountData);

router.post('/admin/edit-services', adminController.editServicesData);
router.post('/admin/add-services', adminController.addServicesData);
router.post('/admin/delete-services/:id', adminController.deleteServicesData);

router.post('/admin/edit-testimonial', adminController.editTestimonialData);
router.post('/admin/add-testimonial', adminController.addTestimonialData);
router.post('/admin/delete-testimonial/:id', adminController.deleteTestimonialData);

router.post('/admin/edit-faq', adminController.editFaqData);
router.post('/admin/add-faq', adminController.addFaqData);
router.post('/admin/delete-faq/:id', adminController.deleteFaqData);

router.post('/admin/edit-cta', adminController.editCtaData);

router.post('/admin/edit-footer', adminController.editFooterData);

module.exports = router;
