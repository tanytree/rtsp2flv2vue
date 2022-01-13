import { WebSocketServer } from "ws";
import websocketStream from "websocket-stream/stream.js";
import ffmpeg from "fluent-ffmpeg";
// import {path as ffmpegPath} from '@ffmpeg-installer/ffmpeg'
import pkg from '@ffmpeg-installer/ffmpeg';
const { path: ffmpegPath } = pkg;

ffmpeg.setFfmpegPath(ffmpegPath);

// 建立ws服务
const ws = new WebSocketServer({ port: 8081, perMessageDeflate: false })

// 监听连接
ws.on("connection", handleConnection)

// 连接回调
function handleConnection (ws, req) {
  console.log("connection.....")
  // 获取前端请求的流地址（前端websocket连接时后面带上流地址）
  const url = req.url.slice(1)
  // 传入连接的ws客户端 实例化一个流
  const stream = websocketStream(ws, { binary: true })
  // 通过ffmpeg命令 对实时流进行格式转换 输出flv格式
  const ffmpegCommand = ffmpeg(url)
    .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")
    // .addInputOption("-analyzeduration", '100000', '-max_delay', '1000000')
    .on("start", function () { console.log("Stream started.") })
    .on("codecData", () => { console.log("Stream codeData.") })
    .on("error", err => {
      console.log("An error occured", err.message)
      stream.end()
    })
    .on("end", () => {
      console.log("Stream end.")
      stream.end()
    })
    .outputFormat("flv")
    .videoCodec("copy")
    .noAudio()

  stream.on("close", () => {
    ffmpegCommand.kill("SIGKILL")
  })
  try {
    // 执行命令 传输到实例流中返回给客户端
    ffmpegCommand.pipe(stream)
  } catch (error) {
    console.log(error)
  }
}
