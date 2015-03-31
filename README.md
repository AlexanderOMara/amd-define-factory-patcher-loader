# AMD define factory patcher webpack loader

Adds support for non-standard AMD `define` statements with optional `factory` to webpack.


## Overview

According to [the AMD specification](https://github.com/amdjs/amdjs-api/wiki/AMD), the `factory` argument is not optional. Unfortunately, some AMD loaders such as RequireJS differ from the specification. This has resulted in some libraries depending on the non-standard feature, creating problem code like this.

```js
define(['./some-file']);
```

This webpack loader can be used to preprocess those problem files and add an empty `factory` function so that the code can be processed correctly. After being passed through this loader, the problem code will be transformed to look like this.

```js
define(['./some-file'], function() {
});
```


## Installation

`npm install amd-define-factory-patcher-loader`


## Usage

Add a loader directive to match the file(s) you need to patch. The following is an example `webpack.config.js` configuration that will match a file path ending in `path/to/problem/file.js`.

```js

module.exports = {
    entry: './entry',
    output: {
        filename: 'bundle.js'
    },
	module: {
		loaders: [
			{ test: /path\/to\/problem\/file\.js$/, loader: 'amd-define-factory-patcher-loader' }
		]
	}
};
```

To avoid causing issues in spec-compliant libraries, make sure you only target files that have this problem.


## Bugs

If you find a bug or have compatibility issues, please open a ticket under the issues section for this repository.


## License

See [LICENSE.txt](LICENSE.txt)

If this license does not work for you, feel free to contact me.


## Donations

If you find my software useful, please consider making a modest donation on my website at [alexomara.com](http://alexomara.com).
