const {Router} = require('express');
const UsersControrller = require('../controllers/users.controller');
const upload = require('../middlewares/upload.middleware');
const checkRole = require('../middlewares/checkRole.middleware');
const router = Router();

router.get('/', UsersControrller.getAll)//checkRole(['user', 'admin', 'premium'])
router.get('/premium/:userId', UsersControrller.changeRole)
router.post('/:uid/documents', upload.array('document') ,UsersControrller.uploadDocuments) //req.file req.files
router.post('/:uid/profile-picture', upload.single('profile'), UsersControrller.uploadProfilePicture)
router.delete('/', checkRole(['admin']), UsersControrller.deleteUnactive)
router.put('/:uid', UsersControrller.updateUser)
router.delete('/:uid', UsersControrller.deleteUser)

module.exports = {
    usersRouter: router
}; 