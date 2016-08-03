'use strict'

const Joi = require('joi')

exports.options = Joi.object().keys({
  appId: Joi.string().default('true'),
  key: Joi.string().required(),
  url: Joi.string().default(''),
  env: Joi.string(),
  notify: Joi.string().default('notify')
})
