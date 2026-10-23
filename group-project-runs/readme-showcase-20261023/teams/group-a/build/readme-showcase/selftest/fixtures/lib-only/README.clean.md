# slugify-lite

slugify-lite turns a title into a URL slug: lower case, words joined by hyphens.

```js
const { slugify } = require('./index.js');
console.log(slugify('Hello, World!'));
```

```text
hello-world
```

## Requirements

Node 18 or newer.

## Tests

```bash
npm test
```

## License

ISC
