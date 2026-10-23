const test = require('node:test');
const assert = require('node:assert');
const { slugify } = require('../index.js');
test('slugify', () => assert.strictEqual(slugify('Hello, World!'), 'hello-world'));
