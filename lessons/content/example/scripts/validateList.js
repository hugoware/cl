
export const controller = true;

export function onReset(file) {
	// console.log('is reset', file);

	// const content = this.editor.content();
	// console.log('is now', content);

	// this.invoke('init');
}

// entering and resetting
export function onInit() {
	console.log('will init');
 	this.editor.area.lines(9, 12);
}

export function onChangeTab(file) {
	console.log('change to tab', file);
	return true;
}

// // handles when selecting a range in the editor
// export function onSelection(selection) {

// 	if (selection.content === '<li>') {
// 		this.progress.allow();
// 		this.assistant.say(`That's what I was looking for`);
// 	}
// // 
// 	// console.log('did select', selection);

// }

// export function onClick() {

// }

export function onOpenFile() {
	return true;
}

export function onTryEditReadOnly(file) {
	// console.log('dont edit', file.name);
	// setTimeout(() => this.editor.readOnly('/style.css', false), 100);
}

// initial entry for the slide
export function onEnter() {
	this.editor.readOnly('/style.css');


	// this.editor.area('/style.css', 2);



	// this.content.set('/style.css', 'black');
	// this.content.set('/index.html', 'green', true);

	// console.log(this.content.get('/index.html'));
	// console.log(this.content.get('/style.css'));

  // this.progress.block();
  // this.editor.readOnly('/index.html', false);
  // this.editor.area.lines(9, 12);

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
  
  // this.invoke('contentChange');
  
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