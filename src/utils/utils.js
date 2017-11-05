import { md5 } from '@/utils/md5'
import { authPayload } from '@/utils/IM'
/**
 * 生成JIM初始化的签名
 * @param timestamp: number 当前的时间毫秒数
 * @return string 签名
 */
export function createSignature(timestamp) {
  return md5(`appkey=${authPayload.appKey}&timestamp=${timestamp}&random_str=${authPayload.randomStr}&key=${authPayload.masterkey}`)
}
