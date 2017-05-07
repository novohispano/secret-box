const Secret = require('../models/secret')

function show (request, response) {
  Secret.find(request.params.id).then((data) => {
    if (data == null) {
      response.sendStatus(404)
    } else {
      response.json(data)
    }
  })
}

function create (request, response) {
  const message = request.body.message

  if (!message) {
    response.status(422).send({
      error: 'No message property provided'
    })
  } else {
    Secret.create(message).then((data) => {
      response.status(201).json(data)
    })
  }
}

module.exports = {
  show: show,
  create: create
}
