/*!
 * amd-define-factory-patcher-loader
 * @version 1.0.0
 * @author Alexander O'Mara
 * @copyright Copyright (c) 2015 Alexander O'Mara
 * @license MPL 2.0 <http://mozilla.org/MPL/2.0/>
 */

'use strict';

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

module.exports = function(source, map) {
	var
		modified = false,
		ast;
	
	//Allow caching.
	this.cacheable();
	
	//Parse the code.
	ast = esprima.parse(source);
	
	//Traverse the tree looking for things to replace.
	estraverse.replace(ast, {
		enter: function(node) {
			var
				i,
				l,
				dependencies = false,
				factory = false;
			
			//Look for define calls.
			if (node.type === 'CallExpression' && node.callee.name === 'define' ) {
				//Iterate over the arguments.
				for (i = -1, l = node.arguments.length; ++i < l;) {
					switch (node.arguments[i].type) {
						case 'ArrayExpression':
							dependencies = true;
							break;
						case 'FunctionExpression':
							factory = true;
							break;
					}
				}
				//If dependencies were defined without a factory add a factory.
				if ( dependencies && ! factory ) {
					node.arguments.push({
						type: 'FunctionExpression',
						id: null,
						params: [],
						defaults: [],
						body: {
							type: 'BlockStatement',
							body: []
						},
						generator: false,
						expression: false
					});
					modified = true;
				}
			}
		}
	});
	
	//If the code was modified, generate modified source.
	if (modified) {
		source = escodegen.generate(ast);
	}
	
	//Continue on.
	this.callback(null, source, map);
};
