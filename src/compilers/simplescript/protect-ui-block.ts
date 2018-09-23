function isApplicationBlocked() {
	return (Date.now() - 500) > isApplicationBlocked.__PULSE__;
}

isApplicationBlocked.__PULSE__ = Date.now();
setInterval(() => isApplicationBlocked.__PULSE__ = Date.now(), 100);