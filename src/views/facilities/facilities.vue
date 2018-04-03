<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <span class="f16">区域设施管理</span>
    </div>
    <!-- 筛选 -->
    <div class="mb10">
      <el-select clearable v-if="isAccess('83')" v-model="pageobj.area_id" filterable placeholder="所属区域" @change="handleQuery">
        <el-option v-for="item in  regionArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable filterable v-model="pageobj.facilities_class" placeholder="设施类型" @change="handleQuery">
        <el-option v-for="item in  classArr" :key="item.id" :label="item.text" :value="item.id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable v-model="pageobj.status" placeholder="状态" @change="handleQuery">
        <el-option v-for="item in  statusArr" :key="item.id" :label="item.text" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="plus" @click="addruleadc" v-if="isAccess('31')">添加</el-button>
    </div>
    <!-- 主要内容 -->
    <el-table :key='tableKey' :data="adclist" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row>
      <el-table-column align="center" label="编号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="120">
        <template slot-scope="scope">
          <!--<span>{{scope.row.name}}</span>-->
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" effect="light">
              <img v-bind:src="'http://120.76.228.172:83/images/other/'+scope.row.facilities_img"
                   style="max-width:100px;max-height: 100px;"/></div>
            <el-button>{{scope.row.name}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在区域" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.area_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <span v-for="item in  statusArr" v-if="scope.row.status == item.id" type="primary">{{item.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人电话" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设施地址" width="230">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设施类型">
        <template slot-scope="scope">
          <span v-for="item in  classArr" type="primary" v-if="scope.row.facilities_class == item.id">{{item.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人">
        <template slot-scope="scope">
          <span>{{selectuserid(scope.row.user_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="290">
        <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="isAccess('32')" @click="handleUpdateDa(scope.row)">修改</el-button>
          <el-button size="small" type="primary" @click="addUpdateInfo(scope.row)">更新</el-button>
          <el-button size="small" type="success" @click="goOtherPage(scope.row._id)">记录</el-button>
          <el-button size="small" type="danger" v-if="isAccess('33')" v-show="scope.row.status" @click="updateStaus(scope.row)">删除</el-button>
          <el-button size="small" type="info" v-if="isAccess('33')" v-show="!scope.row.status" @click="updateStaus(scope.row)">还原</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block pt20 pb20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageobj.pagesize"
        :page-sizes="[10, 15, 20, 25]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPages">
      </el-pagination>
    </div>
    <!-- 新建或编辑一条 -->
    <el-dialog :title="titlea" @close="closeCalla" :visible.sync="dialogFormVisiblea">
      <el-form class="small-space" :model="dataa" :rules="infoRulesa" ref="infoForma" label-position="right"
               label-width="120px" style='width:90%; margin-left:30px;'>
        <el-form-item label="设施照片">
          <el-upload class="upload-demo"
                     action=""
                     :http-request="data => handleFileUpload(data,dataa)"
                     :file-list="dataa.fileList"
                     :on-exceed="handleExceed"
                     multiple
                     list-type="picture" :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">最多只能上传1张图片</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="设施名称" prop="name">
          <el-input v-model="dataa.name"></el-input>
        </el-form-item>
        <el-form-item label="设施类型" prop="facilities_class">
          <el-radio-group v-model="dataa.facilities_class">
            <template v-for="item in  classArr">
              <el-radio :label="item.id" :key="item.id">{{item.text}}</el-radio>
            </template>
            <!--<el-radio :label="1">路政设施</el-radio>-->
            <!--<el-radio :label="2">环卫设施</el-radio>-->

            <!--<span v-for="item in  classArr" type="primary" v-if="scope.row.facilities_class == item.id">{{item.text}}</span>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设施状态" prop="status">
          <el-select v-model="dataa.status" placeholder="请选择">
            <template v-for="item in  statusArr">
              <el-option :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="设施地址" prop="address">
          <input class="el-input__inner" v-model="dataa.address" placeholder="选择位置"/>
          <span class="blue poi" @click="selectLoc(dataa)"><i class="el-icon-location"></i>选择地点</span>
        </el-form-item>
        <el-form-item label="负责人" prop="user_id">
          <el-select clearable v-model="dataa.user_id" filterable placeholder="请选择">
            <!--<el-option v-for="varea in userArr" :key="varea._id" :label="varea.name" :value="varea._id">-->
            <!--</el-option>-->

            <el-option-group
              v-for="group in userAlltodepArr"
              :key="group.dept.name"
              :label="group.dept.name">
              <el-option
                v-for="item in group.user"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人电话" prop="mobile">
          <el-input v-model="dataa.mobile" :value="dataa.mobile"></el-input>
        </el-form-item>
        <el-form-item label="所在区域" prop="area_id">
          <el-select v-model="dataa.area_id" placeholder="请选择">
            <el-option v-for="varea in regionArr" :key="varea._id" :label="varea.name" :value="varea._id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblea = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更新一条状态 -->
    <el-dialog :title="titlea" @close="closeCalla" :visible.sync="updateFormVisiblea">
      <el-form class="small-space" :model="updatedataa" :rules="infoRulesa" ref="infoForma" label-position="right"
               label-width="120px" style='width:90%; margin-left:30px;'>
        <el-form-item label="记录照片">
          <el-upload class="upload-demo"
                     action=""
                     :http-request="data => handleFileUpload(data,updatedataa)"
                     :file-list="updatedataa.fileList"
                     :on-exceed="handleExceed"
                     multiple
                     list-type="picture" :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">最多只能上传1张图片</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="设施状态">
          <el-select v-model="updatedataa.status" placeholder="请选择">
            <template v-for="item in statusArr">
              <el-option :key="item.id" :label="item.text" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisiblea = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- </el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
  </el-tabs> -->
    <el-dialog title="选择地点" :visible.sync="dialogVisible1" width="800px">
      <div class="mb5">
        <p class="mb5">经纬度: {{positionObj.lnglat}}</p>
        <p class="mb5">地址: {{positionObj.address}}</p>
      </div>
      <div class="bdf" style="height:400px;">
        <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugin"
                 :events="events" class="amap-demo">
        </el-amap>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmLoc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VueAMap from 'vue-amap'
  import { deepClone } from '@/utils/index'
  import { addFacilities, GetFacilitiesForId, addUpdateFacilitiesInfo, updateFacilities } from '@/api/areaperson'
  import { getRegionArr } from '@/api/grid'
  import { isAccess } from '@/utils/auth'
  import { fileReaderBase64 } from '@/utils/utils'
  import { imgUpLoad } from '@/api/upload'

  const amapManager = new VueAMap.AMapManager()
  export default {
    data() {
      return {
        totalPages: 0,
        currentPage: 1,
        regionArr: [],
        pageobj: {
          start_index: 0,
          length: 10,
          pagesize: 10,
          area_id: null,
          facilities_class: null,
          status: null
        },
        activeName: 'first',
        adclist: null,
        listLoading: false,
        tableKey: 0,
        titlea: '',
        dialogVisible1: false,
        positionObj: {
          lnglat: '',
          address: ''
        },
        userAll: [],
        depArr: [],
        userAlltodepArr: [],
        amapManager,
        zoom: 13,
        center: [114.085947, 22.54702],
        dialogFormVisiblea: false,
        updateFormVisiblea: false,
        dataa: {
          name: '',
          area_id: ''
        },
        updatedataa: {},
        infoRulesa: {
          name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
          address: [{ required: true, message: '请选择正确地址', trigger: 'blur' }],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号输入有误！', trigger: 'blur' }],
          facilities_class: [{ required: true, message: '请填写类别', trigger: 'blur' }],
          status: [{ required: true, message: '请填写状态', trigger: 'blur' }],
          user_id: [{ required: true, message: '请填写负责人', trigger: 'blur' }],
          area_id: [{ required: true, message: '请选择区域', trigger: 'blur' }]
        },
        statusArr: [],
        classArr: [],
        events: {
          init: (map) => {
            const geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              timeout: 10000, // 超过10秒后停止定位，默认：无穷大
              buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              buttonPosition: 'RB'
            })
            map.addControl(geolocation)
            geolocation.getCurrentPosition()
            AMap.event.addListener(geolocation, 'complete', (data) => {
              console.log(data)
            })
            AMap.event.addListener(geolocation, 'error', (data) => {
            })
            AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
              const positionPicker = new PositionPicker({
                mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                map: map // 依赖地图对象
              })
              positionPicker.start()
              positionPicker.on('success', (positionResult) => {
                this.positionObj = {
                  lnglat: [positionResult.position.lng, positionResult.position.lat],
                  address: positionResult.address
                }
                // this.eventForm.address = positionResult.address
                // this.eventForm.lon = positionResult.position.lng
                // this.eventForm.lat = positionResult.position.lat
              })
              positionPicker.on('fail', (positionResult) => {
                this.positionObj = {
                  lnglat: '',
                  address: ''
                }
              })
            })
          },
          click: (e) => {
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
        item: ''
      }
    },
    created() {
      this.getadcArray()
      getRegionArr({ start_index: 0, length: 10000, status: 0 }).then(response => {
        const arr = response.info.list.filter(function(element) {
          return element.status === 0
        }, this)
        this.regionArr = arr
      })
      this.dept_user()
    },

    methods: {
      isAccess: isAccess,
      selectuserid(user) { // 遍历所有用户，把录入设施的id改为中文名
        this.userArr = this.$store.getters.commonInfo.userArr
        var namecc
        this.userArr.forEach(usera => {
          if (usera._id === user) {
            namecc = usera.name
            return
          }
        })
        return namecc
      },

      // 部门与用户数据展示处理
      dept_user() {
        this.depArr = this.$store.getters.commonInfo.depArr // 所有部门
        this.userAll = this.$store.getters.commonInfo.userArr // 所有设施
        if (this.depArr && this.depArr.length > 0 && this.userAll && this.userAll.length > 0) {
          this.depArr.forEach(_dept => {
            var m = {
              dept: _dept,
              user: []
            }
            this.userAll.forEach(_user => {
              if (_user.department_id === _dept._id) {
                m.user.push(_user)
              }
            })
            this.userAlltodepArr.push(m) // 部门列表中绑定设施
          })
          this.isLoad = true
        }
        if (!this.isLoad) {
          setTimeout(() => {
            this.dept_user()
          }, 1000)
        }
      },
      addruleadc() {
        this.dialogFormVisiblea = true
        this.titlea = '添加区域设施'
        this.dataa = {
          name: '',
          area_id: '',
          address: '', // 地址
          facilities_num: '',
          facilities_img: '',
          facilities_class: null,
          status: null,
          mobile: 18335410222,
          user_id: '',
          lng: null,
          lat: null
        }
      },
      handleClick(tab, event) { // tab切换
        console.log(tab, event)
      },
      addUpdateInfo(item) {
        console.log(item)
        console.log('添加修改信息')
        this.titlea = '添加修改信息记录'
        this.updatedataa.facilities_id = item._id
        this.updateFormVisiblea = true
      },
      handleUpdateDa(item) { // 修改设施信息
        this.titlea = '修改区域信息'
        this.dataa = deepClone(item)
        if (this.dataa.facilities_img) {
          var els = this.dataa.facilities_img
          var obj = {
            name: els,
            url: `${process.env.upload_API}images/other/${els}`
          }
          this.dataa.fileList = []
          this.dataa.fileList.push(obj)
        }
        this.dialogFormVisiblea = true
      },
      handleAddUpdate() { // 添加修改设施信息
        this.$refs.infoForma.validate(valid => {
          if (valid) {
            if (this.titlea === '添加区域设施') {
              this.dataa.recorder_id = this.userInfo._id
              console.log('添加设施')
              console.log(this.dataa)
              if (!this.dataa.facilities_img) {
                this.$message({
                  message: '请上传图片，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
                return
              }
              addFacilities(this.dataa).then(response => {
                this.dialogFormVisiblea = false
                this.$message({
                  message: '添加设施成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
                this.handleQuery()
              }).catch(() => {
                this.$message({
                  message: '添加设施失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            } else if (this.titlea === '修改区域信息') {
              console.log('修改设施信息')
              console.log(this.dataa)
              this.$confirm('确认修改？').then(() => {
                updateFacilities(this.dataa).then(response => {
                  this.dialogFormVisiblea = false
                  this.$message({
                    message: '修改区域成功！',
                    type: 'success',
                    duration: 4 * 1000
                  })
                  this.handleQuery()
                }).catch(() => {
                  this.$message({
                    message: '修改区域失败，请稍后再试',
                    type: 'error',
                    duration: 4 * 1000
                  })
                })
              }).catch(() => {
                console.log('取消修改')
              })
            } else if (this.titlea === '添加修改信息记录') {
              this.updatedataa.recorder_id = this.userInfo._id
              console.log(this.updatedataa)
              this.$confirm('确认添加？').then(() => {
                if (!this.updatedataa.facilities_img) {
                  this.$message({
                    message: '必须上传图片，请稍后再试！',
                    type: 'error',
                    duration: 4 * 1000
                  })
                  return
                }
                addUpdateFacilitiesInfo(this.updatedataa).then(response => {
                  this.updateFormVisiblea = false
                  this.$message({
                    message: '修改区域成功！',
                    type: 'success',
                    duration: 4 * 1000
                  })
                  this.handleQuery()
                }).catch(() => {
                  this.$message({
                    message: '修改区域失败，请稍后再试',
                    type: 'error',
                    duration: 4 * 1000
                  })
                })
              }).catch(() => {
                console.log('取消修改')
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateStaus(item) { // 修改设施状态
        let tipStr = ''
        let status = 0
        if (item.status) { // 恢复
          tipStr = '你确定要恢复当前区域？'
        } else { // 设置失效
          tipStr = '你确定要删除当前区域？'
          status = 1
        }
        this.$confirm(tipStr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateFacilities({ _id: item._id, status: status }).then(response => {
            item.status = status
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.$message({
              message: '修改失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        }).catch(() => {
        })
      },
      selectLoc(item) {
        this.dataa = item
        this.dialogVisible1 = true
      },
      comfirmLoc() {
        this.dialogVisible1 = false
        this.dataa.address = this.positionObj.address
        this.dataa.lat = this.positionObj.lnglat[1]
        this.dataa.lng = this.positionObj.lnglat[0]
        this.$refs.infoForma.validate(valid => {
          console.log(this.dataa)
        })
      },
      closeCalla() {
        this.$refs.infoForma.resetFields()
      }, //
      handleQuery() { // 查询所有数据集合
        this.pageobj.start_index = 0
        this.pageobj.length = 10
        this.getadcArray()
      },
      // 获取所有数据集合，加载页面首先执行的函数
      getadcArray() {
        this.listLoading = true
        if (!this.isAccess('31')) {
          this.pageobj._id = this.userInfo._id
        }
        GetFacilitiesForId(this.pageobj).then(response => {
          console.log(response)
          this.adclist = response.info.list
          this.totalPages = response.info.count
          // this.adclist.reverse()
          this.classArr = []
          this.statusArr = []
          response.info.classname.forEach(res => {
            if (res.class != null) {
              this.classArr.push({ id: res.class, text: res.name }) // 类别
            }
            if (res.status != null) {
              this.statusArr.push({ id: res.status, text: res.name })
            }
          })
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      // 分页的东西
      handleSizeChange(val) {
        this.pageobj.pagesize = val
        this.currentPage = 1
        this.pageobj.start_index = (this.currentPage - 1) * val
        this.pageobj.length = val
        this.getadcArray()
      },
      // 分页的东西
      handleCurrentChange(val) {
        this.currentPage = val
        this.pageobj.start_index = (this.currentPage - 1) * this.pageobj.pagesize
        this.pageobj.length = this.pageobj.pagesize
        this.getadcArray()
      },
      // 图片上传
      handleFileUpload(data, item) {
        console.log('handleFileUpload')
        fileReaderBase64(data.file).then(obj => {
          imgUpLoad({ FileData: obj.data, filetype: obj.postf, type: 1 }).then(res => {
            if (res.code === 200) {
              const obj = {
                'name': res.info,
                'status': 'success',
                'uid': data.file.uid,
                'url': `${process.env.upload_API}images/other/${res.info}`
              }
              console.log(obj)
              item.facilities_img = obj.name
              data.onSuccess()
            } else {
              data.onError()
            }
          })
        })
      },
      handleRemove(file, fileList, item) {
        let cunt = ''
        item.fileList.forEach((element, index) => {
          console.log(index)
          if (file.uid === element.uid) {
            cunt = index
          }
        })
        item.fileList.splice(cunt, 1)
      },
      handlePreview(file) {
        console.log('file')
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      goOtherPage(val) {
        this.$store.dispatch('setCaseId', val)
        this.$router.push({ path: '/facilities/frecord' })
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'useinfo'
      })
    }
  }
</script>
<style rel="stylesheet/scss" lang="css">
  .el-button{
    border:1px solid #fff;
  }
</style>
