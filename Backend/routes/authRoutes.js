const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');


const router  = Router();

router.get('/user/:wallet_address' , requireAuth, checkUser ,authController.get_user, ()=> {});

router.post('/register',authController.register_post, ()=> {});
router.post('/login', authController.login_post, ()=> {});
router.post('/forget_password', authController.forget_password_post, ()=> {});
router.post('/confirm_otp', authController.confirm_otp_post,()=> {});
router.post('/change_password', authController.change_password_post,()=> {});
router.get('/logout', authController.logout_get,()=> {})



router.patch('/update_user/:wallet_address', requireAuth, checkUser , authController.update_user_patch,()=> {})

router.post('/new_job/:wallet_address', requireAuth, checkUser , authController.post_related_jobs,()=> {})
router.get('/search_job/:wallet_address', requireAuth, checkUser , authController.list_jobs_for_user,()=> {})
router.patch('/update_job/:wallet_address', requireAuth, checkUser , authController.list_and_update_job_availability,()=> {})



// for the products
// router.get('/productId', authController.productId_get,()=> {});
// router.get('/product', authController.product_get,()=> {});






module.exports = router;