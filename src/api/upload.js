
import fetch from '@/utils/fetch'

export function imgUpLoad(query) { // 上传图片
  return fetch({
    url: 'upload',
    method: 'post',
    data: query
  })
}
