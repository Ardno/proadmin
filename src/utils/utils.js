import { md5 } from '@/utils/md5'
import { authPayload } from '@/utils/IM'
import { Notifications } from 'element-ui'
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
  if (window.Notification && Notification.permission === 'granted') {
    // 弹出一个通知
    const n = new Notification(obj.title, {
      body: obj.alert,
      icon: avteinfo
    })
    // 关闭通知
    setTimeout(function() {
      n.close()
    }, 4000)
  } else {
    Notifications({
      title: obj.title,
      message: obj.alert
    })
  }
}
