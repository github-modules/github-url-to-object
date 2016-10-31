'use strict'

var url = require('url')
var util = require('util')
var isUrl = require('is-url')

module.exports = function (repoUrl, opts) {
  var obj = {}
  opts = opts || {}

  if (!repoUrl) return null

  var shorthand = repoUrl.match(/^([\w-_]+)\/([\w-_\.]+)#?([\w-_\.]+)?$/)
  var mediumhand = repoUrl.match(/^github:([\w-_]+)\/([\w-_\.]+)#?([\w-_\.]+)?$/)
  var antiquated = repoUrl.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/)

  if (shorthand) {
    obj.user = shorthand[1]
    obj.repo = shorthand[2]
    obj.branch = shorthand[3] || 'master'
    obj.host = 'github.com'
  } else if (mediumhand) {
    obj.user = mediumhand[1]
    obj.repo = mediumhand[2]
    obj.branch = mediumhand[3] || 'master'
    obj.host = 'github.com'
  } else if (antiquated) {
    obj.user = antiquated[1]
    obj.repo = antiquated[2].replace(/\.git$/i, '')
    obj.branch = 'master'
    obj.host = 'github.com'
  } else {
    // Turn git+http URLs into http URLs
    repoUrl = repoUrl.replace(/^git\+/, '')

    if (!isUrl(repoUrl)) return null
    var parsedURL = url.parse(repoUrl)

    if (!parsedURL.hostname) return null
    if (parsedURL.hostname !== 'github.com' && parsedURL.hostname !== 'www.github.com' && !opts.enterprise) return null

    var parts = parsedURL.pathname.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\w-_\.\/]+)?(\/blob\/[\w-_\.\/]+)?/)
    // ([\w-_\.]+)
    if (!parts) return null
    obj.user = parts[1]
    obj.repo = parts[2].replace(/\.git$/i, '')

    obj.host = parsedURL.hostname || 'github.com'

    if (parts[3] && /^\/tree\/master\//.test(parts[3])) {
      obj.branch = 'master'
      obj.path = parts[3].replace(/\/$/, '')
    } else if (parts[3]) {
      obj.branch = parts[3].replace(/^\/tree\//, '').match(/[\w-_.]+\/{0,1}[\w-_]+/)[0]
    } else if (parts[4]) {
      obj.branch = parts[4].replace(/^\/blob\//, '').match(/[\w-_.]+\/{0,1}[\w-_]+/)[0]
    } else {
      obj.branch = 'master'
    }
  }

  if (obj.host === 'github.com') {
    obj.apiHost = 'api.github.com'
  } else {
    obj.apiHost = util.format('%s/api/v3', obj.host)
  }

  obj.tarball_url = util.format('https://%s/repos/%s/%s/tarball/%s', obj.apiHost, obj.user, obj.repo, obj.branch)
  obj.clone_url = util.format('https://%s/%s/%s', obj.host, obj.user, obj.repo)

  if (obj.branch === 'master') {
    obj.https_url = util.format('https://%s/%s/%s', obj.host, obj.user, obj.repo)
    obj.travis_url = util.format('https://travis-ci.org/%s/%s', obj.user, obj.repo)
    obj.zip_url = util.format('https://%s/%s/%s/archive/master.zip', obj.host, obj.user, obj.repo)
  } else {
    obj.https_url = util.format('https://%s/%s/%s/blob/%s', obj.host, obj.user, obj.repo, obj.branch)
    obj.travis_url = util.format('https://travis-ci.org/%s/%s?branch=%s', obj.user, obj.repo, obj.branch)
    obj.zip_url = util.format('https://%s/%s/%s/archive/%s.zip', obj.host, obj.user, obj.repo, obj.branch)
  }

  // Support deep paths (like lerna-style repos)
  if (obj.path) {
    obj.https_url += obj.path
  }

  obj.api_url = util.format('https://%s/repos/%s/%s', obj.apiHost, obj.user, obj.repo)

  return obj
}
