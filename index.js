"use strict"

var url = require("url")
var util = require("util")
var isUrl = require("is-url")

module.exports = function(repo_url) {
  var obj = {}

  if (!repo_url) return null

  var shorthand = repo_url.match(/^([\w-_]+)\/([\w-_\.]+)#?([\w-_\.]+)?$/)
  var antiquated = repo_url.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/)

  if (shorthand) {
    obj.user = shorthand[1]
    obj.repo = shorthand[2]
    obj.branch = shorthand[3] || "master"
  } else if (antiquated) {
    obj.user = antiquated[1]
    obj.repo = antiquated[2].replace(/\.git$/i, "")
    obj.branch = "master"
  } else {
    if (!isUrl(repo_url)) return null
    var parsedURL = url.parse(repo_url)
    if (parsedURL.hostname != "github.com") return null
    var parts = parsedURL.pathname.match(/^\/([\w-_]+)\/([\w-_\.]+)/)
    if (!parts) return null
    obj.user = parts[1]
    obj.repo = parts[2].replace(/\.git$/i, "")
    obj.branch = "master"
  }

  obj.tarball_url = "https://api.github.com/repos/" + obj.user + "/" + obj.repo + "/tarball"
  obj.https_url = "https://github.com/" + obj.user + "/" + obj.repo
  obj.travis_url = "https://travis-ci.org/" + obj.user + "/" + obj.repo
  return obj
}
