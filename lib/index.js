'use strict'

const Joi = require('joi')
const schema = require('./schema.js')

exports.plugin = {
  register: async (server, options) => {
    const result = Joi.validate(options, schema.options)
    if (result.error) {
      throw new Error(result.error)
    }

    const airbrake = require('airbrake').createClient(
      result.value.appId,
      result.value.key,
      result.value.env
    )

    airbrake.serviceHost = result.value.host ? result.value.host : airbrake.serviceHost
    airbrake.requestOptions.proxy = result.value.proxy ? result.value.proxy : null

    // notify airbrake on request error
    server.events.on({ name: 'request', channels: ['error', 'app'], filter: 'error' }, (req, event, tags) => {
      let error = event.error || event.data
      error.url = req.info.host + req.url.path
      error.action = req.url.path
      error.component = 'hapi'
      error.httpMethod = req.method
      error.params = req.params
      error.ua = req.headers['user-agent']

      airbrake.notify(error, (err) => {
        if (err) {
          server.log(['error', 'info'], err)
        }
      })
    })

    // Add server.method.notify to allow manual airbrake notification
    server.method(result.value.notify, (error) => {
      airbrake.notify(error, (err) => {
        if (err) {
          server.log(['error', 'info'], err)
        }
      })
    })
  },
  pkg: require('../package.json')
}
