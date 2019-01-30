'use strict';
const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
    // application instance information
    instance: {
      app: 'blockchain',
      hostName: 'w1751414.northamerica.cerner.net:3000',
      ipAddr: '10.190.148.215',
      port: {
          '$':3000,
          '@enabled':'true',
      },
      vipAddress: 'my.blockchain.service',
      statusPageUrl:'http://RDCTSTBC003:3000/',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn'
      },
    },
    eureka: {
        // eureka server host / port
        host: '10.190.150.234',
        port: 8761,
        servicePath: '/eureka/apps/'
      }
  });
  function connectToEureka() {              
    client.logger.level('debug');  
    client.start(function(error) {
    console.log('########################################################');
    console.log(JSON.stringify(error) || 'Eureka registration complete');   }); }
    connectToEureka();
