// WebView加载页面

/**
 * webview初始化 - 建立连接 - 接收页面 - 接受样式 - 脚本下载解析执行    （这段过程是白屏状态）
 * 后端处理 - 接收数据 - 渲染
 * 
 * 页面布局： wxml
 * 页面样式： wxss
 * 页面脚本： javascript 和 wxs （WeixinScript）
 * 
 * 
 * AppId:  开发工具
 * 
 * 一个账号只能对应一个小程序
 * 个人和个体会类型主体可注册5个小程序
 * 企业，政府，媒体，其他组织主体可以注册50个小程序
 */

/**
 * 最上层 APP ————> pages —————> 组件
 * 
 * APP包括： app.json(全局配置) app.js(app实例，以及全局数据) app.wxss(全局样式)
 * 
 * page: page.json (页面配置)  page.js (page实例， 页面页面相关内容)  page.wxss  page.wxml
 * 
 * component: component.json  component.js   component.wxss component.wxml
 */

/**
 * 项目托管
 * 向git上传
 * 1. 初始化仓库   git init
 * 2. 添加 git add . 添加全部
 * 3. git commit -m '描述'  本地
 * 4. github中创建远程仓库
 * 5. 本地与远程关联git remote add origin 仓库地址
 * 6. 本地上传 git push -u origin master
 */

/**
 * 打tag进行提交
 * 1. git add . 
 * 2. git commit -m '描述'
 * 3. git tag 标签名
 * 4. git tag （显示已有的tag）
 * 5. git push --tags  (提交所有的tag)
 */

/**
 * git log  显示所有提交  显示出所有的提交的版本号 
 * 回退
 * git reset 版本号  
 * 强制回退
 * git reset --hard 版本号   
 */

/**
 * 查找tag
 * check out tag标签
 */


/**
 * 小程序数据绑定
 * js：
 *    data: {
 *       msg: 'abc'
 * }
 * wxml：
 *  <view>{{msg}}</view>
 * 
 * 小程序列表渲染
 * js:
 *  data: {
 *      list: [
 *          {
 *              name: 1, age: 2
 *           }
 *      ]
 * }
 * 
 * wxml:
 *  <view wx:for="{{list}}">{{item.name}} {{item.age}}</view>
 * 
 * 
 * 小程序事件监听
 * js: 
 *     data: {
 *          num: 1
 *      },
 *    addNum () {
 *       this.setData({
 *          num: this.data.num++
 *          })
 *    }
 * 
 * wxml:
 *  <view>{{num}}</view>
 *  <button bindtap="addNum">点击</button>
 * 
 * 
 * 
 * 
 * 小程序mvvm架构
 * 
 *  M： Model
 *  V:  View
 *  vm: ViewModel   使用{{}}语法。(dataBinding, DomListener)   vue，小程序（MINA框架）扮演的角色
 * 
 * 
 * 命令是变成： 原生dom编程
 * 声明式编程： vue
 * 
 * 
 * 小程序的配置：
 *  开发的很多需求添加到了配置文件
 *      1.提高开发效率
 *      2.风格一致
 *      3.导航栏顶部tabbar等。
 * 
 * 
 * 全局配置  app.json(小程序框架): 
 *  pages: ['', '']  必填       页面路径表
 *  window: {}       非必填     全局的默认窗口表现形式
 *  tabbar：{}       非必填     底部导航
 * 
 * 页面配置  page.json(小程序框架)：
 * 
 * 
 * 
 * 
 * 
 * 小程序的双线程模型： 
 *    宿主环境：执行各种文件的环境（wxml，js， wxss）
 *    双线程模型： 
 *      渲染层：wxml, wxss.多个页面，多个webview
 *  
 *      逻辑层： js
 * 
 * 
 *    界面渲染： wxml与wxjs相结合生成一个js对象，在将js对象转化为一个真实的dom，再将dom渲染到vwbview中
 * 
 *    小程序启动流程： 
 *        1. 下载小程序包  启动小程序    加载解析app.json    注册App()   执行App生命周期
 *                                                        加载自定义组件（page）
 *                                                          
 * 
 * 
 *  App生命周期： 
 *    onLaunch (options) {}  执行一次  小程序初始化回调            获取用户信息    
 *    onShow (options) {}    执行多次  小程序显示回调              获取进入场景    
 *    onHide () {}    小程序隐藏回调
 *    onError () {}   小程序发生错误回调
 * 
 * 
 * 获取用户信息方式
 *  1. wx.getUserInfo({
 *      success: (res) => {}    // 有可能被废弃
 * })
 * 
 *  2. <button open-type='getUserInf0' bindGetuserinfo='getUserInfo'>
 * 
 *  js: getUserInf0 (event) {}
 * 
 * 
 *  3. <open-data type='userNickName'></open-data>  使用open-data组件进行获取
 * 
 * 
 * 
 * 
 * 
 * 全局数据：
 * 
 * 
 *  globalData: {
 *    userInfo: 
 * }
 * 
 * 
 * 
 * 页面获取去全局对象
 * 
 * const app = getApp()
 * 
 * 
 * 
 * 
 * page生命周期：
 *    js： 调用Page方法，注册页面， 监听声明周期， 初始化数据，监听wxml的函数，页面滚动（onPageScroll(option)）、上拉加载,页面滚动到底部onReachBotton(){}、下拉刷新 onPullDownRefresh() {}
 *      
 *      监听生命周期：请求页面数据
 *          onLoad () {}      页面加载
 *          onShow () {}      页面显示
 *          onReady () {}     页面初次渲染完成
 *          onHide () {}      页面隐藏
 *          onUnload () {}    页面卸载
 *    
 *        
 * 
 * 内置组件： 
 *    text组件作用于显示文本，相当于span，行内元素  属性： selectable（是否可以选中true/false）、space(设置空格大小： nbsp, ensp, emsp)、decode(是否解码)
 * 
 * 
 * 
 * 
 * WXSS: css样式： 行内样式，页面样式，全局样式
 *        尺寸扩展：rpx.根据屏幕宽度进行自适应。rpx在iphone6(宽375)的屏幕下，是px的一半。  dpr = 2   1px = 2rpx
 * 
 * 
 *    样式导入：使用@import导入、官方样式的使用。使用官方wxml，wxss， js
 * 
 * 
 * wxml: 标签闭合
 * 
 * 
 * 
 * 逻辑判断： wx:if="{{isShow}}"       wx:elif     wx:else  显示隐藏
 * hidden属性：显示隐藏
 * 区别：hidden隐藏时是通过display: none。进行控制，元素存在。 wx:if  则是没有渲染。
 * 
 * 
 * 
 * 列表渲染： wx:for="{{list}}"  默认值：item   索引值：index  
 *           修改默认的item明， 主要用于多层循环。  修改item明： wx:form-item = 'outerItem'  wx:for-index = 'outerIndex'
 *           wx:key="{{index}}"  用于提高性能
 * 
 * 
 * block标签： <block></block> 不会渲染  用于包裹一组组件标签
 * 
 * 
 * 
 * 
 * 模板用法 template： 一组代码，用于代码的复用.现在用的少，现在支持自定义组件.
 * 模板在没有使用时，是不会渲染的
 * 必须含有name属性
 * 
 *  <template name='contentItem'>
 *    <view>template</view>
 *    <view>{{content}}</view>
 *    <text>{{name}}</text>
 * </template>
 * 
 * 使用模板：
 *  <template is="contentItem" data="{{content: 'content', name: 'name'}}"></template>
 * 
 * 将模板抽取到一个公共的文件中，使用的地方在引用
 * <import src="文件路径">  不可以在组建中导入另外一个模板
 * 
 * include 可以将目标文件除template,wxs之外的东西引入，允许递归导入
 * <include src='header'>
 * <view>中间内容</view>
 * <include src='footer'>
 * 
 * 
 * 
 * wxs: 小程序的一套脚本语言，结wxml，可以构建出页面的结构。
 *    wxml中不能调用一些函数：  25.333.toFixed(2)  不可以 保留两位小数
 * 
 * 目的： 在wxml中使用js代码
 * 
 * wxml中不能直接调用page、component中的函数
 * 
 *  wxs的运行环境是与其他javascript是隔离的，也不能调用其他的函数。
 * 
 * 
 * 抽取wxs代码：
 * wxml中引入wxs模块：<wxs src='wxs文件路径' module='name'></wxs>  不能使用绝对路径
 * 
 * wxs定义方法： 
 *  <wxs module='name'>
 *    // js代码  不能使用es6
 *    var name = 'james'
 *    function rname (name) {
 *      return name
 *    }
 *    module.exports = {
 *      name: name,
 *      rName: rName
 *    }
 *  </wxs>
 * 
 * wxml中使用wxs中的变量，方法
 * 
 * <view>
 *    {{name..name}}
 *    {{name.rName('lll')}}
 * </view>
 * 
 * 
 * 事件处理：
 *  <button bindtap='handleClick'> <button bind:tap='handleClick'> <button catch:tap='handleClick'>
 *  Page({
 *    handleClick() {}
 *  })
 * 
 * 绑定方法： bindtap  bind:tap   catchtap  cat:tap
 * 
 * 常见的事件类型：
 *  文档中都有
 * 
 * 
 *  所有的组件基本都有的： 
 *    touchstart  touchmove    touchcancel touched  触摸
 *    tap  点击
 *    longpress: 长按
 *    tap 事件与 longprss 事件只会触发一次
 * 
 * 
 * 事件对象：
 *  handleClick (e) {
 *    console.log(e)
 *  }
 * 
 *  touches和changedTouches的区别： 
 *    touches：记录者当前有几个触摸点的列表
 *    changedTouches: 触发事件发生后改变的触摸点的列表
 *    touched事件中可以查看到两者的变化：
 *    多个手指的触摸可以看到两中的变化 
 * 
 *  target和currentTarget的区别：
 *    事件冒泡导致
 *    target:产生事件的目标
 *    currentTarget: 发生事件的目标
 * 
 * 
 *  事件的传参：
 *   <button bindtap="handleClick" data-params1='{{参数}}' data-params1='{{参数二}}'></button>
 *   handleClick (e) {
 *      let dataset = e.currentTarget.dataset
 *      let params1 = dataSet.params1
*       let params2 = dataSet.params2
 *   }
 * 
 * 
 * 事件捕获和冒泡
 * 
 *  事件捕获的监听：<view capture-bind:tap='handleCapture' >   阻止捕获：<view capture-catch:tap='handleCapture' >
 *  事件冒泡的监听：<view bindtap='handleBindtap' >            阻止冒泡：<view capture-catch:tap='handleCapture' >
 *    
 * 
 * 
 * 
 * 组件化开发： 内置组件，自定义组件
 * 
 *  创建一个自定义组件：一个自定义组件包含 .json   .js  .wxml    .wxss文件
 * 
 *  使用自定义组件：
 *    1. 在使用自定义组件的page界面.json中引入 先配置usingCompenents属性： {'页面中使用的组件名'： '路径'}：  {useingComponents: {my-con: '自定义组件路径'}}
 *          这是局部注册。也可以在app.json中进行注册 useingCompenents： {}  全局注册 
 *    2. 在wxml中使用自定义组件： <my-con></my-con>
 * 
 *  标签名规则： 小写字母，下划线，中划线
 * 
 *  组件与使用页面之间的样式通常是不会相互影响的，但也可以相互影响。
 * 
 *  自定义组件与页面之间的通信：
 *    页面传递到自定义组件：传递数据：通过properties   传递样式：通过externalClasses       传递标签：通过slot
 *    自定义组件传值到页面：通过自定义事件
 * 
 * 
 *    传递数据: properties
 *      页面： <my-cpn title='111'></my-cpn>
 *      自定义组件my-cpn：  <view>{{title}}</view> 
 *         js文件中有properties: 设置 {属性名：属性值的类型}} 
 *              {title: String} || 
 *              {title: 
 *                    {type: String, value: '默认值'}
 *              }   相当于vue的props且有类型检测
 *  
 *    传递样式：
 *      页面： <my-cpn titleclass='red'></my-cpn>  在页面中创建red的样式
 *      自定义组件my-cpn：  <view class='title titleclass'>{{title}}</view> 
 *         js文件中有externalClasses: ['titleclass', '类名1'， '类名2']
 * 
 * 
 *    组件向页面传递数据使用自定义事件：
 *      页面：<view >{{counter}}</view> <my-cpn bind:click='handleClick'></my-cpn>     js: handleClick (e) {}
 *      自定义组件my-cpn：  <button bindtap='handleClick'>自定义组件</button>  
 *          js文件methods： {
 *                handleClick () {
 *                    this.triggerEvent('函数名'，'数据'， {})
 *                    this.triggerEvent('click'，'数据'， {})
 *                }
 *            }
 *    小程序的组件传参与vue基本一致。
 *                           vue                       小程序
 * 传递数据              组件中的props            组件中的properties
 * 传递样式（类名）       不支持                   externalClass: ['', '']
 * 子传父                通过事件触发              通过事件触发
 *              this.$emit('父组件自定义事件')     this.triggerEvent('父组件自定义事件')
 * 
 * 
 * 
 * 页面直接修改组建中的值：不推荐，推荐组件内可以暴露出一个方法进行修改，页面中使用my_select.methods进行修改
 *    页面：<button bindtap='handleClick'>修改组件内的值</button> <my-cpn id='comp' class='comp'></my-cpn> 
 *       js: handleClick() { 
 *            修改组件内的counter, 拿到组件对象
 *            const my_select = this.selectComponent('.comp || #comp')  this.selectComponent('class/id名')
 *            my_select.setData({
 *              counter: my_select.data.counter + 20
 *            })
 *          }
 *    组件：<view >{{counter}}</view>  js: counter: 20
 * 
 * slot插槽：组件内可以传入元素，组件，用于扩展组件。
 *  单个插槽：my-cpn组件
 *      <view>头</view>
 *      <slot></slot>
 *      <view>尾</view>
 *  使用单个插槽组件
 *    <my-cpn>
 *      <button>z中</button>
 *    <my-cpn>
 *   渲染:
 *      <view>头</view>
 *      <button>z中</button>
 *      <view>尾</view>
 * 
 * 
 * 多插槽：my-cpn组件
 *      <view>头</view>
 *      <slot name='slot1'></slot>
 *      <slot name='slot2'></slot>
 *      <slot name='slot3'></slot>
 *      <view>尾</view>
 *  使用多个插槽组件
 *    <my-cpn>
 *      <button slot='slot1'>slot1</button>
 *      <button slot='slot2'>slot1</button>
 *      <button slot='slot3'>slot1</button>
 *    <my-cpn>
 *   渲染:
 *      <view>头</view>
 *      <button>z中</button>
 *      <view>尾</view>
 *  1. 每一个插槽需要name属性
 *  2. 必须在Components的options属性中添加属性
 *        multipleSlots: true
 *        options: { multipleSlots: true }
 * 
 * 
 * 组件Component构造器中可以写那些属性：
 *  data: {} 初始化数据
 *  properties: {} 组件接收调用者传过来的值
 *  methods: {}  组件内的处理方法
 *  option: {}    组件的配置属性    例如： styleIsolation: 'shared'  是否允许父子组件之间类名相同样式的功用,  multipleSlots： true   组件使用多个插槽
 *  externalClass: ['className']   传入类名，使用外部样式
 *  observers: {}    属性和数据的监听
 *  pageLifetimes: { show () {}, hide () {}, resize () {} }  监听在当前页面的生命周期
 *  lefetimes: { created () {}, attached () {}, ready () {}, moved () {}, detached () {}}   监听组件本身的生命周期
 * 
 * 
 * 
 * 网络请求：
 *  专属API接口：
 *  wx.request({
 *    url: '',        地址
 *    methods: '',    请求方式
 *    data: '',       请求参数
 *    header: {},     请求头
 *    dataType: ''    返回的参数形式
 *    responseType:   返回的数据类型
 *    success (res) {},  成功之后的回调函数
 *  })
 * 
 *  小程序中请求某一个域名，需要配置请求的域名。 只支持https.wss, 不能使用ip。
 * 测试阶段：微信开发工具，详情不检查域名
 * 
 * 
 * 网络请求封装：
 *  降低与系统函数的耦合度 ，创建工具类，暴露调用方法。 使用promise,方法回调
 * 
 *  封装
 *  export default function request (options) {
 *    
 *    return new Promise ((resolve, reject) => {
 *        wx.request({
 *          url: options.url,
 *            method: options.method || 'get',
 *            data: options.data || ''
 *            success: resolve,
 *            error: reject
 *        })
 *    })
 *  }
 * 
 *  使用： 
 *    1. 引入  import request from '../utils/reques.js'
 *    2. request({
 *          url: 'url',
 *          data: {data: ''}
 *        }).then(res => {
 *          console.log(res)
 *        })
 * 
 * 
 * 
 * 展示弹窗
 * 
 *  Toast:  提示   会自动消失
 *    wx.showToast({
 *      title: '', 
 *    })
 * 
 *  modal: 有 确定，取消 按钮
 *    wx.showToast({
 *      title: '', 
 *      content: '',
 *      success: (res) {
 *          if (res.cancel) {用户点击取消}
 *          if (res.confirm) {用户点击确定}
 *      }
 *    })
 * 
 * loding   不会自动消失
 *  显示loading
 *  wx.showLoading({
 *      title: ''
 *    })
 *  隐藏loading
 *  wx.showLoading({
 *      title: ''
 *    })
 * 
 * 
 * actionSheet   从底部战术出来的选择框
 *  wx.showActionSheet({
 *      itemList: [],
 *      success: (res) => {
 *        返回itemList的index
 *       }
 *    })
 * 
 * 
 * 页面分享
 *  1. 右上角分享   必须设置页面分享函数 
 *  Page({ 
 *    onShareAppMessage (options) {
 *      return {
 *        title: '分享的小程序的标题，默认是小程序的名字',
 *        path: '别人打开之后的小程序的某个页面， 默认进入首页',
 *        imageUrl: '可以使本地，或者网络地址。如果没有路径，则把当前页面截图之后作为路径'
 *      }
 *    }  
 *  })
 * 
 *  2. 分享按钮进行分享
 *    <button open-type='share'>分享</button>
 *    还是必须实现page中的onShareAppMessage函数
 * 
 * 
 * 
 * 小程序登录流程：  小程序        开发者服务（我们的服务器）    微信接口服务（微信的服务）
 *  1. （客户端）调用 wx.login() 返回code  
 *  2. （客户端）调用wx.request发送code到我们的服务器
 *  3. （我们的后端服务）我们的服务器发送 code + Appid + AppSecret 到微信接口服务 获取session_key + openid(当前登录微信的唯一标识)
 *  4. （客户端，保存登录状态，token）返回登录状态  token   
 *  5.  (客户端)请求业务数据
 * 
 * 
 *  wx.login({
 *    success: (res) => {
 *      let code = res.code   五分钟有效期
 *      wx.request({
 *        method: 'post', data: {code}, url: 'url',
 *        success: (res) => {
 *          this.globalData.token = res.token
 *          小程序关闭 globalData重置  需要本地存储
 *          wx.setStorage(key, data) 异步   wx.setStorageSync(key, data)  同步   获取  wx.getStorage(key)
 *        }
 *      })
 *    }
 *  })
 * 
 * 
 * 每次登陆之前判断是否有token,没有token则登陆， 有token验证token，token无效则登陆，token有效，保存tooken
 * 
 * 
 * 
 * 页面跳转
 *  通过navigator组件
 *    <navigator url='pageUrl'>页面跳转</navagitor>
 *    navigator ：open-type属性： 
 *  页面跳转数据传递：
 *   A到B页面传递参数
 *  <navigator url='pageUrl?name=aaa&age=18'>页面跳转</navagitor>  接收参数   页面生命周期  onLoad (options)   {}
 *   B返回A页面传递参数
 *  在page生命周期函数中 onUnload () {
 *  获取活跃的页面对象  getCurrentPages()  获取页面对象 在调用页面对象的方法  修改A页面的data中的数据实现传参
 * }
 * 
 * 
 * 
 * 使用代码进行跳转
 *  wx.navigateTo({
 *    url: ''
 * })
 * 使用代码进行返回
 *  wx.navigateBack({
 *    delta: 1   返回的层级
 * })
 * 
 * 
 * 
 * 
 * 项目目录和结构划分
 *  pages
 *  components
 *  assets
 *  service
 *  utils
 *  app.js
 *  app.json
 *  app.wxss
 * 
 * 
 * 页面结构划分：一般根据tabbar进行划分 
 *   
 * 
 * 
 * 获取一个组件距离可滚动区域的顶部的距离（非可视页面顶部，是文档流第一个元素的距离）
 *  wx.createSelectQuery().select('组件的.class|| #id').bounding(rect => {
 *    console.log(rect)
 *  }).exec()必须写这个函数
 * 不能再onShow生命周期中获取，因为这个时刻的组件加载完，但不代表图片，数据加载完全，异步的数据。
 * 最好是判断数据，图片加载完全在调用获取方法
 *  
 * */   

