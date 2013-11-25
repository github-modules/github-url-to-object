# github-url-to-object

Extract username and repo name from various flavors of GitHub URLs.

## Installation

```sh
npm install github-url-to-object --save
```

## Usage

```js
require('github-url-to-object')('https://github.com/foo/bar.git');
// -> {user: 'foo', repo: 'git'}
```

## Test

```sh
npm test

✓ extracts username and repo from github URL
✓ handles URLs without .git at the end
✓ handles http URLs
✓ handles https URLs
✓ handles git URLs
✓ handles shorthand user/repo paths
```
## License

WTFPL