const { Router } = require('express');
const adminController = require('../controllers/adminController');
const adminProduct = require('../controllers/adminProduct');


const router  = Router();

router.get('/signup', adminController.signup_get, ()=> {});
router.post('/signup',adminController.signup_post, ()=> {});
router.get('/login', adminController.login_get,()=> {});
router.post('/login', adminController.login_post, ()=> {});
router.post('/forget_password', adminController.forget_password_post, ()=> {});
router.post('/confirm_otp', adminController.confirm_otp_post,()=> {});
router.post('/change_password', adminController.change_password_post,()=> {});
router.get('/logout', adminController.logout_get,()=> {})



// for the products 
router.get('/products', adminProduct.products_get, ()=> {});
router.get('/product', adminProduct.product_get,()=> {});
router.post('/product/add', adminProduct.product_post, ()=> {});
router.patch('/product/:productId', adminProduct.product_patch,()=> {});
router.delete('/product/:productId', adminProduct.product_delete,()=> {});

module.exports = router;