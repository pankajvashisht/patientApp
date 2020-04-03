const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const app = require('../../../libary/CommanMethod');
const { config } = require('../../../config');
const axios = require('axios');
let apis = new ApiController();
let DB = new Db();

module.exports = {
	getLicense: async Request => {
		let offset = Request.params.offset || 1;
		const limit = Request.query.limit || 10;
		const search = Request.query.search || '';
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				user_id: Request.body.user_id
			},
			limit: [offset, limit],
			orderBy: ['id desc']
		};
		if (search) {
			condition.conditions[`like`] = {
				first_name: search,
				last_name: search
			};
		}
		const result = await DB.find('licenses', 'all', condition);
		return {
			message: 'Lista patenti',
			data: app.addUrl(result, 'licenses_image')
		};
	},
	getAngency: async Request => {
		let offset = Request.params.offset || 1;
		const limit = Request.query.limit || 10;
		const search = Request.query.search || '';
		const postCode = Request.query.postCode || false;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				status: 1
			},
			fields: [
				'agencies.*',
				'IFNULL(ROUND((select avg(rating) from ratings where agency_id=agencies.id),0),0) as rating'
			],
			limit: [offset, limit],
			orderBy: ['id desc']
		};
		const lat_long = {
			latitude: 0,
			longitude: 0
		};
		if (postCode) {
			const address = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?components=geocode|postal_code:${postCode}&key=${config.GOOGLE_MAP_KEY}`
			);
			const {
				data: { results = [] }
			} = address;
			if (results.length === 0) throw new ApiError('Invaild Post code', 422);
			const { lat, lng } = results[0].geometry.location;
			lat_long.latitude = lat;
			lat_long.longitude = lng;
			condition.conditions['location'] = [
				`round(( 6371 * acos( cos( radians(${lat}) ) * cos( radians(latitude) ) * cos( radians( longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin(radians(latitude)) ) ),0) < 50`
			];
		}
		if (search) {
			condition.conditions[`like`] = {
				name: search,
				location: search,
				phone: search
			};
		}
		const result = await DB.find('agencies', 'all', condition);
		return {
			message: 'Lista Agenzie',
			data: {
				postcodeInfo: lat_long,
				result: app.addUrl(result, 'image')
			}
		};
	},
	giveRating: async Request => {
		const required = {
			user_id: Request.body.user_id,
			rating: Request.body.rating,
			comment: Request.body.comment,
			agency_id: Request.body.agency_id
		};
		const RequestData = await apis.vaildation(required, {});
		if (RequestData.rating > 5 || RequestData.rating < 1) {
			throw new ApiError('Il punteggio deve essere compreso fra 1 e 5', 422);
		}
		const agency = await DB.find('agencies', 'first', {
			conditions: {
				id: RequestData.agency_id
			}
		});
		if (!agency) throw new ApiError('Agenzia non valida', 400);
		RequestData.id = await DB.save('ratings', RequestData);
		return {
			message: 'Recensione pubblicata correttamente',
			data: RequestData
		};
	},
	getRating: async Request => {
		let offset = Request.params.offset || 1;
		const limit = Request.query.limit || 10;
		const agency_id = Request.query.agency_id || 10;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				agency_id
			},
			join: [
				'users on (users.id = ratings.user_id)',
				'agencies on (agencies.id = ratings.agency_id)'
			],
			fields: [
				'ratings.*',
				'users.name as user_name',
				'users.email as user_email',
				'users.phone as user_phone',
				'users.profile',
				'agencies.phone as agency_phone',
				'agencies.name as agency_name',
				'agencies.*'
			],
			limit: [offset, limit],
			orderBy: ['ratings.id desc']
		};
		const result = await DB.find('ratings', 'all', condition);
		return {
			message: 'rating list',
			data: app.addUrl(result, ['image', 'profile'])
		};
	},
	addLicenses: async Request => {
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
			RequestData.licenses_image = await app.upload_pic_with_await(
				Request.files.licenses_image
			);
		}
		RequestData.id = await DB.save('licenses', RequestData);
		return {
			message: 'Patente aggiunta',
			data: RequestData
		};
	},
	deleteLicenses: async Request => {
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
		if (!licenses_info) throw new ApiError('Licenza non valida', 400);
		DB.first(`delete from licenses where id = ${RequestData.licenses_id}`);
		return {
			message: 'Patente eliminata',
			data: []
		};
	},
	updateLicenses: async Request => {
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
		if (!licenses_info) throw new ApiError('Licenza non valida', 400);
		if (Request.files && Request.files.licenses_image) {
			RequestData.licenses_image = await app.upload_pic_with_await(
				Request.files.licenses_image
			);
		}
		RequestData.id = RequestData.licenses_id;
		RequestData.id = await DB.save('licenses', RequestData);
		return {
			message: ' licenses updated Successfully',
			data: RequestData
		};
	}
};
