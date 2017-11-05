
// JIM init配置
const randomStr = '404'
const appKey = '4f7aef34fb361292c566a1cd'
const masterkey = ''
const signature = '7db047a67a9d7293850ac69d14cc82bf'
const address = 'ws://183.232.25.91:9091'
const timestamp = 1507882399401
let cJIM = null
export const authPayload = {
  appKey,
  masterkey,
  randomStr,
  flag: 1,
  signature,
  timestamp
}

// 获取JIM 对象
function getJMessage() {
  if (!cJIM) {
    cJIM = new JMessage({
      address: address
    })
  }
  return cJIM
}
export const JIM = getJMessage()
