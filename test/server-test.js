const assert  = require('chai').assert
const app     = require('../server')
const request = require('request')

describe('Server', () => {
  before(done => {
    this.port   = 9876

    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err) }
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    })
  })

  after(() => {
    this.server.close()
  })

  it('should exist', () => {
    assert(app)
  })

  describe('GET /', () => {
    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 200)

        done()
      })
    })

    it('should have a body with the name of the application', (done) => {
      var title = app.locals.title

      this.request.get('/', (error, response) => {
        if (error) { done(error) }

        assert(response.body.includes(title), `"${response.body}" does not include "${title}".`)

        done()
      })
    })
  })

  describe('GET /api/secrets/:id', () => {
    beforeEach(() => {
      app.locals.secrets = {
        wowowow: 'I am a banana'
      }
    })

    it('should return a 404 if the resource is not found', (done) => {
      this.request.get('/api/secrets/bahaha', (error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 404)

        done()
      })
    })

    it('should have the id and the message from the resource', (done) => {
      const id      = 'wowowow'
      const message = app.locals.secrets['wowowow']

      this.request.get('/api/secrets/wowowow', (error, response) => {
        if (error) { done(error) }

        assert(response.body.includes(id), `"${response.body}" does not include "${id}."`)
        assert(response.body.includes(message), `"${response.body}" does not include "${message}."`)

        done()
      })
    })
  })

  describe('POST /api/secrets', () => {
    beforeEach(() => {
      app.locals.secrets = {}
    })

    it('should not return a 404', (done) => {
      this.request.post('/api/secrets', (error, response) => {
        if (error) { done(error) }

        assert.notEqual(response.statusCode, 404)

        done()
      })
    })

    it('should receive and store data', (done) => {
      const message = {
        message: 'I like pineapples!'
      }

      this.request.post('/api/secrets', { form: message }, (error, response) => {
        if (error) { done(error) }

        const secretCount = Object.keys(app.locals.secrets).length

        assert.equal(secretCount, 1, `Expected 1 secret, found ${secretCount}`)

        done()
      })
    })
  })
})
