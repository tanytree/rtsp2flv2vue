// let path = require('path');
import path from 'path'

// let Service = require('node-windows').Service;
import Ser from 'node-windows'
let Service = Ser.Service
// Create a new service object
let svc = new Service({
  name: 'rtsp to flv,监控摄像头转码服务', //名称
  description: 'rtsp to flv,监控摄像头转码服务',//描述
  script: path.resolve('./index.js'),//node执行入口
  // script:  path.resolve('D:/LZM-rtsp2flv-node/server/index.js'),//node执行入口
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
});

svc.install();