'use strict'

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const airbrake = require('../lib')
const lab = exports.lab = Lab.script()
const expect = Code.expect

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
        env: 'production'
      }
    }

    const server = new Hapi.Server()
    server.register(plugin, (err) => {
      expect(err).to.not.exist()
      expect(server.methods.notify).to.be.a.function()
      done()
    })
  })
})
