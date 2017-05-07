const assert  = require('chai').assert
const app     = require('../server')
const request = require('request')

const Secret  = require('../lib/models/secret')

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

  it('should exist', () => assert(app) )

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
    beforeEach((done) => {
      Secret.create('I open bananas from the wrong side')
      .then(() => done())
    })

    afterEach((done) => {
      Secret.destroyAll()
      .then(() => done())
    })

    it('should return a 404 if the resource is not found', (done) => {
      this.request.get('/api/secrets/1000', (error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 404)

        done()
      })
    })


    it('should have the id and the message from the resource', (done) => {
      this.request.get('/api/secrets/1', (error, response) => {
        if (error) { done(error) }

        const id         = 1
        const message    = "I open bananas from the wrong side"

        let parsedSecret = JSON.parse(response.body)

        assert.equal(parsedSecret.id, id)
        assert.equal(parsedSecret.message, message)
        assert.ok(parsedSecret.created_at)

        done()
      })
    })
  })

  describe('POST /api/secrets', () => {
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

        const id      = 1
        const message = "I like pineapples!"

        let parsedSecret = JSON.parse(response.body)

        assert.equal(parsedSecret.id, id)
        assert.equal(parsedSecret.message, message)
        assert.ok(parsedSecret.created_at)

        done()
      })
    })
  })
})
