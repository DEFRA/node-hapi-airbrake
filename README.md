[![Build Status](https://travis-ci.org/DEFRA/node-hapi-airbrake.svg?branch=master)](https://travis-ci.org/DEFRA/node-hapi-airbrake)
[![Test Coverage](https://codeclimate.com/github/EnvironmentAgency/node-hapi-airbrake/badges/coverage.svg)](https://codeclimate.com/github/EnvironmentAgency/node-hapi-airbrake/coverage)
[![dependencies Status](https://david-dm.org/DEFRA/node-hapi-airbrake/status.svg)](https://david-dm.org/DEFRA/node-hapi-airbrake)
[![NSP Status](https://nodesecurity.io/orgs/environmentagency/projects/623ea256-a6a2-4975-9e55-1ed82ddfbe0c/badge)](https://nodesecurity.io/orgs/environmentagency/projects/623ea256-a6a2-4975-9e55-1ed82ddfbe0c)

# node-hapi-airbrake
## Release 0.1.0 breaking changes
The module has been updated to be compatible with node 8 and hapi 17

This is a `hapi` plugin wrapper for https://github.com/airbrake/node-airbrake

The idea is to enable the node-airbrake module to be correctly installed as a hapi plugin, whether manually registering or by using `Glue` and a `manifest`

### Installation

`npm install --save node-hapi-airbrake`

### Usage

#### Glue
```
{
  plugins: [{
    plugin: require('node-hapi-airbrake'),
    options: {
      key: 'xxxx', --only required option
      env: 'production', --defaults to process.env || development
      appId: 'true', -- defaults to true
      host: '', -- host to use for your `airbrake` or `errbit` application (without protocol eg errbit.domain.com)
      notify: 'notify' -- Name to give server method, defaults to 'notify'
    }
  }]
}
```

#### Manual registration

```
server.register({
  register: require('node-hapi-airbrake'),
  options: {
    key: 'xxxx', --only required option
    env: 'production', --defaults to process.env || development (airbrake ignores development errors)
    appId: 'true', -- defaults to true
    host: '', -- host to use for your `airbrake` or `errbit` application (without protocol eg errbit.domain.com)
    notify: 'notify' -- Name to give server method, defaults to 'notify'
  }
}, (err) => {
  if (err) throw err
})
```

### Airbrake
Airbrake module will catch request-errors, so it uses the `server.on('request-error', callback)`
With `hapi` `request.log('error', err)` will be caught however `server.log('error', err)` is not as this method creates a server log rather than error.  If using `server.log('error', err)` for example in your server bootstrapping, in which case airbrake can be notifed manually:

### Manual notifications
The `Airbrake.notify` function is exposed as a server method on registration and can be called like so:

```
-- replace server.methods.notify with the name given in the plugin options
server.methods.notify(new Error('this is a manual error'), function(err, url) {
  if (err) throw err;
});
```

### Future development
My intentions are to create a `hapi-good` plugin, similar to `good-http`, that would enable airbrake to be plugged in to the good write streams for errors so that we can have more control over what is posted.  And further to this would be to enable the plugin to allow log posting to other services.

## Contributing to this project

If you would like to make a contribution or suggestion please log an issue on the project

# License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3

The following attribution statement MUST be cited in your products and applications when using this information.

>Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
