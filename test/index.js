/* globals before, describe, it */

var assert = require('assert')
var gh = require('../index')

describe('github-url-to-object', function () {
  describe('shorthand', function () {
    it('supports user/repo style', function () {
      var obj = gh('user/repo#branch')
      assert.equal(obj.user, 'user')
      assert.equal(obj.repo, 'repo')
    })

    it('supports user/repo#branch style', function () {
      var obj = gh('user/repo#branch')
      assert.equal(obj.user, 'user')
      assert.equal(obj.repo, 'repo')
      assert.equal(obj.branch, 'branch')
    })

    it('defaults to master branch', function () {
      var obj = gh('user/repo')
      assert.equal(obj.user, 'user')
      assert.equal(obj.repo, 'repo')
      assert.equal(obj.branch, 'master')
    })

  })

  describe('mediumhand', function () {
    it('supports github:user/repo style', function () {
      var obj = gh('user/repo#branch')
      assert.equal(obj.user, 'user')
      assert.equal(obj.repo, 'repo')
    })

    it('supports github:user/repo#branch style', function () {
      var obj = gh('user/repo#branch')
      assert.equal(obj.user, 'user')
      assert.equal(obj.repo, 'repo')
      assert.equal(obj.branch, 'branch')
    })

    it('defaults to master branch', function () {
      var obj = gh('github:user/repo')
      assert.equal(obj.user, 'user')
      assert.equal(obj.repo, 'repo')
      assert.equal(obj.branch, 'master')
    })

    it('rejects bitbucket', function () {
      var obj = gh('bitbucket:user/repo')
      assert.equal(obj, null)
    })

  })

  describe('oldschool', function () {
    it('supports git@ URLs', function () {
      var obj = gh('git@github.com:heroku/heroku-flags.git')
      assert.equal(obj.user, 'heroku')
      assert.equal(obj.repo, 'heroku-flags')
    })

    it('defaults to master branch for git@ URLs', function () {
      var obj = gh('git@github.com:heroku/heroku-flags.git')
      assert.equal(obj.branch, 'master')
    })

    it('supports git+https:// URLs', function () {
      var obj = gh('git+https://github.com/foo/bar.git')
      assert.equal(obj.user, 'foo')
      assert.equal(obj.repo, 'bar')
    })

    it('supports git:// URLs', function () {
      var obj = gh('git://github.com/foo/bar.git')
      assert.equal(obj.user, 'foo')
      assert.equal(obj.repo, 'bar')
    })

    it('defaults to master branch for git:// URLs', function () {
      var obj = gh('git://github.com/foo/bar.git')
      assert.equal(obj.branch, 'master')
    })

  })

  describe('http', function () {
    it('supports http URLs', function () {
      var obj = gh('http://github.com/zeke/outlet.git')
      assert.equal(obj.user, 'zeke')
      assert.equal(obj.repo, 'outlet')
    })

    it('supports https URLs', function () {
      var obj = gh('https://github.com/zeke/outlet.git')
      assert.equal(obj.user, 'zeke')
      assert.equal(obj.repo, 'outlet')
    })

    it('supports deep URLs', function () {
      var obj = gh('https://github.com/zeke/ruby-rails-sample/blob/b1e1000fedb6ca448dd78702de4fc78dedfee48c/app.json')
      assert.equal(obj.user, 'zeke')
      assert.equal(obj.repo, 'ruby-rails-sample')
    })

    it("doesn't require .git extension", function () {
      var obj = gh('https://github.com/zeke/outlet')
      assert.equal(obj.user, 'zeke')
      assert.equal(obj.repo, 'outlet')
    })

    it('defaults to master branch', function () {
      var obj = gh('https://github.com/zeke/outlet')
      assert.equal(obj.branch, 'master')
    })

    it('resolves tree-style URLS for branches other than master', function () {
      var obj = gh('https://github.com/zeke/outlet/tree/other-branch')
      assert.equal(obj.branch, 'other-branch')
    })

    it('resolves URLS for branches containing /', function () {
      var obj = gh('https://github.com/zeke/outlet/tree/feature/other-branch')
      assert.equal(obj.branch, 'feature/other-branch')
    })

    it('resolves URLS for branches containing .', function () {
      var obj = gh('https://github.com/zeke/outlet/tree/2.1')
      assert.equal(obj.branch, '2.1')
    })

    it('resolves blob-style URLS for branches other than master', function () {
      var obj = gh('https://github.com/zeke/ord/blob/new-style/.gitignore')
      assert.equal(obj.branch, 'new-style')
    })

  })

  describe('properties', function () {
    var obj

    before(function () {
      obj = gh('zeke/ord')
    })

    it('user', function () {
      assert.equal(obj.user, 'zeke')
    })

    it('repo', function () {
      assert.equal(obj.repo, 'ord')
    })

    it('branch', function () {
      assert.equal(obj.branch, 'master')
    })

    it('tarball_url', function () {
      assert.equal(obj.tarball_url, 'https://api.github.com/repos/zeke/ord/tarball/master')
    })

    it('api_url', function () {
      assert.equal(obj.api_url, 'https://api.github.com/repos/zeke/ord')
    })

    it('https_url', function () {
      assert.equal(obj.https_url, 'https://github.com/zeke/ord')
    })

    it('travis_url', function () {
      assert.equal(obj.travis_url, 'https://travis-ci.org/zeke/ord')
    })

    it('zip_url', function () {
      assert.equal(obj.zip_url, 'https://github.com/zeke/ord/archive/master.zip')
    })

  })

  describe('branch other than master', function () {
    var obj

    before(function () {
      obj = gh('zeke/ord#experiment')
    })

    it('applies to tarball_url', function () {
      assert.equal(obj.tarball_url, 'https://api.github.com/repos/zeke/ord/tarball/experiment')
    })

    it('applies to https_url', function () {
      assert.equal(obj.https_url, 'https://github.com/zeke/ord/tree/experiment')
    })

    it("doesn't apply to api_url", function () {
      assert.equal(obj.api_url, 'https://api.github.com/repos/zeke/ord')
    })

    it('applies to travis_url', function () {
      assert.equal(obj.travis_url, 'https://travis-ci.org/zeke/ord?branch=experiment')
    })

    it('applies to zip_url', function () {
      assert.equal(obj.zip_url, 'https://github.com/zeke/ord/archive/experiment.zip')
    })

  })

  describe('failure', function () {
    it('returns null if url is falsy', function () {
      assert.equal(gh(), null)
      assert.equal(gh(null), null)
      assert.equal(gh(undefined), null)
      assert.equal(gh(''), null)
    })

    it('returns null for non-github URLs', function () {
      var obj = gh('https://bitbucket.com/other/thing')
      assert.equal(obj, null)
    })

  })

})
