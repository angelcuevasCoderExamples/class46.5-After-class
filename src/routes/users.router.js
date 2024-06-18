const {Router} = require('express');
const UsersControrller = require('../controllers/users.controller');
const upload = require('../middlewares/upload.middleware');
const router = Router();

router.get('/', UsersControrller.getAll)
router.get('/premium/:userId', UsersControrller.changeRole)
router.post('/:uid/documents', upload.array('document') ,UsersControrller.uploadDocuments) //req.file req.files
router.post('/:uid/profile-picture', upload.single('profile'), UsersControrller.uploadProfilePicture)

module.exports = {
    usersRouter: router
}; 