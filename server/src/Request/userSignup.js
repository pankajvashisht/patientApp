const { vaildation } = require('../../utils/DataValidation');
const app = require('../../libary/CommanMethod');
module.exports = async (Request, res, next) => {
	const requried = {
		phone: Request.body.phone,
		phone_code: Request.body.phone_code,
		checkexist: 1
	};
	const non_required = {
		device_type: Request.body.device_type,
		device_token: Request.body.device_token,
		authorization_key: app.createToken(),
		otp: app.randomNumber()
	};
	try {
		Request.RequestData = await vaildation(requried, non_required);
		next();
	} catch (err) {
		return app.error(res, err);
	}
};
