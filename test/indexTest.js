var mocha = require("mocha");
var assert = require("assert");
var gh = require("../index");

describe("github-url-to-object", function() {
  it("extracts username and repo from github URL", function() {
    var repo = gh("https://github.com/heroku/heroku-buildpack-nodejs.git");
    assert.equal(repo.user, 'heroku');
    assert.equal(repo.name, 'heroku-buildpack-nodejs');
  });
  it("handles URLs without .git at the end", function() {
    var repo = gh("https://github.com/zeke/outlet");
    assert.equal(repo.user, 'zeke');
    assert.equal(repo.name, 'outlet');
  });
  it("handles http URLs", function() {
    var repo = gh("http://github.com/zeke/outlet.git");
    assert.equal(repo.user, 'zeke');
    assert.equal(repo.name, 'outlet');
  });
  it("handles https URLs", function() {
    var repo = gh("https://github.com/zeke/outlet.git");
    assert.equal(repo.user, 'zeke');
    assert.equal(repo.name, 'outlet');
  });
  it("handles git URLs", function() {
    var repo = gh("git://github.com/foo/bar.git");
    assert.equal(repo.user, 'foo');
    assert.equal(repo.name, 'bar');
  });
  it("handles shorthand user/repo paths", function() {
    var repo = gh("foo/bar");
    assert.equal(repo.user, 'foo');
    assert.equal(repo.name, 'bar');
  });

});
