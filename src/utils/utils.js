import { md5 } from '@/utils/md5'
import { authPayload } from '@/utils/IM'
import { Notification } from 'element-ui'
import avteinfo from '@/assets/images/notis.png'
/**
 * 生成JIM初始化的签名
 * @param timestamp: number 当前的时间毫秒数
 * @return string 签名
 */
export function createSignature(timestamp) {
  return md5(`appkey=${authPayload.appKey}&timestamp=${timestamp}&random_str=${authPayload.randomStr}&key=${authPayload.masterkey}`)
}

/**
 * 网页通知消息
 * @param obj消息对象
 */
export function imNotification(obj) {
  const titleInit = document.title
  let timer = null
  let isShine = true
  if (document.hidden) { // 如果页面隐藏则需要标题闪烁
    timer = setInterval(function() {
      const title = document.title
      if (isShine === true) {
        if (/新/.test(title) === false) {
          document.title = '【你有新的消息~】'
        } else {
          document.title = '【　　　　　】'
        }
      } else {
        document.title = titleInit
        clearInterval(timer)
      }
    }, 500)
  }
  window.onfocus = function() {
    isShine = false
  }
  window.onblur = function() {
    isShine = true
  }
  // for IE
  document.onfocusin = function() {
    isShine = false
  }
  document.onfocusout = function() {
    isShine = true
  }
  if (window.Notification && window.Notification.permission === 'granted') {
    // 弹出一个通知
    const n = new window.Notification(obj.title, {
      body: obj.alert,
      icon: avteinfo
    })
    // 关闭通知
    setTimeout(function() {
      n.close()
    }, 4000)
  } else {
    Notification({
      title: obj.title,
      message: obj.alert
    })
  }
}

/**
 * 将input file转化成formData对象
 * @param file: Object
 * @return Object FormData对象
 */
export function getFileFormData(file) {
  const fd = new FormData()
  fd.append(file.files[0].name, file.files[0])
  return fd
}
/**
 * 发送文件时截取后缀名作为拓展字段
 * @param name string
 * @return string 后缀名
 */
export function getExt(name) {
  const index = name.lastIndexOf('.')
  return index === -1 ? '' : name.substring(index + 1)
}
/**
 * 将文件后缀名分类
 * @param ext string
 * @return string 后缀名
 */
export function sortByExt(ext) {
  if (ext === '') {
    return 'other'
  }
  const audio = ['wav', 'mp3', 'wma', 'midi']
  const document = ['ppt', 'pptx', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt', 'wps']
  const video = ['mp4', 'mov', 'rm', 'rmvb', 'wmv', 'avi', '3gp', 'mkv']
  const image = ['jpg', 'jpeg', 'png', 'bmp', 'gif']
  let newType = ''
  if (audio.indexOf(ext) !== -1) {
    // 音频
    newType = 'audio'
  } else if (document.indexOf(ext) !== -1) {
    // 文档
    newType = 'document'
  } else if (video.indexOf(ext) !== -1) {
    // 视频
    newType = 'video'
  } else if (image.indexOf(ext) !== -1) {
    // 图片
    newType = 'image'
  } else {
    // 其他
    newType = 'other'
  }
  return newType
}
/**
 * fileReader预览图片返回img url
 * @param file: Object, input file 对象
 * @param callback: function 回调函数
 * @param callback2: function 回调函数
 */
export function doubleNumber(num) {
  return num < 10 ? '0' + num : num
}
/**
 * fileReader预览图片返回img url
 * @param file: Object, input file 对象
 * @param callback: function 回调函数
 * @param callback2: function 回调函数
 */
export function imgReader(file, callback, callback2) {
  const files = file.files[0]
  if (!/image\/\w+/.test(files.type)) {
    callback()
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(files)
  const img = new Image()
  const promise = new Promise((resolve, reject) => {
    reader.onload = function(e) {
      img.src = this.result
      const that = this
      img.onload = function() {
        const width = img.naturalWidth
        const height = img.naturalHeight
        const filename = files.name
        const postf = filename.substring(filename.lastIndexOf('.') + 1, filename.length)
        resolve({
          src: that.result,
          postf,
          width,
          height
        })
      }
    }
  }).catch(() => {
    console.log('Promise Rejected')
  })
  promise.then((value) => {
    callback2(value)
  }, (erro) => {
    // pass
  }).catch(() => {
    console.log('Promise Rejected')
  })
}
/**
 * fileReader预览图片url
 * @param file: Object, input file 对象
 * @param callback: function 回调函数
 */
export function fileReader(file, callback) {
  const files = file.files[0]
  if (!files.type || files.type === '') {
    return false
  }
  if (!/image\/\w+/.test(files.type)) {
    callback()
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(files)
  return new Promise((resolve, reject) => {
    reader.onload = function(e) {
      resolve(this.result)
    }
  }).catch(() => {
    console.log('Promise Rejected')
  })
}
/**
 * 把文件转换成base64
 * @param file: Object, input file 对象
 * @param callback: function 回调函数
 */
export function fileReaderBase64(file, callback) {
  const files = file
  if (!files.type || files.type === '') {
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(files)
  return new Promise((resolve, reject) => {
    reader.onload = function(e) {
      const filename = files.name
      const postf = filename.substring(filename.lastIndexOf('.') + 1, filename.length)
      resolve(
        {
          data: this.result,
          postf
        })
    }
  }).catch(() => {
    console.log('Promise Rejected')
  })
}
/**
 * 获取本周起始时间
 *
 *
 */
export function getWeekDate() {
  const now = new Date()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  const nowTime = now.getTime()
  const day = now.getDay()
  const oneDayLong = 24 * 60 * 60 * 1000
  const MondayTime = nowTime - (day - 1) * oneDayLong
  const SundayTime = nowTime + (7 - day) * oneDayLong
  const monday = new Date(MondayTime)
  const sunday = new Date(SundayTime)
  return {
    monday,
    sunday
  }
}

/**
 * 获取当日零点时间戳
 *
 *
 */
export function getDayDate() {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  const timestamp = date.getTime()
  const unix_timestamp = Math.floor(timestamp / 1000)
  return unix_timestamp
}
/**
 * 获取当日时间戳
 *
 *
 */
export function getDaytimes() {
  const date = new Date()
  const timestamp = date.getTime()
  const unix_timestamp = Math.floor(timestamp / 1000)
  return unix_timestamp
}
