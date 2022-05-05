import router from '../router'
import fileController from '../../controllers/file.controller'

router.post('/file/upload', fileController.fileUpload)

export default router;