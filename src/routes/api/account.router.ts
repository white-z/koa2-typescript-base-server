import router from '../router'
import accountController from '../../controllers/account.controller';

router.post('/account/register', accountController.register);
router.post('/account/login', accountController.validateLogin, accountController.login);
router.post('/account/disabled', accountController.disabled);
router.post('/account/logout', accountController.logout);
router.get('/account/list', accountController.list);
router.post('/account/reset_password', accountController.resetPassword);
router.post('/account/update', accountController.update);
export default router;
