<template>
  <div class="pht100 rel">
    <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
      <!-- 区域 -->
      <el-amap-polygon v-for="(polygon, index) in polygons" :key="index" :vid="index" :ref="`polygon_${index}`" :strokeWeight="polygon.strokeWeight" :strokeOpacity="polygon.strokeOpacity" :strokeColor="polygon.strokeColor" :fillColor="polygon.fillColor" :fillOpacity="polygon.fillOpacity" :path="polygon.path" :events="polygon.events">
      </el-amap-polygon>
      <!-- 点坐标 -->
      <!-- 同事的坐标 -->
      <el-amap-marker v-for="(marker, index) in markerArr.person" v-if="seeting.person" :ref="`marker_${index}`" :key="index" :position="marker.position" :icon="marker.icon" :title="marker.title" :label="marker.label" :events="marker.events" :visible="marker.visible"  :draggable="marker.draggable"></el-amap-marker>
      <!-- 案件的坐标 -->
      <el-amap-marker v-for="(marker, index) in markerArr.case" v-if="seeting.event" :ref="`marker_${index}`" :key="index" :position="marker.position" :icon="marker.icon" :title="marker.title" :label="marker.label" :events="marker.events" :visible="marker.visible"  :draggable="marker.draggable"></el-amap-marker>
      <!-- 人员管理的坐标 -->
      <el-amap-marker v-for="(marker, index) in markerArr.areaperson" v-if="seeting.areaperson" :ref="`marker_${index}`" :key="index" :position="marker.position" :icon="marker.icon" :title="marker.title" :label="marker.label" :events="marker.events" :visible="marker.visible"  :draggable="marker.draggable"></el-amap-marker>
      <!-- 设施管理的坐标 -->
      <el-amap-marker v-for="(marker, index) in markerArr.construct" v-if="seeting.construct" :ref="`marker_${index}`" :key="index" :position="marker.position" :icon="marker.icon" :title="marker.title" :label="marker.label" :events="marker.events" :visible="marker.visible"  :draggable="marker.draggable"></el-amap-marker>
      <!-- 信息窗体 -->
      <el-amap-info-window v-for="(window, index) in windows" :closeWhenClickMap="true" :ref="`window_${index}`" :key="index" :template="window.template" :position="window.position"  :visible="window.visible" :events="window.events">
      </el-amap-info-window>
    </el-amap>
    <div class="pottoolbar" >
        <!-- 经纬度: [{{ lng }}, {{ lat }}]  -->
        地址: {{ address }}
    </div>
    <side-bar :mapobj="mapobj" :PathSimplifier='PathSimplifier' @seeting="isopen"  @reloadMap="loadInit" @addRegion="getRegion"></side-bar>
    <!-- 区域信息 -->
    <el-dialog title="区域信息" width="600px"  :visible.sync="regionobj.dialogFormVisible"  >
      <el-form class="small-space"  label-position="top">
        <el-form-item label="所属部门" >
          <span  class="ml20">{{regionobj.department_name}}</span>
        </el-form-item>
        <el-form-item label="区域名称" >
          <span v-if="!regionobj.update" class="ml20">{{regionobj.name}}</span>
          <el-input v-else v-model="regionobj.name"></el-input>
        </el-form-item>
        <el-form-item label="区域人员">
          <span v-if="!regionobj.update" class="ml20">{{regionobj.username || '无'}}</span>
          <el-select class="pct100" v-else v-model="regionobj.userArr" multiple filterable placeholder="请选择">
            <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id+''">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isAccess('10')">
        <el-button v-show="!regionobj.update && isAccess('12')" class="ml20" @click="regionobj.update=true" type="text">修改</el-button>
        <el-button v-show="regionobj.update" class="ml20" @click="updateRegion" type="text">保存</el-button>
        <el-button v-show="regionobj.update" class="ml20" @click="regionobj.update=false" type="text">取消</el-button>
        <el-button v-show="!regionobj.update && isAccess('13')" type="text" @click="deteleRegion">删除当前区域</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import SideBar from './sidebar'
import { mapGetters } from 'vuex'
import { getRegionArr, updateRegion, getLatlonArr, getUser_setting } from '@/api/grid'
import { parseTime } from '@/utils/index'
import { getEventArr } from '@/api/depevent'
import { uploadCurLoc } from '@/api/platform'
import { GetPersonForId, GetFacilitiesForId } from '@/api/areaperson'
import { isAccess, getDepCld } from '@/utils/auth'
import personicon from '@/assets/icon/personicon.png'
import pergray from '@/assets/icon/pergray.png'
import eventicon from '@/assets/icon/zuob2.png'
import areapersonicon from '@/assets/icon/constructmarker/personiconsmall.png'
import facilitiesicon from '@/assets/icon/constructmarker/construct.png'
import avatar from '@/assets/login_images/avatar.png'
import { deepClone } from '@/utils/index'
import Cookies from 'js-cookie'
import Bus from '@/utils/bus'
import store from '@/store/index'
const amapManager = new VueAMap.AMapManager()
export default {
  data() {
    return {
      zoom: 9,
      center: [116.388781, 39.914078], // [109.103313, 18.385587],
      amapManager,
      lng: 0,
      lat: 0,
      address: '',
      locMark: '',
      PathSimplifier: '',
      geocoder: '',
      geolocations: null,
      mapobj: null,
      seeting: {
        person: true,
        allperson: true,
        raido: true,
        region: true,
        event: true,
        areaperson: true,
        construct: true
      },
      locationPostion: {
        oldloc: [],
        newloc: [],
        address: '未知'
      },
      cluster: null,
      areapersonster: null, // 区域人员的聚合
      events: {
        init: (map) => {
          this.mapobj = this.$refs.map
          this.getGeolocation()
        },
        click: (e) => {
          const { lng, lat } = e.lnglat
          this.lng = lng
          this.lat = lat
          // 这里通过高德 SDK 完成。
          this.locMark.setPosition([lng, lat])
          console.log(lng + ',' + lat)
          this.geocoder.getAddress([lng, lat], (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                this.address = result.regeocode.formattedAddress
                this.$nextTick()
              }
            }
          })
        }
      },
      plugin: ['ToolBar', {
        pName: 'MapType',
        defaultType: 0,
        events: {
          init(o) {
          }
        }
      }],
      polygons: [],
      windows: [
        {
          position: [121.5273285, 31.21515044],
          template: '<span></span>',
          visible: false,
          events: {
            close: () => {
              this.windows[0].visible = false
            }
          }
        }
      ],
      userArr: [],
      depArr: [],
      markerArr: {
        'person': [], // 用于存储对应点标记
        'case': [],
        'area': [],
        'raido': [],
        'areaperson': [],
        'construct': []
      },
      personArr: [],
      eventArr: [],
      intetime: null,
      initpeoplelisttime: null, // 刷新人员设施的定时器
      intusertime: null, // 刷新同事的定时器
      polygonsArr: [],
      regionobj: {
        name: '',
        department_id: '',
        department_name: '',
        username: '',
        status: '',
        _id: '',
        user_ids: '',
        userArr: [],
        update: false,
        dialogFormVisible: false
      }
    }
  },
  created() {
    // 获取当前中心坐标位置并设置图标
    this.geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all'
    })
    const loadAMapUI = () => {
      if (window.AMapUI) {
        AMapUI.loadUI(['overlay/AwesomeMarker'], (AwesomeMarker) => {
          if (!AwesomeMarker) {
            return
          }
          const map = this.$refs.map.$$getInstance()
          this.locMark = new AwesomeMarker({
            awesomeIcon: 'eercast',
            iconLabel: {
              style: {
                color: '#fff', // 字体颜色
                fontSize: '16px' // 字号
              }
            },
            iconStyle: 'black',
            map: map,
            position: map.getCenter()
          })
        })
        AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
          if (!PathSimplifier) {
            return
          }
          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！')
            return
          }
          this.PathSimplifier = PathSimplifier
        })
      } else {
        setTimeout(() => {
          loadAMapUI()
        }, 1000)
      }
    }
    this.depArr = deepClone(this.$store.getters.commonInfo.depArr)
    this.userArr = deepClone(this.$store.getters.commonInfo.userArr)
    this.loadInit()
    loadAMapUI()
  },
  mounted() {
    this.$nextTick(function() {
    })
  },
  methods: {
    isAccess: isAccess,
    defaultImg() {
      return 'this.onerror=null;this.src="' + avatar + '"'
    },
    getGeolocation() { // 定位当前位置
      this.geolocations = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位,默认:true
        timeout: 10000, // 超过10秒后停止定位,默认：无穷大
        GeoLocationFirst: true,
        showButton: false,
        buttonOffset: new AMap.Pixel(10, 30), // 定位按钮与设置的停靠位置的偏移量,默认：Pixel(10, 20)
        showCircle: true, // 定位成功后用圆圈表示定位精度范围,默认：true
        panToLocation: false, // 定位成功后将定位到的位置作为地图中心点,默认：true
        buttonPosition: 'LB'
      })
      this.mapobj.addMapControls(this.geolocations)
      this.geolocations.getCurrentPosition()
      // let countTimes = 0
      this.timeer = setInterval(() => { // 上传位置信息
        // countTimes++
        // const newloc = this.locationPostion.newloc.toString()
        // const oldloc = this.locationPostion.oldloc.toString()
        // if (newloc !== oldloc || countTimes > 28) { // 位置不变则4分钟上传一次,
        // countTimes = 0
        this.locationPostion.oldloc = this.locationPostion.newloc
        if (this.locationPostion.newloc.length) {
          this.uploadCurLoc(this.locationPostion.newloc, this.locationPostion.address)
        }
        // }
      }, 30000)
      AMap.event.addListener(this.geolocations, 'complete', (data) => {
        setTimeout(() => { // 定时查询当前位置
          this.geolocations.getCurrentPosition()
        }, 5000)
        if (!this.locationPostion.newloc) {
          this.locationPostion.newloc = [data.position.lng, data.position.lat]
          // this.mapobj.setZoomAndCenter(16, data.position)
        } else {
          this.locationPostion.newloc = [data.position.lng, data.position.lat]
        }
        // 通过经纬度进行转码
        this.geocoder.getAddress(this.locationPostion.newloc, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.locationPostion.address = result.regeocode.formattedAddress
          }
        })
      }) // 返回定位信息
      AMap.event.addListener(this.geolocations, 'error', (data) => {
        console.log(data)
        this.$message({
          message: '定位用户失败~',
          type: 'error',
          duration: 4 * 1000
        })
      }) // 返回定位出错信息
    },
    uploadCurLoc(loc, address) { // 上传用户当前位置
      const reqinfo = {
        url: 'locations/add',
        bind_id: this.$store.getters.useinfo._id,
        bind_type: '0',
        address: address,
        lat: loc[1],
        lon: loc[0],
        create_time: Math.round(new Date().getTime() / 1000),
        hideloading: true
      }
      uploadCurLoc(reqinfo).then(response => {
        console.log('上传当前用户位置', response)
      })
    },
    loadInit() { // 初始化加载
      if (this.intetime) {
        clearInterval(this.intetime)
      }
      if (this.initpeoplelisttime) { // 刷新人员设施的定时器
        clearInterval(this.initpeoplelisttime)
      }
      if (this.intusertime) { // 刷新同事的定时器
        clearInterval(this.intusertime)
      }
      const obj = Cookies.get('seeting')
      if (obj) {
        this.seeting = JSON.parse(obj)
        console.log(this.seeting)
      }
      try {
        if (this.cluster) {
          this.cluster.setMap(null)
        }
        this.markerArr = {
          'person': [], // 用于存储对应点标记
          'case': [],
          'area': [],
          'raido': [],
          'areaperson': [],
          'construct': []
        }
        this.markerRefs = {
          'person': [], // 用于存储聚合
          'case': [],
          'area': [],
          'raido': [],
          'areaperson': [],
          'construct': []
        }

        this.getRegion()
        this.getLatlon() // 暂时隐藏获取人员
        this.getEventArr()
        this.getAreaperson()
        this.getFacilities()
        getUser_setting({ user_id: this.$store.getters.useinfo._id }).then(res => {
          this.usersetting = res.info[0]
          console.log(this.usersetting)
          this.intusertime = setInterval(() => { // 刷新同事的定时器
            this.getAreaperson(true)
            this.getFacilities(true)
          }, this.usersetting.map_person_facilities * 1000)
          this.initpeoplelisttime = setInterval(() => { // 刷新人员设施的定时器
            this.getLatlon(true)
          }, this.usersetting.peoplelist_refresh_time * 1000)
        })
        /*
        this.intetime = setInterval(() => {
          this.getSetting()
          console.log(this.usersetting)
        }, 30000)
        */
      } catch (error) {
        console.log(error)
      }
    },
    getRadomPt() {
      var resultPt = []
      resultPt.push(109.103313 + Math.random() / 20 * (Math.random() > 0.5 ? -1 : 1))
      resultPt.push(18.385587 + Math.random() / 20 * (Math.random() > 0.5 ? -1 : 1))
      return resultPt
    },
    getSetting(obj) {
      try {
        // this.getRegion(true)
        this.getLatlon(true)
        this.getEventArr(true)
        this.getAreaperson(true)
        this.getFacilities(true)
      } catch (error) {
        console.log(error)
      }
    },
    getRegion(updateFlg) { // 获取区域
      getRegionArr({ start_index: 0, length: 10000, department_id: getDepCld() }).then(response => {
        const polygons = response.info.list
        this.polygons = []
        this.polygonsArr = []
        const colorArr = {}
        polygons.forEach(function(element) {
          if (!element.status) {
            if (!colorArr[element.department_id]) {
              colorArr[element.department_id] = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
            }
            const obj = {
              path: element.latlon_list,
              editable: false,
              strokeColor: '#000',
              strokeWeight: 2,
              strokeOpacity: 0.5,
              fillOpacity: 0.1,
              fillColor: colorArr[element.department_id],
              extData: element,
              events: {
                click: () => {
                  const obj = element
                  this.regionobj.update = false
                  this.regionobj.dialogFormVisible = true
                  this.regionobj.name = obj.name
                  this.regionobj.department_id = obj.department_id
                  this.regionobj.department_name = this.filterDepRose(obj.department_id)
                  this.regionobj.status = obj.status
                  this.regionobj._id = obj._id
                  this.regionobj.user_ids = obj.user_ids
                  const str = obj.user_ids || ''
                  this.regionobj.userArr = str ? str.split(',') : []
                  this.regionobj.username = this.filterUser(this.regionobj.userArr)
                }
              }
            }
            if (this.seeting.region) {
              this.polygons.push(obj)
            }
            this.polygonsArr.push(obj)
          }
        }, this)
      }).catch(errs => {
        console.log('获取区域位置出错')
      })
    },
    getLatlon(updateFlg) { // 获取部门人员位置
      const addLatlon = (element) => { // 添加图标
        element.type = 'people'
        const obj = {
          position: [element.location.lon, element.location.lat],
          label: {
            'content': element.name,
            'offset': [25, 22]
          },
          icon: element.state ? personicon : pergray,
          events: {
            init: (o) => {
              this.markerRefs.person.push(o)
            },
            click: (e) => {
              const obje = element
              const uploadtime = parseTime(obje.location.uploadtime, '{y}-{m}-{d} {h}:{i}:{s}', true)
              this.windows[0].position = [obje.location.lon, obje.location.lat]
              this.windows[0].visible = true
              let strtip = `<span class="ml15 f12 g9">离线 </span>`
              if (obje.state) {
                strtip = `<span class="ml15 f12 blue">在线 </span>`
              }
              const ctstr = `<div class="info">
              <div class="info-top">${obje.name}${strtip}</div>
              <div @click="handler('1','${obje._id}')" class="info-middle" style="background-color: white;">
              <img src="${process.env.upload_API}images/user/${obje.location.user_id}.jpg" onerror="this.onerror=null;this.src='${avatar}'">
              地址：${obje.location.address}<br>更新时间：${uploadtime}<br>
              <a href="javascript:" style="color:blue">点击对话</a>
              </div></div>`
              this.windows[0].template = ctstr
              setTimeout(() => {
                this.center = [obje.location.lon, obje.location.lat]
              }, 300)
            },
            _id: element._id,
            dragend: (e) => {
            }
          },
          title: element.name,
          visible: true,
          draggable: false,
          extData: element
        }
        if (!this.seeting.allperson) { // 当不显示离线时
          if (!element.state) {
            obj.visible = false
          }
        }
        if (this.seeting.person) {
          this.markerArr.person.push(obj)
        }
      }
      // 请求数据
      getLatlonArr({ department_id: getDepCld() }).then(res => {
        let data = null
        res.info.forEach(element => {
          const count = new Date().getTime() - element.location.uploadtime * 1000
          if (count < 300000) { // 位置更新时间少于5分钟视为在线
            element.state = 1
          } else {
            element.state = 0
          }
        })
        data = res.info
        store.getters.allpersonlocaltion = data
        if (updateFlg) { // 是否更新
          data.forEach(element => {
            let flg = false
            this.markerArr.person.forEach(els => {
              if (els.extData._id === element._id && els.extData.location.uploadtime !== element.location.uploadtime) { // 覆盖数据
                console.log('跟新gengxing')
                flg = true
                els.position = [element.location.lon, element.location.lat]
                els.extData = element
                els.icon = element.state ? personicon : pergray
                els.title = element.name
                els.events = {
                  click: (e) => {
                    const obje = element
                    const uploadtime = parseTime(obje.location.uploadtime, '{y}-{m}-{d} {h}:{i}:{s}', true)
                    this.windows[0].position = [obje.location.lon, obje.location.lat]
                    this.windows[0].visible = true
                    let strtip = `<span class="ml15 f12 g9">离线 </span>`
                    if (obje.state) {
                      strtip = `<span class="ml15 f12 blue">在线 </span>`
                    }
                    const ctstr = `<div class="info">
                    <div class="info-top">${obje.name}${strtip}</div>
                    <div @click="handler('1','${obje._id}')" class="info-middle" style="background-color: white;">
                    <img src="${process.env.upload_API}images/user/${obje.location.user_id}.jpg" onerror="this.onerror=null;this.src='${avatar}'">
                    地址：${obje.location.address}<br>更新时间：${uploadtime}<br>
                    <a href="javascript:" style="color:blue">点击对话</a>
                    </div></div>`
                    this.windows[0].template = ctstr
                    setTimeout(() => {
                      this.center = [obje.location.lon, obje.location.lat]
                    }, 300)
                  }
                }
              }
              if (els.extData._id === element._id) {
                flg = true
              }
            })
            if (!flg) {
              console.log('添加新的图标', flg)
              addLatlon(element)
            }
          })
        } else {
          data.forEach((element, index) => {
            addLatlon(element)
          })
        }
        /*
        setTimeout(() => {
          if (this.cluster) {
            this.cluster.setMap(null)
          }
          this.cluster = new AMap.MarkerClusterer(this.$refs.map.$$getInstance(), this.markerRefs.person, {
            gridSize: 80,
            maxZoom: 16,
            renderCluserMarker: this._renderPersonMarker
          })
        }, 1000)
        */
      }).catch(errs => {
        console.log('获取部门人员位置出错', errs)
      })
    },
    getEventArr(updateFlg) { // 获取事件位置
      const addEvent = (element) => {
        element.type = 'event'
        if (element.lat) {
          const obj = {
            position: [element.lon, element.lat],
            label: {
              'content': element.name,
              'offset': [25, 22]
            },
            icon: eventicon,
            events: {
              init: (o) => {
                this.markerRefs.case.push(o)
              },
              click: (e) => {
                const objc = element
                const happen_time = parseTime(objc.happen_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                let update_time = '暂无更新'
                if (objc.update_time) {
                  update_time = parseTime(objc.update_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                }
                this.windows[0].position = [element.lon, element.lat]
                this.windows[0].visible = true
                // <a href="javascript:" style="color:blue">点击查看事件</a>
                const ctstr = `<div class="info">
                <div class="info-top">${objc.name}</div>
                <div class="info-middle"  style="background-color: white;">
                状态：<span class="g6">进行中...</span><br>
                地址：<span class="g6">${objc.address}</span><br>
                处理人：<span class="g6">${objc.username}</span> <br>
                发生时间：<span class="g6">${happen_time}</span><br>
                更新时间：<span class="g6">${update_time}</span><br>
                </div></div>`
                this.windows[0].template = ctstr
              },
              dragend: (e) => {
              }
            },
            title: element.name,
            visible: true,
            extData: element
          }
          if (this.seeting.event) {
            this.markerArr.case.push(obj)
          }
        }
      }
      getEventArr({ start_index: 0, length: 10000, department_id: getDepCld() }).then(res => {
        const data = res.info.list.filter((obj) => {
          return !obj.status
        })
        if (updateFlg) { // 是否更新
          data.forEach(element => {
            let flg = false
            this.markerArr.case.forEach(els => {
              if (els.extData._id === element._id && els.extData.update_time !== element.update_time) { // 覆盖数据
                flg = true
                els.position = [element.lon, element.lat]
                els.extData = element
                els.title = element.name
                els.events.click = (e) => {
                  const obj = element
                  const happen_time = parseTime(obj.happen_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                  let update_time = '暂无更新'
                  if (obj.update_time) {
                    update_time = parseTime(obj.update_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                  }
                  this.windows[0].position = [element.lon, element.lat]
                  this.windows[0].visible = true
                  // <a href="javascript:" style="color:blue">点击查看事件</a>
                  const ctstr = `<div class="info">
                  <div class="info-top">${obj.name}</div>
                  <div class="info-middle"  style="background-color: white;">
                  状态：<span class="g6">进行中...</span><br>
                  地址：<span class="g6">${obj.address}</span><br>
                  处理人：<span class="g6">${obj.username}</span> <br>
                  发生时间：<span class="g6">${happen_time}</span><br>
                  更新时间：<span class="g6">${update_time}</span><br>
                  </div></div>`
                  this.windows[0].template = ctstr
                }
                els.events.dragend = (e) => {
                }
              }
              if (els.extData._id === element._id) {
                flg = true
              }
            })
            if (!flg) {
              console.log('添加新的图标', flg)
              addEvent(element)
            }
          })
        } else {
          data.forEach((element, index) => {
            addEvent(element)
          })
        }
        /*
        setTimeout(() => {
          this.cluster = new AMap.MarkerClusterer(this.$refs.map.$$getInstance(), this.markerRefs.case, {
            gridSize: 80,
            maxZoom: 16,
            renderCluserMarker: this.__renderCaseMarker
          })
        }, 1000)
        */
      }).catch(errs => {
        console.log('获取事件位置出错', errs)
      })
    },
    getAreaperson(updateFlg) {
      const addAreaperson = (element) => {
        element.type = 'areaperson'
        if (element.lat) {
          const obj = {
            position: [element.lng, element.lat],
            label: {
              'content': element.name,
              'offset': [25, 22]
            },
            icon: areapersonicon,
            events: {
              init: (o) => {
                this.markerRefs.areaperson.push(o)
              },
              click: (e) => {
                const objc = element
                const happen_time = parseTime(objc.create_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                let update_time = '暂无更新'
                if (objc.update_time) {
                  update_time = parseTime(objc.update_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                }
                this.windows[0].position = [element.lng, element.lat]
                this.windows[0].visible = true
                // <a href="javascript:" style="color:blue">点击查看事件</a>
                const ctstr = `<div class="info">
                <div class="info-top">${objc.name}</div>
                <div class="info-middle"  style="background-color: white;">
                状态：<span class="g6">${objc.status}</span><br>
                类型：<span class="g6">${objc.class}</span><br>
                地址：<span class="g6">${objc.residence}</span><br>
                处理人：<span class="g6">${objc.recorder_id}</span> <br>
                添加时间：<span class="g6">${happen_time}</span><br>
                更新时间：<span class="g6">${update_time}</span><br>
                </div></div>`
                this.windows[0].template = ctstr
              },
              dragend: (e) => {
              }
            },
            title: element.name,
            visible: true,
            extData: element
          }
          if (this.seeting.event) {
            this.markerArr.areaperson.push(obj)
          }
        }
      }
      GetPersonForId({ start_index: 0, length: 10000, department_id: getDepCld() }).then(res => {
        var data = res.info.list
        var classleb = res.info.classname
        data.forEach(element => {
          classleb.forEach(cl => {
            if (element.class === cl.class) {
              element.class = cl.name
            }
            if (element.status === cl.status) {
              element.status = cl.name
            }
          })
        })
        if (updateFlg) { // 是否更新
          data.forEach(element => {
            let flg = false
            this.markerArr.areaperson.forEach(els => {
              if (els.extData._id === element._id && els.extData.update_time !== element.update_time) { // 覆盖数据
                flg = true
                els.position = [element.lng, element.lat]
                els.extData = element
                els.title = element.name
                els.events.click = (e) => {
                  const objc = element
                  const happen_time = parseTime(objc.create_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                  let update_time = '暂无更新'
                  if (objc.update_time) {
                    update_time = parseTime(objc.update_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                  }
                  this.windows[0].position = [element.lng, element.lat]
                  this.windows[0].visible = true
                  // <a href="javascript:" style="color:blue">点击查看事件</a>
                  const ctstr = `<div class="info">
              <div class="info-top">${objc.name}</div>
              <div class="info-middle"  style="background-color: white;">
              状态：<span class="g6">${objc.status}</span><br>
              类型：<span class="g6">${objc.class}</span><br>
              地址：<span class="g6">${objc.residence}</span><br>
              处理人：<span class="g6">${objc.recorder_id}</span> <br>
              添加时间：<span class="g6">${happen_time}</span><br>
              更新时间：<span class="g6">${update_time}</span><br>
              </div></div>`
                  this.windows[0].template = ctstr
                }
                els.events.dragend = (e) => {
                }
              }
              if (els.extData._id === element._id) {
                flg = true
              }
            })
            if (!flg) {
              console.log('添加新的图标', flg)
              addAreaperson(element)
            }
          })
        } else {
          data.forEach((element, index) => {
            addAreaperson(element)
          })
        }
        /*
        setTimeout(() => {
          if (this.areapersonster) {
            this.areapersonster.setMap(null)
          }
          console.log(this.markerRefs.areaperson)
          this.areapersonster = new AMap.MarkerClusterer(this.$refs.map.$$getInstance(), this.markerRefs.areaperson, {
            gridSize: 80,
            maxZoom: 16,
            renderCluserMarker: this.__renderAreapersonMarker
          })
        }, 1000)
        */
      }).catch(errs => {
        console.log('获取区域人员管理位置出错', errs)
      })
    },
    getFacilities(updateFlg) {
      const addFacilities = (element) => {
        element.type = 'facilities'
        if (element.lat) {
          const obj = {
            position: [element.lng, element.lat],
            label: {
              'content': element.name,
              'offset': [25, 22]
            },
            icon: facilitiesicon,
            events: {
              init: (o) => {
                this.markerRefs.construct.push(o)
              },
              click: (e) => {
                const objc = element
                const happen_time = parseTime(objc.create_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                let update_time = '暂无更新'
                if (objc.update_time) {
                  update_time = parseTime(objc.update_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                }
                this.windows[0].position = [element.lng, element.lat]
                this.windows[0].visible = true
                // <a href="javascript:" style="color:blue">点击查看事件</a>
                const ctstr = `<div class="info">
                <div class="info-top">${objc.name}</div>
                <div class="info-middle"  style="background-color: white;">
                状态：<span class="g6">${objc.status}</span><br>
                地址：<span class="g6">${objc.address}</span><br>
                处理人：<span class="g6">${objc.recorder_name}</span> <br>
                添加时间：<span class="g6">${happen_time}</span><br>
                更新时间：<span class="g6">${update_time}</span><br>
                </div></div>`
                this.windows[0].template = ctstr
              },
              dragend: (e) => {
              }
            },
            title: element.name,
            visible: true,
            extData: element
          }
          if (this.seeting.event) {
            this.markerArr.construct.push(obj)
          }
        }
      }
      GetFacilitiesForId({ start_index: 0, length: 10000, department_id: getDepCld() }).then(res => {
        var data = res.info.list
        var classleb = res.info.classname
        data.forEach(element => {
          classleb.forEach(cl => {
            if (element.class === cl.class) {
              element.class = cl.name
            }
            if (element.status === cl.status) {
              element.status = cl.name
            }
          })
        })
        if (updateFlg) { // 是否更新
          data.forEach(element => {
            let flg = false
            this.markerArr.construct.forEach(els => {
              if (els.extData._id === element._id && els.extData.update_time !== element.update_time) { // 覆盖数据
                flg = true
                els.position = [element.lng, element.lat]
                els.extData = element
                els.title = element.name
                els.events.click = (e) => {
                  const objc = element
                  const happen_time = parseTime(objc.create_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                  let update_time = '暂无更新'
                  if (objc.update_time) {
                    update_time = parseTime(objc.update_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                  }
                  this.windows[0].position = [element.lng, element.lat]
                  this.windows[0].visible = true
                  // <a href="javascript:" style="color:blue">点击查看事件</a>
                  const ctstr = `<div class="info">
                  <div class="info-top">${objc.name}</div>
                  <div class="info-middle"  style="background-color: white;">
                  状态：<span class="g6">${objc.status}</span><br>
                  地址：<span class="g6">${objc.address}</span><br>
                  处理人：<span class="g6">${objc.recorder_name}</span> <br>
                  添加时间：<span class="g6">${happen_time}</span><br>
                  更新时间：<span class="g6">${update_time}</span><br>
                  </div></div>`
                  this.windows[0].template = ctstr
                }
                els.events.dragend = (e) => {
                }
              }
              if (els.extData._id === element._id) {
                flg = true
              }
            })
            if (!flg) {
              console.log('添加新的图标', flg)
              addFacilities(element)
            }
          })
        } else {
          data.forEach((element, index) => {
            addFacilities(element)
          })
        }
        /*
        setTimeout(() => {
          this.cluster = new AMap.MarkerClusterer(this.$refs.map.$$getInstance(), this.markerRefs.construct, {
            gridSize: 80,
            maxZoom: 16,
            renderCluserMarker: this.__renderConstructMarker
          })
        }, 1000)
        */
      }).catch(errs => {
        console.log('获取区域设施位置出错', errs)
      })
    },
    handler(type, val) {
      console.log(type, val)
      if (type === '1') {
        Bus.$emit('chatVel', val)
      }
    },
    updateRegion() { // 修改区域用户
      this.regionobj.user_ids = this.regionobj.userArr.join(',')
      updateRegion(this.regionobj).then(response => {
        this.regionobj.update = false
        this.regionobj.dialogFormVisible = false
        this.$message({
          message: '修改成功！',
          type: 'success',
          duration: 4 * 1000
        })
        this.getRegion()
      }).catch(() => {
        this.$message({
          message: '修改失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    deteleRegion() { // 删除区域
      this.$confirm('确认删除当前区域？').then(() => {
        this.regionobj.status = 1
        updateRegion(this.regionobj).then(response => {
          this.regionobj.dialogFormVisible = false
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 4 * 1000
          })
          this.getRegion()
        }).catch(() => {
          this.$message({
            message: '删除失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => { console.log('取消修改') })
    },
    filterDepRose(id) { // 转换部门和集合
      let name = '无'
      this.depArr.forEach(function(els) {
        if (Number(id) === els._id) {
          name = els.name
        }
      }, this)
      return name
    },
    filterUser(arr) { // 转换用户
      let name = '无'
      arr.forEach(element => {
        this.userArr.forEach(function(els) {
          if (Number(element) === els._id) {
            name += els.name + '，'
          }
        }, this)
      })
      return name
    },
    _renderCluserMarker(context) { // 官方送的聚合样式
      console.log(context)
      var factor = Math.pow(context.count / 16, 1 / 18)
      var div = document.createElement('div')
      var Hue = 180 - factor * 180
      var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
      var fontColor = 'hsla(' + Hue + ',100%,20%,1)'
      var borderColor = 'hsla(' + Hue + ',100%,40%,1)'
      var shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
      div.style.backgroundColor = bgColor
      var size = Math.round(30 + Math.pow(context.count / 16, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px ' + borderColor
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px ' + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = fontColor
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    },
    _renderPersonMarker(context) { // 同事聚合图标样式
      var div = document.createElement('div')
      div.style.backgroundColor = 'rgba(220, 106, 111, 0.7)'
      var size = Math.round(30 + Math.pow(context.count / 16, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px rgba(220, 106, 111, 1)'
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px rgba(220, 106, 111, 0.3)'
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = '#000'
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    },
    __renderCaseMarker(context) { // 案件聚合图标样式
      var div = document.createElement('div')
      div.style.backgroundColor = 'rgba(0, 0, 255, 0.7)'
      var size = Math.round(30 + Math.pow(context.count / 16, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px rgba(0, 0, 255, 1)'
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px rgba(0, 0, 255, 0.3)'
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = '#000'
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    },
    __renderAreapersonMarker(context) { // 区域人员管理聚合图标样式
      var div = document.createElement('div')
      div.style.backgroundColor = 'rgba(217, 83, 251, 0.7)'
      var size = Math.round(30 + Math.pow(context.count / 16, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px rgba(217, 83, 251, 1)'
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px rgba(217, 83, 251, 0.3)'
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = '#000'
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    },
    __renderConstructMarker(context) { // 区域设施管理聚合图标样式
      var div = document.createElement('div')
      div.style.backgroundColor = 'rgba(95, 245, 155, 0.7)'
      var size = Math.round(30 + Math.pow(context.count / 16, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px rgba(95, 245, 155, 1)'
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px rgba(95, 245, 155, 0.3)'
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = '#000'
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    },
    isopen(e) { // 显示配置，打开关闭某一个部分
      this.seeting = e
    },
    centerpersonMap(e) {
      this.center = e
      this.zoom = 16
    }
  },
  computed: {
    ...mapGetters({
      useinfo: 'useinfo'
    })
  },
  components: {
    sideBar: SideBar
  }
}
</script>
<style lang="scss">
.pottoolbar{
  position: fixed;
  top: 96px;
  right: 102px;
  display: inline-block;
  color: #34495e;
  font-size: 12px;
  line-height: 20px;
  background-color: #fff;
  white-space: nowrap;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.amap-maptype-list p{
  font-size: 0;
}
.pht100{
  height: 100%;
}
// .amap-marker{
//   .amap-icon{
//     img{
//       width: 27px;
//       height: 36px;
//     }
//   }
// }
.amap-marker-label{
  border-radius: 2px;
  border-color: #ddd;
}
.info {
  .info-top {
    position: relative;
    border-bottom: 1px solid #CCC;
  }
  .info-top div {
      display: inline-block;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      line-height: 31px;
      padding: 0 10px;
  }
  .info-middle {
      font-size: 12px;
      padding: 6px;
      line-height: 20px;
      min-width: 300px;
  }
  span {
      margin-left: 5px;
      font-size: 11px;
  }
  .info-middle img {
      float: left;
      margin-right: 6px;
      max-width: 70px!important;
  }
}
</style>
