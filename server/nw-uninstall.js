import path from 'path'
// 卸载文件nw-uninstall.js
import Ser from 'node-windows'
let Service = Ser.Service
 
let svc = new Service({
    name:'rtsp to flv,监控摄像头转码服务', //名称
    description: 'rtsp to flv,监控摄像头转码服务',//描述
    script:  path.resolve('./index.js'),//node执行入口
    nodeOptions: [
      '--harmony',
      '--max_old_space_size=4096'
    ]
  });

svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

svc.uninstall();