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
  lab.test('Registers without erring', async () => {
    const server = Hapi.Server({})
    await server.register({
      plugin: airbrake,
      options: {
        key: 'x1x1x1x1x',
        env: 'production'
      }
    })
  })

  lab.test('Errs on registration with incorrect config', async () => {
    try {
      const server = Hapi.Server({})
      await server.register({
        plugin: airbrake,
        options: {
        }
      })
    } catch (err) {
      expect(err).to.be.an.error()
    }
  })

  lab.test('Adds notify server method', async () => {
    try {
      const server = Hapi.Server({})
      await server.register({
        plugin: airbrake,
        options: {
          key: 'x1x1x1x1',
          env: 'production',
          host: 'unknownairbrake.com'
        }
      })
      expect(server.methods.notify).to.be.a.function()
      server.methods.notify(new Error('test error'))
    } catch (err) {
      throw err
    }
  })

  // Schema tests
  lab.test('Schema 1: empty options', () => {
    const result = Joi.validate({}, schema)
    expect(result.error).to.not.be.undefined()
  })

  lab.test('Schema 2: Only key required', () => {
    const result = Joi.validate({ key: 'x1x1x1x' }, schema)
    expect(result.error).to.be.null()
  })

  lab.test('Schema 3: Defaults', () => {
    const result = Joi.validate({ key: 'x11x1x11' }, schema)
    expect(result.err).to.not.exist()
    expect(result.value).to.exist()
    expect(result.value.appId).to.equal('true')
    expect(result.value.host).to.exist()
    expect(result.value.env).to.not.exist()
    expect(result.value.notify).to.equal('notify')
    expect(result.value.proxy).to.be.undefined()
  })

  lab.test('Schema 4: values', () => {
    const result = Joi.validate({
      key: 'x11x1x11',
      appId: '2',
      host: 'test.com',
      env: 'production',
      notify: 'functionName',
      proxy: 'proxy'
    }, schema)
    expect(result.error).to.not.exist()
    expect(result.value).to.exist()
    expect(result.value.appId).to.equal('2')
    expect(result.value.host).to.equal('test.com')
    expect(result.value.env).to.equal('production')
    expect(result.value.notify).to.equal('functionName')
    expect(result.value.proxy).to.equal('proxy')
  })
})
