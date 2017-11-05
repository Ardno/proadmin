/**
 * Created by jiachenpan on 16/11/18.
 */
export function parseTime(time, cFormat, flg) {
  if (arguments.length === 0) {
    return null
  }
  if (flg) {
    time = time * 1000
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  // const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  // let date
  // if (typeof time === 'object') {
  //   date = time
  // } else {
  //   console(time)
  //   if (('' + time).length === 10) time = parseInt(time) * 1000
  //   date = new Date(time)
  // }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else { len += 0.5 }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
   giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}
// 生成32位uuid
export function uuid(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  let i = 0
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
/*
  *函数定义
  *入口参数data,平行数组
  *key，id字段
  *parentKey，父字段
  *map,需要将原始属性名称转换为什么名称
  */
export function TreeUtil(data, key, parentKey, map) {
  this.data = data
  this.key = key
  this.parentKey = parentKey
  this.treeParentKey = parentKey   // parentKey要转换成什么属性名称
  this.treeKey = key           // key要转换成什么属性名称
  this.map = map
  if (map) {
    if (map[key]) this.treeKey = map[key]
  }
  this.toTree = function() {
    var data = this.data
    var pos = {}
    var tree = []
    var i = 0
    while (data.length !== 0) {
      if (data[i][this.parentKey] === 0) {
        const _temp = this.copy(data[i])
        tree.push(_temp)
        pos[data[i][this.key]] = [tree.length - 1]
        data.splice(i, 1)
        i--
      } else {
        var posArr = pos[data[i][this.parentKey]]
        if (posArr !== undefined) {
          var obj = tree[posArr[0]]
          for (var j = 1; j < posArr.length; j++) {
            obj = obj.children[posArr[j]]
          }
          const _temp = this.copy(data[i])
          obj.children.push(_temp)
          pos[data[i][this.key]] = posArr.concat([obj.children.length - 1])
          data.splice(i, 1)
          i--
        }
      }
      i++
      if (i > data.length - 1) {
        i = 0
      }
    }
    return tree
  }
  this.copy = function(item) {
    var _temp = {
      children: []
    }
    _temp[this.treeKey] = item[this.key]
    for (var _index in item) {
      if (_index !== this.key && _index !== this.parentKey) {
        var _property = item[_index]
        if ((!!this.map) && this.map[_index]) {
          _temp[this.map[_index]] = _property
        } else {
          _temp[_index] = _property
        }
      }
    }
    return _temp
  }
}
 /**
 * 数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */
export function sortBy(attr, rev) {
  // 第二个参数没有传递 默认升序排列
  if (rev === undefined) {
    rev = 1
  } else {
    rev = (rev) ? 1 : -1
  }
  return function(a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}
/**
 * 将时间转化成需要的格式
 * @param msgTime: 需要转换的时间毫秒数
 * @return string 时间的标识，根据标识可以再页面应用不同的date管道
 * 当天 --- today
 * 昨天和前天 --- yesterday或the day before
 * 近7天（排除今天，昨天，前天） --- day
 * 今年其他时间 --- month
 * 今年之前的时间 --- year
 */
export function reducerDate(msgTime) {
  const time = new Date(msgTime)
  const now = new Date()
  const msgYear = time.getFullYear()
  const nowYear = now.getFullYear()
  const nowHour = now.getHours()
  const nowMinute = now.getMinutes()
  const nowSecond = now.getSeconds()
  const nowTime = now.getTime()
  const todayTime = nowHour * 60 * 1000 * 60 + nowMinute * 1000 * 60 + nowSecond * 1000
  const gapDate = (nowTime - todayTime - msgTime) / 1000 / 60 / 60 / 24
  let showTime = ''
  if (msgYear !== nowYear) {
    showTime = 'year'
  } else if (gapDate > 6) {
    showTime = 'month'
  } else if (gapDate <= 6 && gapDate > 2) {
    showTime = 'day'
  } else if (gapDate <= 2 && gapDate > 1) {
    showTime = 'the day before'
  } else if (gapDate <= 1 && gapDate > 0) {
    showTime = 'yesterday'
  } else if (gapDate <= 0) {
    showTime = 'today'
  } else {
    showTime = ''
  }
  return showTime
}
