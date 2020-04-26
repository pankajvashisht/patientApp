import axios from '../utils/handleAxios';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
export const Adminlogin = ({ email, password }) => {
	return axios.post(`/login`, {
		email,
		password,
	});
};

export const dashBoard = () => {
	return axios.get(`/dashboard`);
};
export const users = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/users/${page}/${limit}?q=${q}`);
};
export const Agency = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/agency/${page}/${limit}?q=${q}`);
};

export const appInfo = () => {
	return axios.get(`/appInfo`);
};
export const updateAppInfo = (data) => {
	return axios.put(`/appInfo`, data);
};
export const addUser = (data) => {
	const form = new FormData();
	form.append('name', data.name);
	form.append('address', data.address);
	form.append('latitude', data.latitude);
	form.append('longitude', data.longitude);
	form.append('password', data.password);
	form.append('phone', data.phone);
	form.append('email', data.email);
	form.append('user_type', data.user_type);
	form.append('profile', data.profile);
	form.append('status', 1);
	form.append('licence', data.licence);
	form.append('dob', data.dob);
	form.append('card_informations', 'null');
	return axios.post(`/users`, form);
};

export const addAgency = (data) => {
	const form = new FormData();
	form.append('name', data.name);
	form.append('location', data.address);
	form.append('latitude', data.latitude);
	form.append('longitude', data.longitude);
	form.append('phone', data.phone);
	form.append('image', data.profile);
	form.append('email', data.email);
	form.append('street_no', data.street_no);
	form.append('post_code', data.post_code);
	form.append('city', data.city);
	form.append('country', data.country);
	return axios.post(`/agency`, form);
};

export const updateProfile = (data) => {
	const form = new FormData();
	form.append('first_name', data.first_name);
	form.append('last_name', data.last_name);
	form.append('password', data.password);
	form.append('email', data.email);
	form.append('token', data.token);
	form.append('profile', data.image);
	form.append('id', data.id);
	return axios.post(`/admin-profile`, form);
};

export const getLatLong = async (location) => {
	const [geocode] = await geocodeByAddress(location);
	const latLng = await getLatLng(geocode);
	return {
		...latLng,
		geocode,
	};
};

export const updateUser = (data) => {
	return axios.put(`/users?`, {
		table: data.table,
		id: data.id,
		status: data.status,
	});
};

export const deleteUser = (data) => {
	return axios.delete(
		`/users`,
		{ data },
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);
};
