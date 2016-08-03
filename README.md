# node-hapi-airbrake

This is a `hapi` plugin wrapper for https://github.com/airbrake/node-airbrake

The idea is to enable the node-airbrake module to be correctly installed as a hapi plugin, whether manually registering or by using `Glue` and a `manifest`

### Installation

The plugin will be available on npm but for the time being add the project as a dependency to your `package.json`

`"node-hapi-airbrake": "https://github.com/environmentagency/node-hapi-airbrake"`

### Usage

#### Glue
```{
  plugin: {
    register: 'node-hapi-airbrake',
    options: {
      key: 'xxxx', --only required option
      env: 'production', --defaults to process.env || development (airbrake ignores development errors)
      appId: 'true', -- defaults to true
      url: ''-- url to use for your `airbrake` or `errbit` application
    }
  }
}```

#### Manual registration

```
server.register({
  register: require('node-hapi-airbrake'),
  options: {
    key: 'xxxx', --only required option
    env: 'production', --defaults to process.env || development (airbrake ignores development errors)
    appId: 'true', -- defaults to true
    url: ''-- url to use for your `airbrake` or `errbit` application
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
