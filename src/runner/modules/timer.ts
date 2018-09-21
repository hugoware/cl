
const Timer = { __timers: [ ] };

Timer.wait = time => {
	return new Promise(resolve => setTimeout(resolve, time));
};

Timer.interval = async (time, action) => {
	Timer.__timers.push(setInterval(action, time));
};