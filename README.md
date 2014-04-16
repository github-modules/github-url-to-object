# github-url-to-object

Extract username and repo name from various flavors of GitHub URLs.

## Installation

```sh
npm install github-url-to-object --save
```

## Usage

Pass whatever flavor of github URL you like:

```js
var gh = require('github-url-to-object')

gh('user/repo')
gh('https://github.com/monkey/business')
gh('https://github.com/monkey/business.git')
gh('http://github.com/monkey/business')
gh('git://github.com/monkey/business.git')
```

Here's what you'll get back:

```js
{
  user: 'monkey',
  repo: 'business'
}
```

If you provide a non-github URL or a falsy value, you'll get `null` back.

## Test

```sh
npm test
```

## License

WTFPL
