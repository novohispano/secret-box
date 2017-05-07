const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')

const SecretsController = require('./lib/controllers/secrets-controller')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'

app.get('/', (request, response) => {
  response.send(app.locals.title)
})

app.get('/api/secrets/:id', (request, response) => {
  SecretsController.show(request, response)
})

app.post('/api/secrets', (request, response) => {
  SecretsController.create(request, response)
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
