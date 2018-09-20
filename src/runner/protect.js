
import * as $esprima from 'esprima';
import * as $escodegen from 'escodegen';

// scripts
import uiBlockProtectionScript from './protect-ui-block.ts';

export default function protectCode(code, options = { }) {

	// collect each option
	const {
		applyAsync = true,
		protectBlockedUI = true
	} = options;

	// parse the tree first
	const tree = $esprima.parseModule(code, { });

	// apply safety features
	walkTree(tree, protectNode, { applyAsync, protectBlockedUI });

	// generate the new code
	code = $escodegen.generate(tree);

	// include libraries
	code = `(async () => {

		${protectBlockedUI ? uiBlockProtectionScript : ''}

		${code}

	})();`;

	return code;
}


// applies helpers to the entire tree
function protectNode(node, options) {

	// checking functions
	if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
		if (options.protectBlockedUI)
			protectBody(node);

		// test for async changes
		if (options.applyAsync)
			node.async = true;
	}

			// converting async calls
	else if (options.applyAsync && node.type === 'CallExpression') {
		const inner = Object.assign({}, node);
		node.type = 'AwaitExpression';
		node.argument = inner;
	}
	// protecting loops from infinite calls
	else if (options.protectBlockedUI && (
		node.type === "ForStatement" ||
		node.type === "WhileStatement" ||
		node.type === "DoWhileStatement")) {
		protectBody(node);
	}
}


// applies a infinite/recursive protection exception
function protectBody(node) {
	const protect = createBlockedApplicationProtection();

	// it's already a block
	if (node.body.type === 'BlockStatement') // && (node.body.body instanceof Array || typeof node.body.body === 'array'))
		node.body.body.unshift(protect);

	// it's a single line, convert to a block
	else 
		node.body = {
			type: 'BlockStatement',
			body: [ protect, node.body ]
		};
}

// creates a node that protects against blocked 
function createBlockedApplicationProtection() {
	return {
		"type": "IfStatement",
		"test": {
			"type": "CallExpression",
			"callee": {
				"type": "Identifier",
				"name": "isApplicationBlocked"
			},
			"arguments": []
		},
		"consequent": {
			"type": "ThrowStatement",
			"argument": {
				"type": "Literal",
				"value": "infinite loop",
				"raw": "\"infinite loop\""
			}
		},
		"alternate": null
	};
}


// walks an entire AST tree
function walkTree(ast, handler, options) {
	var stack = [ast], i, j, key, len, node, child;

	// start working the way down the tree
	for (i = 0; i < stack.length; i += 1) {
		node = stack[i];

		// perform the work
		handler(node, options)

		// already awaiting - nothing do do
		if (node.type === 'AwaitExpression')
			continue;

		// no constructors
		if (node.type === 'MethodDefinition' && node.key.name === 'constructor')
			continue;

		// ignore promises
		if (node.type === 'NewExpression' && node.callee.name === 'Promise')
			continue;

		// check for anything that has children
		for (key in node) {
			child = node[key]

			if (child instanceof Array)
				for (j = 0, len = child.length; j < len; j += 1)
					stack.push(child[j]);

			else if (child != void 0 && typeof child.type === 'string')
				stack.push(child)
		}
	}
}