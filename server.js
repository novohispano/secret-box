const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const md5        = require('md5')

const Secret = require('./lib/models/secret')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.get('/api/secrets/:id', (request, response) => {
  Secret.find(request.params.id).then((data) => {
    if (data == null) {
      response.sendStatus(404)
    } else {
      response.json(data)
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
    Secret.create(message).then((data) => {
      response.status(201).json(data)
    })
  }
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
