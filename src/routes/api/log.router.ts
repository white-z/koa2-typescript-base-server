import router from '../router'
import logController from '../../controllers/log.controller';

router.get('/log/get_dblog', logController.getDBLog);
router.post('/log/clear_dblog', logController.clearDBLog);
router.get('/log/get_syslog', logController.getSysLog);
router.post('/log/clear_syslog', logController.clearSysLog);

export default router;