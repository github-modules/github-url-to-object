# github-url-to-object  [![Build Status](https://travis-ci.org/zeke/github-url-to-object.png?branch=master)](https://travis-ci.org/zeke/github-url-to-object)

A node module that extracts useful properties like `user` and
`repo` from various flavors of GitHub URLs.

There's also a Bitbucket equivalent to this library: [bitbucket-url-to-object](https://github.com/zeke/bitbucket-url-to-object).

## Installation

```sh
npm install github-url-to-object --save
```

## Usage

Pass whatever flavor of github URL you like:

```js
var gh = require('github-url-to-object')

gh('monkey/business')
gh('https://github.com/monkey/business')
gh('https://github.com/monkey/business.git')
gh('http://github.com/monkey/business')
gh('git://github.com/monkey/business.git')
```

Here's what you'll get:

```js
{
  user: 'monkey',
  repo: 'business',
  branch: 'master',
  https_url: 'https://github.com/monkey/business',
  tarball_url: 'https://api.github.com/repos/monkey/business/tarball'
  travis_url: 'https://travis-ci.org/monkey/business',
}
```

The shorthand format lets you specify a branch:

```js
  gh('monkey/business#nachos')
{
  user: 'monkey',
  repo: 'business',
  branch: 'nachos',
  https_url: 'https://github.com/monkey/business/tree/nachos',
  tarball_url: 'https://api.github.com/repos/monkey/business/tarball/nachos'
  travis_url: 'https://travis-ci.org/monkey/business',
}
```

If you provide a non-github URL or a falsy value, you'll get `null`.

## Test

```sh
npm install
npm test
```

## License

MIT
