const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const md5        = require('md5')

const environment   = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database      = require('knex')(configuration)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.get('/api/secrets/:id', (request, response) => {
  database.raw('SELECT * FROM secrets WHERE id = ? LIMIT 1', [request.params.id]).then((data) => {
    const record = data.rows[0]

    if (record == null) {
      response.sendStatus(404)
    } else {
      response.json(record)
    }
  })
})

app.post('/api/secrets', (request, response) => {
  const message = request.body.message

  if (!message) {
    return response.status(422).send({
      error: 'No message property provided'
    })
  } else {
    const id = md5(message)
    app.locals.secrets[id] = message
    response.status(201).json({ id, message })
  }
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
