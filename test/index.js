'use strict'

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const airbrake = require('../lib')
const lab = exports.lab = Lab.script()
const expect = Code.expect
const Joi = require('joi')
const schema = require('../lib/schema.js').options

lab.experiment('hapi airbrake plugin', () => {
  lab.test('Registers without erring', (done) => {
    const plugin = {
      register: airbrake,
      options: {
        key: 'x1x1x1x1',
        env: 'production'
      }
    }

    const server = new Hapi.Server()
    server.register(plugin, (err) => {
      expect(err).to.not.exist()
      done()
    })
  })

  lab.test('Errs on registration with incorrect config', (done) => {
    const plugin = {
      register: airbrake,
      options: {
      }
    }

    const server = new Hapi.Server()
    expect(() => {
      server.register(plugin, (err) => {
        expect(err).to.exist()
      })
    }).to.throw()

    done()
  })

  lab.test('Adds notify server method', (done) => {
    const plugin = {
      register: airbrake,
      options: {
        key: 'x1x1x1x1',
        env: 'production',
        url: 'unknownairbrake.com'
      }
    }

    const server = new Hapi.Server()
    server.register(plugin, (err) => {
      expect(err).to.not.exist()
      expect(server.methods.notify).to.be.a.function()
      server.methods.notify(new Error('test error'), (err) => {
        expect(err).to.exist()
        expect(err.code).to.equal('ENOTFOUND')
        done()
      })
    })
  })

  // Schema tests
  lab.test('Schema 1: empty options', (done) => {
    Joi.validate({}, schema, (err, result) => {
      expect(err).to.exist()
      done()
    })
  })

  lab.test('Schema 2: Only key required', (done) => {
    Joi.validate({
      key: 'x11x1x11'
    }, schema, (err, result) => {
      expect(err).to.not.exist()
      done()
    })
  })

  lab.test('Schema 3: Defaults', (done) => {
    Joi.validate({
      key: 'x11x1x11'
    }, schema, (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.exist()
      expect(result.appId).to.equal('true')
      expect(result.url).to.exist()
      expect(result.env).to.not.exist()
      expect(result.notify).to.equal('notify')
      done()
    })
  })

  lab.test('Schema 4: values', (done) => {
    Joi.validate({
      key: 'x11x1x11',
      appId: '2',
      url: 'test.com',
      env: 'production',
      notify: 'functionName'
    }, schema, (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.exist()
      expect(result.appId).to.equal('2')
      expect(result.url).to.equal('test.com')
      expect(result.env).to.equal('production')
      expect(result.notify).to.equal('functionName')
      done()
    })
  })
})
