const http = require('http')
const github = require('./github')()
const router = require('wayfarer')('/404')

router.on('/404', function (params, req, res) {
  console.log()
  res.writeHead(404)
  res.write('404')
  res.end()
})

router.on('/:owner/:repo/milestones/:type', function (params, req, res) {
  github.milestones({
    owner: params.owner,
    repo: params.repo
  }, function (err, milestones) {
    if (err) {
      console.error(err)
      const badge = milestoneBadge({
        title: 'Milestone not found',
        description: err.message
      })

      res.writeHead(404, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
        'Content-Length': badge.length
      })

      res.write(badge)
    } else {
      const type = params.type
      const name = type.replace('.svg', '')

      let milestone
      if (name === 'current') milestone = milestones[0]
      else if (name === 'next') milestone = milestones[1]
      else if (milestones[name]) milestone = milestones[name]

      if (/\.svg$/.test(type)) {
        let badgeString
        if (milestone) badgeString = milestoneBadge(milestone)
        else badgeString = milestoneBadge({title: 'Milestone not found'})

        res.writeHead(200, {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache',
          'Content-Length': badgeString.length
        })

        console.log(`svg: ${milestone.url}`)
        res.write(badgeString)
      } else {
        if (!milestone) {
          res.writeHead(404)
          res.write('Milestone not found')
        } else {
          console.log(`redirect: ${milestone.url}`)
          res.writeHead(302, {'Location': milestone.url})
          res.write(`Redirecting to ${milestone.url}`)
        }
      }
    }

    res.end()
  })
})

const server = http.createServer(function (req, res) {
  router(req.url, req, res)
})

server.listen(process.env.PORT || 8080, function (err) {
  if (err) throw err
  console.log('Listening on http://localhost:%s', server.address().port)
})

const compile = require('es6-template-strings/compile')
const resolveToString = require('es6-template-strings/resolve-to-string')
const readFileSync = require('fs').readFileSync

const badgeTemplate = compile(readFileSync('./badge.svg', 'utf8')
  .replace(/<!--.*-->/g, '') // remove comments
  .replace('<desc>Created with Sketch.</desc>', 'Milestone - ${title}') // replace title
  .replace(/114\.859155/g, '${width}'))

function milestoneBadge (m) {
  return resolveToString(badgeTemplate, {
    title: m.title,
    description: m.description,
    complete: m.complete || 0,
    open: m.open || 0,
    closed: m.closed || 0,
    ago: m.ago,
    due: m.due,
    width: 464 / 100 * (m.complete || 0) // {{width}} is a value from 0 to 464
  })
}
