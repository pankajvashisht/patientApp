const express = require('express');
const router = express.Router();
const {
	UserController,
	LicensesController,
} = require('../src/Controller/v1/index');
const { userSignup } = require('../src/Request');
const { UserAuth, cross, Language } = require('../src/middleware/index');
const Apiresponse = require('../libary/ApiResponse');
const cron = require('../libary/cron');
const user = new UserController();

const my_cron = new cron(1000 * 60 * 60 * 24);
my_cron.start(() => {
	user.sendPush();
});

router.use([cross, Language, UserAuth]);
router.get('/', function (req, res) {
	res.send(' APi workings ');
});

router.post('/user', userSignup, Apiresponse(user.addUser));
router.post('/user/login/', Apiresponse(user.loginUser));
router.post('/user/verify', Apiresponse(user.verifyOtp));
router.post('/user/edit/', Apiresponse(user.updateProfile));
router.post('/change_password', Apiresponse(user.changePassword));
router.post('/forgot-password', Apiresponse(user.forgotPassword));
router.post('/logout', Apiresponse(user.logout));
router.get('/app-information', Apiresponse(user.appInfo));
router.get(
	'/agencie/:offset([0-9]+)?/',
	Apiresponse(LicensesController.getAngency)
);
router.get(
	'/angency-details/:angency_id([0-9]+)',
	Apiresponse(LicensesController.angencyDetails)
);
router
	.route('/licenses/:offset([0-9]+)?/')
	.get(Apiresponse(LicensesController.getLicense))
	.post(Apiresponse(LicensesController.addLicenses))
	.put(Apiresponse(LicensesController.updateLicenses))
	.delete(Apiresponse(LicensesController.deleteLicenses));

router
	.route('/rating/:offset([0-9]+)?/')
	.get(Apiresponse(LicensesController.getRating))
	.post(Apiresponse(LicensesController.giveRating));

module.exports = router;
