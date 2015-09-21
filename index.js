'use strict'

var url = require('url')
var util = require('util')
var isUrl = require('is-url')

module.exports = function (repo_url) {
  var obj = {}

  if (!repo_url) return null

  var shorthand = repo_url.match(/^([\w-_]+)\/([\w-_\.]+)#?([\w-_\.]+)?$/)
  var mediumhand = repo_url.match(/^github:([\w-_]+)\/([\w-_\.]+)#?([\w-_\.]+)?$/)
  var antiquated = repo_url.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/)

  if (shorthand) {
    obj.user = shorthand[1]
    obj.repo = shorthand[2]
    obj.branch = shorthand[3] || 'master'
  } else if (mediumhand) {
    obj.user = mediumhand[1]
    obj.repo = mediumhand[2]
    obj.branch = mediumhand[3] || 'master'
  } else if (antiquated) {
    obj.user = antiquated[1]
    obj.repo = antiquated[2].replace(/\.git$/i, '')
    obj.branch = 'master'
  } else {
    // Turn git+http URLs into http URLs
    repo_url = repo_url.replace(/^git\+/, '')

    if (!isUrl(repo_url)) return null
    var parsedURL = url.parse(repo_url)

    if (!parsedURL.hostname) return null
    if (parsedURL.hostname !== 'github.com') return null
    var parts = parsedURL.pathname.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\w-_\.\/]+)?(\/blob\/[\w-_\.\/]+)?/)
    // ([\w-_\.]+)
    if (!parts) return null
    obj.user = parts[1]
    obj.repo = parts[2].replace(/\.git$/i, '')

    if (parts[3]) {
      obj.branch = parts[3].replace(/^\/tree\//, '').match(/[\w-_.]+\/{0,1}[\w-_]+/)[0]
    } else if (parts[4]) {
      obj.branch = parts[4].replace(/^\/blob\//, '').match(/[\w-_.]+\/{0,1}[\w-_]+/)[0]
    } else {
      obj.branch = 'master'
    }
  }

  obj.tarball_url = util.format('https://api.github.com/repos/%s/%s/tarball/%s', obj.user, obj.repo, obj.branch)

  if (obj.branch === 'master') {
    obj.https_url = util.format('https://github.com/%s/%s', obj.user, obj.repo)
    obj.travis_url = util.format('https://travis-ci.org/%s/%s', obj.user, obj.repo)
    obj.zip_url = util.format('https://github.com/%s/%s/archive/master.zip', obj.user, obj.repo)
  } else {
    obj.https_url = util.format('https://github.com/%s/%s/tree/%s', obj.user, obj.repo, obj.branch)
    obj.travis_url = util.format('https://travis-ci.org/%s/%s?branch=%s', obj.user, obj.repo, obj.branch)
    obj.zip_url = util.format('https://github.com/%s/%s/archive/%s.zip', obj.user, obj.repo, obj.branch)
  }

  obj.api_url = util.format('https://api.github.com/repos/%s/%s', obj.user, obj.repo)

  return obj
}
