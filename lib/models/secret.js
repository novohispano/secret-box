const environment   = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database      = require('knex')(configuration)

function find (id) {
  return database.raw(
    'SELECT * FROM secrets WHERE id = ? LIMIT 1',
    [id]
  ).then((data) => {
    return data.rows[0]
  })
}

function create (message) {
  return database.raw(
    'INSERT INTO secrets (message, created_at) VALUES (?, ?) RETURNING id',
    [message, new Date]
  ).then((data) => {
    const id = data.rows[0]['id']
    return find(id)
  })
}

function destroyAll () {
  return database.raw('TRUNCATE secrets RESTART IDENTITY')
}

module.exports = {
  find: find,
  create: create,
  destroyAll: destroyAll
}
