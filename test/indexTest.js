var mocha = require("mocha");
var assert = require("assert");
var gh = require("../index");

describe("github-url-to-object", function() {
  it("extracts username and repo from github URL", function() {
    var obj = gh("https://github.com/heroku/heroku-buildpack-nodejs.git");
    assert.equal(obj.user, 'heroku');
    assert.equal(obj.repo, 'heroku-buildpack-nodejs');
  });
  it("handles URLs without .git at the end", function() {
    var obj = gh("https://github.com/zeke/outlet");
    assert.equal(obj.user, 'zeke');
    assert.equal(obj.repo, 'outlet');
  });
  it("handles http URLs", function() {
    var obj = gh("http://github.com/zeke/outlet.git");
    assert.equal(obj.user, 'zeke');
    assert.equal(obj.repo, 'outlet');
  });
  it("handles https URLs", function() {
    var obj = gh("https://github.com/zeke/outlet.git");
    assert.equal(obj.user, 'zeke');
    assert.equal(obj.repo, 'outlet');
  });
  it("handles git URLs", function() {
    var obj = gh("git://github.com/foo/bar.git");
    assert.equal(obj.user, 'foo');
    assert.equal(obj.repo, 'bar');
  });
  it("handles shorthand user/repo paths", function() {
    var obj = gh("foo/bar");
    assert.equal(obj.user, 'foo');
    assert.equal(obj.repo, 'bar');
  });

  it("handles git@ URLs", function() {
    var obj = gh("git@github.com:heroku/heroku-flags.git");
    assert.equal(obj.user, 'heroku');
    assert.equal(obj.repo, 'heroku-flags');
  });

});
