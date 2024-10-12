const { Router } = require('express');
const productController = require('../controllers/userProduct');
const { requireAuth, checkUser } = require('../middleware/authMiddleware')


const router  = Router();
router.use(requireAuth, checkUser)


//for user account settings
router.get('/settings/account_info', productController.account_info_get,()=> {})

// router.post('/:userId/settings/update_profile', authController.update_profile,()=> {})
router.patch('/settings/account_update', productController.account_update_patch,()=> {})
router.patch('/:userId/settings/security_update', productController.security_update_patch,()=> {})


//User Manipulating it's own cart section
router.get('/cart', productController.getCart,()=> {})
router.post('/cart/add', productController.addToCart,()=> {})
router.put('/cart/update', productController.updateCartItem,()=> {})
router.delete('/cart/:productId', productController.removeCart,()=> {})
router.delete('/cart', productController.removeAll,()=> {})


router.post('/:userId/checkout', productController.postCheckout,()=> {})


module.exports = router;
