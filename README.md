# jsolog

Jsolog implements BSD syslog collector (RFC 3164) for JSON-messages. If recieved message is correct JSON you can do what you want with it. For example it allows you preprocess message before writing it into a database. 

You can use jsolog instead of rsyslog/syslogd. You can also use them together (on different ports) through forwarding messages from rsyslog/syslogd to jsolog. 

## Example
```
var Jsolog = require('jsolog'),
	jsolog = new Jsolog

jsolog.start(601) // returns net.Server object

jsolog.on('data', onData)
jsolog.on('error', onError)

function onError(err) {
	console.log('Error: %s', err.message)
}

function onData(msg, header) {
	/**
	 *  Using recieved data.
	 *
	 *  msg — JSON message
	 *  header — {facility, severity, time, host}
	 */
}
```
