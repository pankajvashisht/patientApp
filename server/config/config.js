require('dotenv').config();

const path = require('path');
const config = {
	App_name: process.env.APP_NAME || 'ROU',
	port: process.env.PORT || 4001,
	root_path: path.resolve(__dirname),
	GOOGLE_KEY:
		'AAAAggMOQW0:APA91bFj_eW3CEoHulsSClGRnGuJtiJ5hU-4fq_DqDUhZWci2obc2Y89RWgDOfSnyciau0rUdM3GQ3rvoCLskkKnaQ3TRevOPKHFk78_YsA5kiGpa6L0DWi_bYfObUopL-nj-Jkuw9Ng'
};

module.exports = config;
