const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const app = require('../../../libary/CommanMethod');
const { lang } = require('../../../config');
let apis = new ApiController();
let DB = new Db();

module.exports = {
	getLicense: async (Request) => {
		let offset = Request.params.offset || 1;
		const limit = Request.query.limit || 10;
		const search = Request.query.search || '';
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				user_id: Request.body.user_id
			},
			limit: [ offset, limit ],
			orderBy: [ 'id desc' ]
		};
		if (search) {
			condition.conditions[`like`] = {
				first_name: search,
				last_name: search
			};
		}
		const result = await DB.find('licenses', 'all', condition);
		return {
			message: 'licenses list',
			data: app.addUrl(result, 'licenses_image')
		};
	},
	addLicenses: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			first_name: Request.body.first_name,
			last_name: Request.body.last_name,
			dob: Request.body.dob,
			place_birth: Request.body.place_birth,
			release_date: Request.body.release_date,
			license_number: Request.body.license_number,
			expiry_date: Request.body.expiry_date, // should be int
			status: 1
		};
		const RequestData = await apis.vaildation(required, {});
		if (Request.files && Request.files.licenses_image) {
			RequestData.licenses_image = await app.upload_pic_with_await(Request.files.licenses_image);
		}
		RequestData.id = await DB.save('licenses', RequestData);
		return {
			message: ' licenses add Successfully',
			data: RequestData
		};
	},
	deleteLicenses: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			licenses_id: Request.body.licenses_id
		};
		const RequestData = await apis.vaildation(required, {});
		const licenses_info = await DB.find('licenses', 'first', {
			conditions: {
				user_id: RequestData.user_id,
				id: RequestData.licenses_id
			}
		});
		if (!licenses_info) throw new ApiError('Invaild licenses id', 400);
		DB.first(`delete from licenses where id = ${RequestData.licenses_id}`);
		return {
			message: ' licenses deleted Successfully',
			data: []
		};
	},
	updateLicenses: async (Request) => {
		const required = {
			licenses_id: Request.body.licenses_id
		};
		const nonRequired = {
			user_id: Request.body.user_id,
			licenses_name: Request.body.licenses_name,
			first_name: Request.body.first_name,
			last_name: Request.body.last_name,
			dob: Request.body.dob,
			place_birth: Request.body.place_birth,
			release_date: Request.body.release_date,
			license_number: Request.body.license_number,
			expiry_date: Request.body.expiry_date, // should be int
			status: 1
		};
		const RequestData = await apis.vaildation(required, nonRequired);
		const licenses_info = await DB.find('licenses', 'first', {
			conditions: {
				user_id: RequestData.user_id,
				id: RequestData.licenses_id
			}
		});
		if (!licenses_info) throw new ApiError('Invaild licenses id', 400);
		if (Request.files && Request.files.licenses_image) {
			RequestData.licenses_image = await app.upload_pic_with_await(Request.files.licenses_image);
		}
		RequestData.id = RequestData.licenses_id;
		RequestData.id = await DB.save('licenses', RequestData);
		return {
			message: ' licenses updated Successfully',
			data: RequestData
		};
	}
};
