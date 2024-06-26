const {Router} = require('express');
const ItemsController = require('../controllers/items.controller');
const getToken = require('../middlewares/getToken.middleware');
const checkRole = require('../middlewares/checkRole.middleware');

const router = Router();

router.get('/', ItemsController.getAll)

router.get('/:id', ItemsController.getById)

router.post('/',getToken, checkRole(['admin','premium']), ItemsController.create)

router.put('/:id', getToken, checkRole(['admin','premium']), ItemsController.update)

router.delete('/:id',getToken, checkRole(['admin','premium']), ItemsController.delete)

module.exports = router; 