module.exports = function(url) {

  var re = /^(?:https?:\/\/|git:\/\/)?(?:[^@]+@)?(gist.github.com|github.com)[:\/]([^\/]+\/[^\/]+?|[0-9]+)$/
  var match = re.exec(url.replace(/\.git$/, ''));

  // support shorthand URLs
  var parts = match ? match[2].split('/') : url.split('/')

  return {
    user: parts[0],
    repo: parts[1]
  };

};
