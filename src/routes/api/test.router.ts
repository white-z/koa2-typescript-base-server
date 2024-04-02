import router from '../router'
import * as testController from '../../controllers/test.controller';
import rules from '../../middleware/rules';

router.get('/test/get_version', testController.getVersion)
router.get('/test/set_value', rules({
  value: { type: String, required: true}
}), testController.setValue)
router.get('/test/get_value', testController.getValue)
router.post('/test/flushdb', testController.flushdb)
export default router;