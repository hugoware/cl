
export const controller = true;

// entering and resetting
export function onInit() {
 	this.editor.area.lines(9, 12);
}

// initial entry for the slide
export function onEnter() {
  this.progress.block();
  this.editor.readOnly('/index.html', false);
  this.editor.area.lines(9, 12);

  // let hint = 8;
  // setInterval(() => this.editor.hint('just a hint', { index: ++hint }), 1000);
  // this.editor.hint('just a hint', { index: hint });
  
  // let start = 8;
  // let end = start + 5;
  // setInterval(() => {
  // 	start++;
  // 	end++;
  // 	end++;
  // 	this.editor.area({ start, end });

  // 	console.log('try get');
  // 	const content = this.editor.area.content();
  // 	console.log(content);
  // }, 1000);

  // this.editor.area(82, 179, { path: '/index.html' });
  // this.editor.marker('start', { start: 5, end: 15 });
  
  this.invoke('contentChange');
  
}

export function onContentChange() {

	const content = this.editor.area.content();

	const result = this.validate.html(content, test => test
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')
		.eof());

	// update validation
	this.editor.hint.validate(result);
	
	// update progress
	this.progress.update(result, {
		allow: () => this.assistant.say(`Great! Let's move to the next step!`),
		deny: () => this.assistant.show(this.slide.content),
		always: this.sound.notify
	});

}