var net = require('net'),
	events = require('events')

module.exports = Jsolog

function Jsolog() {
	var self = this

	this.start = start

	function start(port) {
		var server = net.createServer()

		server.on('connection', handleConnection)
		server.listen(port)

		return server
	}

	function handleConnection(conn) {
		var buffer = ''

		conn.setEncoding('utf8')
		conn.on('data', onConnData)
		conn.on('end', onConnEnd)
		conn.on('error', onConnError)

		function onConnData(data) {
			buffer += data
		}

		function onConnEnd() {
			parseAndSend(buffer)
		}

		function onConnError(err) {
			self.emit('error', err)
		}
	}

	function parseAndSend(data) {
		try {
			data = parseData(data)
			self.emit('data', data.msg, data.header)
		} catch (err) {
			self.emit('error', err)
		}
	}
}
Jsolog.prototype = new events.EventEmitter

function parseData(data) {
	var splitRE = /^<(\d{1,3})>((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s{1,2}\d{1,2}\s\d{2}:\d{2}:\d{2})\s(\S+)\s(.*)$/,
		splitted = splitRE.exec(data)

	if (!splitted) throw new Error('Data is not parsed')

	var [, pri, time, host, msg] = splitted,
		facility = pri / 8 | 0,
		severity = pri % 8

	msg = JSON.parse(msg)
	header = {facility, severity, time, host}

	return {msg, header}
}
