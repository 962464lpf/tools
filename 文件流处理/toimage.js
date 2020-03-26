// 后端返回的是一个文件流，将流转换成对象的URL
// let url = wimdow.URL.createObjectURL(object)
// object为File对象（input  type = file），Blob对象。文件是特殊的二进制对象
// 返回值该对象的URL

// 获取文件流
axios.get(url, {
  params,
  responseType: 'arraybuffer'
})

// 转化
let blob = new Blob([res.data], { type: 'image/jpeg' })
url = window.URL.createObjectURL(blob)

// 遇到的难点。根据表格数据中的图片id请求图片，将文件流转化成的URL添加到表格数据中。
// 难点 1.请求图片异步操作，不能直接返回处理后的URL 2. 渲染数据,表格数据添加URL字段，并不能直接触发渲染

// 请求表格数据
function getListData () {
  Get('mec/developer/v1/projects').then(res => {
    let data = res.data
    let len = data.length
    let i = 0
    data.forEach((item, index) => {
      // 根据表格数据请求图片信息
      this.getIcon(item).then(res => {
        i++
        // 将返回的图片信息添加到表格数据中
        item.url = res
        // 所有图片信息都请求到数据，触发表格数据，触发渲染机制
        if (i === len) {
          this.tableData = data
        }
      })
    })
  })
}
// 请求图片信息
async function getIcon (row) {
  let url = ''
  // 得到图片信息，再返回，为异步操作
  await getFile('mec/developer/v1/files/' + row.iconFileId).then(res => {
    try {
      let blob = new Blob([res.data], { type: 'image/jpeg' })
      // 异步操作中不能直接返回，直接返回的结果为[object promise]
      url = window.URL.createObjectURL(blob)
    } catch (error) {
      console.log(error)
    }
  })
  // async 返回的是一个promise对象
  return new Promise(resolve => {
    resolve(url)
  })
}



// 将一个文件转化为base64 file为input中type = file
function fileToBase64 (file) {
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    sessionStorage.setItem('base64', reader.result)
  }
}

// 将一个静态图片转为base64   
// img: var img = new Image()    img.src = file  file为require得到的静态文件资源
function getBase64Image (img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  var dataURL = canvas.toDataURL('image/' + ext)
  sessionStorage.setItem('base64', dataURL)
  return dataURL
}


// 下载文件
// 1. 根据后端的地址就可以下载文件，
  // 创建a标签进行下载
  let url = 'csars/' + this.details.csarId + '/files'
  let link = document.createElement('a')
  link.href = URL_PREFIX + url
  link.click()
  // 创建form表单进行下载
  var form = document.createElement('form')
  document.getElementsByTagName('body')[0].appendChild(form)
  form.setAttribute('style', 'display:none')
  form.setAttribute('target', '')
  form.setAttribute('method', 'get')
  form.setAttribute('action', 'http://159.138.146.114:80/mecapi/appstore/v1/PackageResource/' + url)
  form.submit()



