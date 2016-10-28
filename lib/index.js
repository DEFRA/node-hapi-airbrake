'use strict'

const Joi = require('joi')
const schema = require('./schema.js')

exports.register = (server, options, next) => {
  Joi.validate(options, schema.options, (err, result) => {
    if (err) throw err

    const airbrake = require('airbrake').createClient(
      result.appId,
      result.key,
      result.env
    )

    airbrake.serviceHost = result.host ? result.host : airbrake.serviceHost
    airbrake.proxy = result.proxy ? result.proxy : null

    // Add server.method.notify to allow manual airbrake notification
    server.method({
      name: result.notify,
      method: function (err, callback) {
        airbrake.notify(err, callback)
      },
      options: {}
    })

    server.register(airbrake.hapiHandler(), (err) => {
      if (err) throw err
      next()
    })
  })
}

exports.register.attributes = {
  pkg: require('../package.json')
}
