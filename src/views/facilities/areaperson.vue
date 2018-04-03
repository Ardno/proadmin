<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <span class="f16">区域人员管理</span>
    </div>
    <!-- 分页 -->
    <div class="mb10">
      <el-select clearable v-if="isAccess('83')" v-model="pageobj.area_id" filterable placeholder="所属区域" @change="handleQuery">
        <el-option v-for="item in  regionArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable v-model="pageobj.status" placeholder="状态" @change="handleQuery">
        <el-option v-for="item in  statusArr" :key="item.id" :label="item.text" :value="item.id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable filterable v-model="pageobj.class" placeholder="人员类型" @change="handleQuery">
        <el-option v-for="item in  classArr" :key="item.id" :label="item.text" :value="item.id">
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
      <el-table-column align="center" label="姓名" width="120">
        <template slot-scope="scope">
          <!--<span>{{scope.row.name}}</span>-->
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" effect="light">
              <a>
              <img v-bind:src="'http://120.76.228.172:83/images/other/'+scope.row.areaperson_img"
                   style="max-width:100px;max-height: 100px;" ref="showmes" @click="showImg"/>
              </a>
            </div>
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
          <el-tag v-if="scope.row.status == '0'" type="info">删除</el-tag>
          <el-tag v-if="scope.row.status == '1'" type="primary">正常</el-tag>
          <el-tag v-if="scope.row.status == '2'" type="danger">脱贫</el-tag>
          <el-tag v-if="scope.row.status == '3'" type="info">外出</el-tag>
          <el-tag v-if="scope.row.status == '4'" type="warning">生病</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.idNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex == '0'" type="primary">男</el-tag>
          <el-tag v-if="scope.row.sex == '1'" type="danger">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="住所" width="230">
        <template slot-scope="scope">
          <span>{{scope.row.residence}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员类型">
        <template slot-scope="scope">
          <span v-if="scope.row.class == '0'">贫困户</span>
          <span v-if="scope.row.class == '1'">孤寡老人</span>
          <span v-if="scope.row.class == '2'">刑满释放</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登记人">
        <template slot-scope="scope">
          <span>{{scope.row.recorder_name}}</span>
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
          <el-button size="small" type="success" @click="goOtherPage(scope.row._id)">记录
          </el-button>
          <el-button size="small" type="danger" v-if="isAccess('33')" v-show="scope.row.status"
                     @click="updateStaus(scope.row)">删除
          </el-button>
          <el-button size="small" type="info" v-if="isAccess('33')" v-show="!scope.row.status"
                     @click="updateStaus(scope.row)">还原
          </el-button>
          <!--<span v-if="scope.row._id===1" class="f12 g9 ml15">默认人员</span>-->
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
    <!-- 编辑一条 -->
    <el-dialog :title="titlea" @close="closeCalla" :visible.sync="dialogFormVisiblea">
      <el-form class="small-space" :model="dataa" :rules="infoRulesa" ref="infoForma" label-position="right"
               label-width="120px" style='width:90%; margin-left:30px;'>
        <el-form-item label="头像">
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataa.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="dataa.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="住址" prop="residence">
          <!--<el-input v-model="dataa.sex"></el-input>-->
          <input class="el-input__inner" v-model="dataa.residence" placeholder="选择位置"/>
          <span class="blue poi" @click="selectLoc(dataa)"><i class="el-icon-location"></i>选择地点</span>
        </el-form-item>
        <el-form-item label="身份证" prop="idNum">
          <el-input v-model="dataa.idNum" :value="dataa.idNum"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dataa.mobile" :value="dataa.mobile"></el-input>
        </el-form-item>
        <el-form-item label="所在区域">
          <el-select v-model="dataa.area_id" placeholder="请选择">
            <el-option v-for="item in regionArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员类型">
          <el-select v-model="dataa.class" placeholder="请选择">
            <el-option v-for="cla in classArr" :key="cla.id" :label="cla.text" :value="cla.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员状态">
          <el-select v-model="dataa.status" placeholder="请选择">
            <el-option v-for="item in statusArr" :key="item.id" :label="item.text" :value="item.id">
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
        <el-form-item label="人员状态">
          <el-select v-model="updatedataa.status" placeholder="请选择">
            <el-option v-for="item in statusArr" :key="item.id" :label="item.text" :value="item.id">
            </el-option>
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
    <el-dialog :visible.sync="showimgsss">
      <img v-bind:src="currentSrc" alt="" style="max-width:100%">
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VueAMap from 'vue-amap'
  import { deepClone, parseTime } from '@/utils/index'
  import { addPerson, GetPersonForId, addUpdatePersonInfo, updatePerson } from '@/api/areaperson'
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
          pagesize: 10
        },
        activeName: 'first',
        adclist: null,
        listLoading: false,
        tableKey: 0,
        titlea: '',
        dialogVisible1: false,
        showimgsss: false,
        currentSrc: null,
        positionObj: {
          lnglat: '',
          address: ''
        },
        userAll: [],
        amapManager,
        zoom: 13,
        center: [114.085947, 22.54702],
        dialogFormVisiblea: false,
        updateFormVisiblea: false,
        dataa: {
          name: '',
          area_id: '',
          sex: 0
        },
        updatedataa: {},
        infoRulesa: {
          name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
          residence: [{ required: true, message: '请选择正确地址', trigger: 'blur' }],
          idNum: [
            { required: true, message: '请输入身份证', trigger: 'blur' },
            {
              pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
              message: '证件号码格式有误！',
              trigger: 'blur'
            }],
          mobile: [
            { required: true, message: '请输入身份证', trigger: 'blur' },
            { pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号输入有误！', trigger: 'blur' }]
        },
        statusArr: [{ id: 0, text: '已删除' }, { id: 1, text: '正常' }, { id: 2, text: '脱贫' }, { id: 3, text: '外出' }, { id: 4, text: '生病' }],
        classArr: [{ 'id': '0', 'text': '贫困户' }, { 'id': '1', 'text': '孤寡老人' }],
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
    filters: {
      statusFilter(status, time) {
        const statusMap = ['', '每天', '工作日', '指定日期']
        if (status === 3) {
          const timearr = time.split(',')
          const arr = []
          timearr.forEach(function(element) {
            element = parseTime(Number(element), '{y}-{m}-{d}', true)
            arr.push(element)
          }, this)
          return arr.join(',')
        }
        return statusMap[status]
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
    },

    methods: {
      isAccess: isAccess,
      selectareaforid(areaid) { // 遍历所有区域id，把id改为中文名
        var namecc
        this.regionArr.forEach(e => {
          if (areaid === e._id) {
            namecc = e.name
            return
          }
        })
        return namecc
      },
      selectuserid(user) { // 遍历所有用户，把录入人员的id改为中文名
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
      addruleadc() {
        this.dialogFormVisiblea = true
        this.titlea = '添加人员'
        this.dataa = {
          name: '',
          sex: 0,
          area_id: '',
          create_time: '',
          residence: '', // 住址
          recorder_id: '',
          areaperson_img: '',
          idNum: null,
          mobile: null
        }
      },
      showImg(event) {
        this.currentSrc = event.srcElement.currentSrc
        this.showimgsss = true
      },
      addUpdateInfo(item) {
        console.log('添加修改信息')
        this.titlea = '添加修改信息记录'
        this.updatedataa.user_id = item._id
        this.updateFormVisiblea = true
      },
      handleUpdateDa(item) { // 修改人员信息
        this.titlea = '修改人员信息'
        this.dataa = deepClone(item)
        if (this.dataa.areaperson_img) {
          var els = this.dataa.areaperson_img
          var obj = {
            name: els,
            url: `${process.env.upload_API}images/other/${els}`
          }
          this.dataa.fileList = []
          this.dataa.fileList.push(obj)
        }
        this.dialogFormVisiblea = true
      },
      handleAddUpdate() { // 添加修改人员信息
        this.$refs.infoForma.validate(valid => {
          if (valid) {
            if (this.titlea === '添加人员') {
              this.dataa.recorder_id = this.userInfo._id
              console.log('添加人员')
              addPerson(this.dataa).then(response => {
                this.dialogFormVisiblea = false
                this.$message({
                  message: '添加人员成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
                this.handleQuery()
              }).catch(() => {
                this.$message({
                  message: '添加人员失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            } else if (this.titlea === '修改人员信息') {
              console.log('修改人员信息')
              this.$confirm('确认修改？').then(() => {
                updatePerson(this.dataa).then(response => {
                  this.dialogFormVisiblea = false
                  this.$message({
                    message: '修改人员成功！',
                    type: 'success',
                    duration: 4 * 1000
                  })
                  this.handleQuery()
                }).catch(() => {
                  this.$message({
                    message: '修改人员失败，请稍后再试',
                    type: 'error',
                    duration: 4 * 1000
                  })
                })
              }).catch(() => {
                console.log('取消修改')
              })
            } else if (this.titlea === '添加修改信息记录') {
              this.updatedataa.recorder_id = this.userInfo._id
              this.$confirm('确认添加？').then(() => {
                if (!this.updatedataa.areaperson_img) { // 判断是否有图片
                  this.$message({
                    message: '必须上传图片，请稍后再试！',
                    type: 'error',
                    duration: 4 * 1000
                  })
                  return
                }
                if (!this.updatedataa.status) { // 判断是否选择状态
                  this.$message({
                    message: '必须选择状态，请稍后再试！',
                    type: 'error',
                    duration: 4 * 1000
                  })
                  return
                }
                addUpdatePersonInfo(this.updatedataa).then(response => {
                  this.updateFormVisiblea = false
                  this.$message({
                    message: '修改人员成功！',
                    type: 'success',
                    duration: 4 * 1000
                  })
                  this.handleQuery()
                }).catch(() => {
                  this.$message({
                    message: '修改人员失败，请稍后再试',
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
      updateStaus(item) { // 修改人员状态
        let tipStr = ''
        let status = 0
        if (item.status) { // 恢复
          tipStr = '你确定要恢复当前人员？'
        } else { // 设置失效
          tipStr = '你确定要删除当前人员？'
          status = 1
        }
        this.$confirm(tipStr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updatePerson({ _id: item._id, status: status }).then(response => {
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
        console.log(this.positionObj)
        this.dataa.residence = this.positionObj.address
        this.dataa.lng = this.positionObj.lnglat[0]
        this.dataa.lat = this.positionObj.lnglat[1]
        this.$refs.infoForma.validate(valid => {
          console.log(this.dataa)
        })
      },
      closeCalla() {
        this.$refs.infoForma.resetFields()
      }, //
      handleQuery() { // 查询所有数据集合
        console.log(this.pageobj)
        this.getadcArray()
      },
      getadcArray() { // 获取数据集合
        this.listLoading = true
        if (!this.isAccess('31')) {
          console.log(this.userInfo)
          this.pageobj._id = this.userInfo._id
        }
        console.log(this.pageobj)
        GetPersonForId(this.pageobj).then(response => {
          console.log(response)
          this.adclist = response.info.list
          this.totalPages = response.info.count
          // this.adclist.reverse()
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.pageobj.pagesize = val
        this.currentPage = 1
        this.pageobj.start_index = (this.currentPage - 1) * val
        this.pageobj.length = val
        this.getadcArray()
      },
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
              item.areaperson_img = obj.name
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
        this.$router.push({ path: '/facilities/arecord' })
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
