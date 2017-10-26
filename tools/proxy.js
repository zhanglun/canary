const http = require('http');

const agent = new http.Agent();
const server =  http.createServer({
	hostname: 'localhost',
  port: 3000,
  // path: '/',
  agent: agent
}, () => {
	console.log(arguments);
});
server.listen(3001, () => {
	console.log('server start listening: 3000');
});
