'use strict'

const {
  ExternalTaskApiRouter,
  ExternalTaskApiController,
} = require('./dist/commonjs/index');

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {
  container.register('ExternalTaskApiRouter', ExternalTaskApiRouter)
    .dependencies('ExternalTaskApiController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ExternalTaskApiController', ExternalTaskApiController)
    .dependencies('ExternalTaskApiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
