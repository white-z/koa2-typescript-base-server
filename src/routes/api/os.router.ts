import router from '../router'
import osController from '../../controllers/os.controller';

router.get('/os/get_version', osController.getVersion);
router.get('/os/get_cpu', osController.getCPU);
router.get('/os/get_heap', osController.getHeap);
router.get('/os/get_disk_space', osController.diskSpace);

export default router;