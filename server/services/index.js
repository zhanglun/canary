cosnt MusicService = require('./music');

module.exports = (app) => {
	music: new MusicService(app),
};
