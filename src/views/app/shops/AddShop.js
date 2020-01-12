import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import { Row, Card, CardBody, Input, CardTitle, FormGroup, Label, Button, Form } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { addAgency, getLatLong } from '../../../Apis/admin';
import Autocomplete from 'react-google-autocomplete';
import { initialState } from './Constants';
import { NotificationManager } from '../../../components/common/react-notifications';

const AddShop = React.memo(() => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const location = (place) => {
		dispatch({ key: 'address', value: place.formatted_address });
		getLatLong(place.formatted_address).then(res => { 
			const { data } = res;
			const latitude = data.results[0].geometry.location;
			dispatch({ key: 'latitude', value: latitude.latitude });
			dispatch({ key: 'longitude', value: latitude.longitude });
			console.log(res);
		}).catch(err => { 
			console.log(err);
		});
	};
	const [ shopForm, dispatch ] = useReducer(reducer, initialState);
	const [ loading, setIsLoading ] = useState(false);
	const [ redirect, setRedirect ] = useState(false);
	const addshop = (event) => {
		event.preventDefault();
		setIsLoading(true);
		addAgency(shopForm)
			.then(() => {
				setRedirect(true);
				NotificationManager.success('Angency add successfully', 'Success', 3000, null, null, '');
			})
			.catch((err) => {
				if (err.response) {
					const { data } = err.response;
					NotificationManager.warning(data.error_message, 'Something went wrong', 3000, null, null, '');
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleInput = (key, value) => {
		dispatch({ key, value });
	};

	if (redirect) {
		return <Redirect to="/agency" />;
	}
	return (
		<Fragment>
			<Row>
				<Colxx xxs="12">
					<h1>Add Agency</h1>
					<Separator className="mb-5" />
				</Colxx>
			</Row>
			<Row className="mb-4">
				<Colxx xxs="12">
					<Card>
						<CardBody>
							<CardTitle>Add Agency</CardTitle>
							<Form onSubmit={addshop}>
								<FormGroup row>
									<Colxx sm={6}>
										<FormGroup>
											<Label for="exampleEmailGrid">Agency Name</Label>
											<Input
												type="text"
												required={true}
												value={shopForm.name}
												onChange={({ target }) => handleInput('name', target.value)}
												name="name"
												placeholder="Shop Name"
											/>
										</FormGroup>
									</Colxx>

									<Colxx sm={6}>
										<FormGroup>
											<Label for="examplePasswordGrid">Phone</Label>
											<Input
												type="number"
												required={true}
												value={shopForm.phone}
												onChange={({ target }) => handleInput('phone', target.value)}
												name="phone"
												placeholder="Phone"
											/>
										</FormGroup>
									</Colxx>

									<Colxx sm={12}>
										<FormGroup>
											<Label for="exampleAddressGrid">Location</Label>
											<Autocomplete
												required={true}
												className="form-control"
												style={{ width: '100%' }}
												onPlaceSelected={(place) => {
													location(place);
												}}
											/>
										</FormGroup>
									</Colxx>

									<Colxx sm={12}>
										<FormGroup>
											<Label for="examplePasswordGrid">Profile</Label>
											<Input
												type="file"
												required={true}
												onChange={({ target }) => handleInput('profile', target.files[0])}
												name="profile"
												placeholder=""
											/>
										</FormGroup>
									</Colxx>
								</FormGroup>

								<Button
									disabled={loading}
									type="submit"
									className={`btn-shadow btn-multiple-state ${loading ? 'show-spinner' : ''}`}
									color="primary"
								>
									Save
								</Button>
							</Form>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default AddShop;
