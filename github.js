const GitHubApi = require('github')
const moment = require('moment')

module.exports = function () {
  const GITHUB_HOST = process.env.GITHUB_HOST || 'api.github.com'
  const GITHUB_PROTOCOL = process.env.GITHUB_PROTOCOL || 'https'
  const GITHUB_PATH_PREFIX = process.env.GITHUB_PATH_PREFIX
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  if (!GITHUB_TOKEN) throw new Error('You have to set the GITHUB_TOKEN env variable.')

  var github = new GitHubApi({
      protocol: GITHUB_PROTOCOL,
      host: GITHUB_HOST,
      pathPrefix: GITHUB_PATH_PREFIX,
      headers: {'user-agent': 'github-badges--milestone'},
      // Promise: require('bluebird'),
      timeout: 5000
  })

  github.authenticate({
      type: 'token',
      token: GITHUB_TOKEN
  })

  return {
    milestones: function (opts, cb) {
      github.issues.getMilestones({
        owner: opts.owner,
        repo: opts.repo,
      }, function (err, milestones) {
        if (err) return cb(new Error(err.message))

        milestones = milestones.data.map(function (m) {
          return {
            title: removeEmojis(m.title),
            description: m.description ? removeEmojis(m.description) : '',
            url: m.html_url,
            complete: Math.round(100 / (m.open_issues + m.closed_issues) * m.closed_issues),
            open: m.open_issues,
            closed: m.closed_issues,
            ago: moment(m.updated_at).fromNow(),
            due: m.due_on ? 'Due by ' + moment(m.due_on).format('MMM D, YYYY') : 'No due date'
          }
        })
        cb(null, milestones)
      })
    }
  }
}

// Apparently unicode characters aren't supported in svg
const gemoji = require('gemoji')
const regex = require('emoji-regex')()
function removeEmojis (str) {
  return str.replace(regex, function (emoji) {
    emoji = gemoji.unicode[emoji]
    if (emoji) return `:${emoji.name}:`
    else return '??'
  })
}
