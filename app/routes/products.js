const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middlewares/checkAuth');
const product = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toDateString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/', product.getAll);

router.post('/', checkAuth, upload.single('productImage'), product.create);

router.get('/:productId', product.getById);

router.patch('/:productId', checkAuth, product.update);

router.delete('/:productId', checkAuth, product.destroy);

module.exports = router;