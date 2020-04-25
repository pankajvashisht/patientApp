const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const { lang } = require('../../../config');
const DB = new Db();

class UserController extends ApiController {
	constructor() {
		super();
		this.addUser = this.addUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
	}

	async addUser(Request) {
		const { RequestData } = Request;
		const result = await DB.find('users', 'first', {
			conditions: {
				phone: RequestData.phone,
				status: 0,
			},
		});
		if (result) {
			RequestData.id = result.id;
		}
		await DB.save('users', RequestData);
		RequestData.lang = Request.lang;
		setTimeout(() => {
			this.mails(RequestData);
		}, 100);
		return {
			message: 'Iscriviti gratuitamente',
			data: {
				authorization_key: RequestData.authorization_key,
			},
		};
	}
	async verifyOtp(req) {
		let required = {
			otp: req.body.otp,
		};
		let non_required = {};
		let request_data = await super.vaildation(required, non_required);
		if (parseInt(request_data.otp) !== req.body.userInfo.otp) {
			throw new ApiError(lang[req.lang].invaildOtp);
		}
		req.body.userInfo.status = 1;
		await DB.save('users', req.body.userInfo);
		const usersInfo = await super.userDetails(req.body.userInfo.id);
		if (usersInfo.profile.length > 0) {
			usersInfo.profile = appURL + 'uploads/' + usersInfo.profile;
		}
		return {
			message: 'OTP verificato',
			data: usersInfo,
		};
	}

	async forgotPassword(req) {
		let required = {
			email: req.body.email,
			otp: app.randomNumber(),
		};
		let non_required = {};
		let request_data = await super.vaildation(required, non_required);
		let user_info = await DB.find('users', 'first', {
			conditions: {
				email: request_data.email,
			},
			fields: ['id', 'email', 'name'],
		});
		if (!user_info) throw new ApiError(lang[req.lang].mailNotFound);
		user_info.otp = request_data.otp;
		user_info.forgot_password_hash = app.createToken();
		await DB.save('users', user_info);
		let mail = {
			to: request_data.email,
			subject: 'Forgot Password',
			template: 'forgot_password',
			data: {
				first_name: user_info.name,
				last_name: user_info.name,
				url: appURL + 'users/change_password/' + user_info.forgot_password_hash,
			},
		};
		setTimeout(() => {
			app.send_mail(mail);
		}, 100);
		return {
			message: lang[req.lang].otpSend,
			data: [],
		};
	}

	async loginUser(req) {
		const required = {
			phone: req.body.phone,
			password: req.body.password,
		};
		const non_required = {
			device_type: req.body.device_type || 0,
			device_token: req.body.device_token || '',
			last_login: app.currentTime,
			authorization_key: app.createToken(),
		};

		let request_data = await super.vaildation(required, non_required);
		let login_details = await DB.find('users', 'first', {
			conditions: {
				or: {
					email: request_data.phone,
					phone: request_data.phone,
				},
			},
			fields: ['id', 'password', 'status', 'email'],
		});
		if (login_details) {
			if (request_data.password !== login_details.password)
				throw new ApiError('Email o password non valida');
			delete login_details.password;
			request_data.id = login_details.id;
			await DB.save('users', request_data);
			login_details.authorization_key = request_data.authorization_key;
			login_details = await super.userDetails(login_details.id);
			if (login_details.profile.length > 0) {
				login_details.profile = appURL + 'uploads/' + login_details.profile;
			}
			return {
				message: lang['en'].LoginMessage,
				data: login_details,
			};
		}
		throw new ApiError(lang['en'].wrongLogin);
	}
	async appInfo() {
		let app_info = await DB.find('app_informations', 'all');
		return {
			message: 'Informazioni Applicazione',
			data: app_info,
		};
	}
	async changePassword(req) {
		let required = {
			old_password: req.body.old_password,
			new_password: req.body.new_password,
		};
		let request_data = await super.vaildation(required, {});
		const loginInfo = req.body.userInfo;
		if (loginInfo.password !== request_data.old_password) {
			throw new ApiError(lang[req.lang].oldPassword);
		}
		loginInfo.password = request_data.new_password;
		await DB.save('users', loginInfo);
		return {
			message: 'Password aggiornata correttamente',
			data: [],
		};
	}
	async updateProfile(req) {
		const required = {
			id: req.body.user_id,
		};
		const non_required = {
			tax_code: req.body.tax_code,
			email: req.body.email,
			address: req.body.address,
			name: req.body.name,
			password: req.body.password,
		};
		const request_data = await super.vaildation(required, non_required);
		console.log(request_data);
		if (request_data.email) {
			const query = `select email, id from users where email = '${request_data.email}' and id != ${request_data.id}`;
			const result = await DB.first(query);
			if (result.length > 0) {
				throw new ApiError(
					'Email già registrata per favore aggiungi nuovo indirizzo email',
					400
				);
			}
		}
		if (req.files && req.files.profile) {
			request_data.profile = await app.upload_pic_with_await(req.files.profile);
		}
		await DB.save('users', request_data);
		const usersinfo = await super.userDetails(request_data.id);
		if (usersinfo.profile.length > 0) {
			usersinfo.profile = appURL + 'uploads/' + usersinfo.profile;
		}
		if (request_data.password) {
			usersinfo.password = req.body.password;
			setTimeout(() => {
				sendSignupMail(usersinfo);
			}, 100);
		}

		return {
			message: 'Profilo aggiornato correttamente',
			data: usersinfo,
		};
	}

	async logout(req) {
		let required = {
			id: req.body.user_id,
		};
		let request_data = await super.vaildation(required, {});
		request_data.authorization_key = '';
		await DB.save('users', request_data);
		return {
			message: 'Logout eseguito',
			data: [],
		};
	}
	async sendPush() {
		let currentTime = app.currentTime;
		const thirty_day = currentTime - 2629743;
		const result = await DB.first(
			`select licenses.* , users.email, users.phone,users.phone_code, users.device_token from licenses join users on (users.id = licenses.user_id) where expiry_date < ${thirty_day}  `
		);
		let right_time = currentTime * 1000;
		console.log(new Date(right_time - 2629743000).toDateString());
		result.forEach((value) => {
			const thirty = new Date(right_time - 2629743000).toDateString();
			const fiften_day = new Date(right_time - 86400000 * 15).toDateString();
			const seven_day = new Date(right_time - 86400000 * 7).toDateString();
			const licenses_date = new Date(value.expiry_date * 1000).toDateString();
			console.log(thirty);
			if (licenses_date === fiften_day) {
				sendInfo(value);
			}
			if (licenses_date === seven_day) {
				sendInfo(value);
			}
			if (licenses_date === thirty) {
				sendInfo(value);
			}
		});
	}
	mails(request_data) {
		try {
			app.sendSMS({
				to: `${request_data.phone_code}${request_data.phone}`,
				message: `${request_data.otp} ${lang[request_data.lang].OTP}`,
			});
			return true;
		} catch (error) {
			//
		}
	}
}

module.exports = UserController;

const sendInfo = (data) => {
	const message = `Your Driving Licence is about to Expire ,Please renew it.`;
	try {
		app.sendSMS({
			to: `${data.phone_code}${data.phone}`,
			message,
		});
		const pushObject = {
			token: data.device_token,
			message,
			notification_code: 1,
			body: [],
		};
		app.send_push(pushObject);
		const mail = {
			to: data.email,
			subject: message,
			template: 'licence',
			data: {
				first_name: data.name,
				last_name: data.name,
			},
		};
		app.send_mail(mail);
		return true;
	} catch (error) {
		//
	}
};
const sendSignupMail = (data) => {
	const mail = {
		to: data.email,
		subject: 'Account Details',
		template: 'user_signup',
		data: {
			name: data.name,
			email: data.email,
			password: data.password,
		},
	};
	app.send_mail(mail);
};
