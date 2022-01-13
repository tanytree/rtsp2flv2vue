<template>
  <div class="videobox">
    <div class="video">
      <ul>
        <li v-for="(item,i) in rtsps" :key="i">
          <div class="wrap">
            <video :id="'flvPlayer' + i" controls autoplay muted></video>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import flvjs from "flv.js";

export default {
  name: "videoMonitor",
  data () {
    return {
      flvPlayerObj: {},
      rtsps: [
        {
          url: 'rtsp://账号:密码@ip:端口/cam/realmonitor?channel=1&subtype=0'
        }
      ]
    };
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.rtsps.forEach((item, i) => {
        let ws = 'ws://192.168.1.153:8081/'
        let url = ws + item.url
        this.createVideo(i, url);
      });
    },
    play (flvPlayer) {
      flvPlayer.play();
    },

    createVideo (i, url) {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById("flvPlayer" + i);
        this.flvPlayerObj['flvPlayer' + i] = flvjs.createPlayer(
          {
            type: "flv",
            isLive: true,
            hasAudio: false,
            url: url
          },
          {
            enableWorker: false, // 不启用分离线程
            enableStashBuffer: false, // 关闭IO隐藏缓冲区
            reuseRedirectedURL: true, // 重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true // 自动清除缓存
          }
        );

        this.flvPlayerObj['flvPlayer' + i].attachMediaElement(videoElement);

        if (url !== "" && url !== null) {
          this.flvPlayerObj['flvPlayer' + i].load();
          this.flvPlayerObj['flvPlayer' + i].play();
        }
      }

      // 定时方法是为了用户离开页面视频是实时播放的,暂停按钮无用
      setInterval(function () {
        // console.log(videoElement.buffered,"idididid");
        if (videoElement.buffered.length > 0) {
          const end = videoElement.buffered.end(0); // 视频结尾时间
          const current = videoElement.currentTime; //  视频当前时间
          const diff = end - current; // 相差时间
          // console.log(diff);
          const diffCritical = 4; // 这里设定了超过4秒以上就进行跳转
          const diffSpeedUp = 1; // 这里设置了超过1秒以上则进行视频加速播放
          const maxPlaybackRate = 4; // 自定义设置允许的最大播放速度
          let playbackRate = 1.0; // 播放速度
          if (diff > diffCritical) {
            //  this.flvPlayer.load();
            // console.log("相差超过4秒，进行跳转");
            videoElement.currentTime = end - 1.5;
            playbackRate = Math.max(1, Math.min(diffCritical, 16));
          } else if (diff > diffSpeedUp) {
            // console.log("相差超过1秒，进行加速");
            playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16));
          }
          videoElement.playbackRate = playbackRate;
          if (videoElement.paused) {
            videoElement.play();
          }
        }
        //  if (videoElement.buffered.length) {
        //   let end = this.flvPlayerObj['flvPlayer' + i].buffered.end(0);//获取当前buffered值
        //   let diff = end - this.flvPlayerObj['flvPlayer' + i].currentTime;//获取buffered与currentTime的差值
        //   if (diff >= 0.5) {//如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
        //     this.flvPlayerObj['flvPlayer' + i].currentTime = this.flvPlayerObj['flvPlayer' + i].buffered.end(0);//手动跳帧
        //  }
        // }
      }, 1000);

      this.flvPlayerObj['flvPlayer' + i].on(flvjs.Events.ERROR, (errType, errDetail) => {
        // alert("网络波动,正在尝试连接中...");
        if (this.flvPlayerObj['flvPlayer' + i]) {
          this.reloadVideo(this.flvPlayerObj['flvPlayer' + i]);
        }
        // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
        // errType是 MediaError时，对应errDetail是MediaMSEError   或MEDIA_SOURCE_ENDED
      });
    },

    reloadVideo (flvPlayer) {
      this.destoryVideo(flvPlayer);
      this.createVideo();
    },
    destoryVideo (flvPlayer) {
      flvPlayer.pause();
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
      flvPlayer = null;
    },
    findAlllistApi () {

    }
  },
  beforeDestroy () {
    // 页面销毁前 关闭flvjs
    for (let k in this.flvPlayerObj) {
      this.flvPlayerObj[k].destroy()
    }
  }
};
</script>
<style lang="scss" scoped>
.videobox {
  display: flex;
}
.videolist {
  width: 550px;
  height: 906px;
  display: flex;
  .search {
    margin-left: 50px;
    .el-input {
      width: 300px;
      margin-top: 20px;
    }
    ul {
      width: 100%;
      height: 777px;
      overflow: hidden;
      overflow-y: auto;
      list-style: none;
      li {
        padding: 7px;
        margin: 1px 0;
        text-decoration: none;
        white-space: nowrap;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background: #fff;
        }
        .el-icon-video-camera-solid {
          font-size: 16px;
          color: #67c23a;
        }
      }
    }
  }
}
.video {
  width: 100%;
  ul {
    li {
      width: 33.333333333333333333333333333%;
      float: left;
      .wrap {
        width: 100%;
        display: flex;
        border: 2px solid #eee;
      }
    }
  }
  video {
    width: 100%;
  }
}
</style>
