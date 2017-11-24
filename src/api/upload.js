import fetchload from '@/utils/fetchupload'

export function imgUpLoad(query) { // 上传图片
  return fetchload({
    url: 'upload',
    method: 'post',
    data: query
  })
}
