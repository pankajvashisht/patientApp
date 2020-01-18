class Cron {
	constructor(time) {
		this.cron_time = time || 86400;
	}
	start(callback) {
		this.currentCron = setInterval(() => {
			callback();
		}, this.cron_time);
	}

	stop() {
		this.currentCron.clearInterval();
	}
}

module.exports = Cron;
