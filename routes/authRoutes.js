const { Router } = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/userProduct');

const router  = Router();

router.get('/signup', authController.signup_get, ()=> {});
router.post('/register',authController.register_post, ()=> {});
router.get('/login', authController.login_get,()=> {});
router.post('/login', authController.login_post, ()=> {});
router.post('/forget_password', authController.forget_password_post, ()=> {});
router.post('/confirm_otp', authController.confirm_otp_post,()=> {});
router.post('/change_password', authController.change_password_post,()=> {});
router.get('/logout', authController.logout_get,()=> {})



router.patch('/update_user/:wallet_address', authController.update_user_patch,()=> {})

router.post('/new_job/:wallet_address', authController.post_related_jobs,()=> {})
router.get('/search_job/:wallet_address', authController.get_related_jobs,()=> {})


// for the products
// router.get('/productId', authController.productId_get,()=> {});
// router.get('/product', authController.product_get,()=> {});






module.exports = router;