
export const controller = true;


export function onEnter() {
  this.progress.block();
  this.editor.readOnly('/index.html', false);

  // const markup = this.content.getFile('/index.html');
  // console.log('markup');
  
  // let cursor = 0;
  // setInterval(() => this.editor.cursor(++cursor), 2000);

  let hint = 8;
  setInterval(() => this.editor.hint('just a hint', { index: ++hint }), 1000);
  this.editor.hint('just a hint', { index: hint });
  
  let start = 8;
  let end = start + 5;
  setInterval(() => {
  	start++;
  	end++;
  	end++;
  	this.editor.area({ start, end });
  }, 1000);

  // this.editor.area(82, 179, { path: '/index.html' });
  // this.editor.marker('start', { start: 5, end: 15 });
  
}

export function onContentChange() {

  // this.editor.hint('You need to change this', 5)

}