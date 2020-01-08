const data = [
	{
		id: 'dashboards',
		icon: 'iconsminds-shop-4',
		label: 'Dashboards',
		to: '/'
	},
	{
		id: 'Users',
		icon: 'simple-icon-people',
		label: 'Users',
		to: '/users',
		subs: [
			{
				icon: 'simple-icon-user',
				label: 'Users',
				to: '/users'
			},
			{
				icon: 'iconsminds-add-user',
				label: 'Add User',
				to: '/add-user'
			}
		]
	},
	{
		id: 'Agency',
		icon: 'iconsminds-shop-2',
		label: 'Agency',
		to: '/agency',
		subs: [
			{
				icon: 'iconsminds-shop',
				label: 'Agency',
				to: '/agency'
			},
			{
				icon: 'iconsminds-add-basket',
				label: 'Add Agency',
				to: '/add-agency'
			}
		]
	},
	{
		id: 'App Informations',
		icon: 'iconsminds-monitor---phone',
		label: 'App Informations',
		to: '/app-information'
	}
];
export default data;
