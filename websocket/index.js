// WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。
// WebSocket能更好的节省服务器资源和带宽，并且能够实时地进行通讯。

// 在项目中使用技巧，在初始化时进行websocket的连接，将接收到的数据保存到一个全局变量中。
// 以后只需要维护这一个全局变量。

// WebSocket实现方法：
let socket;
// 重连是的定时器id
let t;
// 重连的最大次数
let MAX = 1000;
// 当前是第几次重连
let count = 0;

// websocket连接主函數
function WebSocketTest() {
    // 首先判断浏览器是否支持websocket
    if ('WebSocket' in window) {
        alert('您的浏览器支持 WebSocket!')
        connectWs()
    } else {
        // 浏览器不支持 WebSocket
        alert('您的浏览器不支持 WebSocket!')
    }
}

// 连接到websocket
function connectWs() {
    // 服务地址
    let url = 'ws://121.40.165.18:8800'
    try {
        socket = new WebSocket(url)
    } catch (e) {
        webSocket = new MozWebSocket(url)
    }

    // websocket中的已连接，接收到消息，连接关闭，错误连接的事件
    socket.onopen = onopen
    socket.onmessage = onmessage
    socket.onclose = onclose
    socket.onerror = onerror
}

function onopen() {
    // Web Socket 已连接上，使用 send() 方法发送数据
    // ws.send('发送数据')
    // alert('数据发送中...')
    console.log('websocket已连接')
}

// 连接成功，接收到服务端发送的数据
function onmessage(evt) {
    let received_msg = evt.data
    console.log('接收到数据，进行处理')
    console.log(received_msg)
    document.body.innerHTML = received_msg
}

function onclose() {
    // 关闭 websocket
    console.log('连接已关闭...')
    reconnection()
}

function onerror() {
    console.log('连接到websocket出现错误')
    reconnection()
}

// 在连接失败的情况下，选择性的重连
function reconnection() {
    count = count + 1;
    console.log('reconnection...【' + count + '】');
    // 1 与服务器已经建立连接
    if (count >= MAX || socket.readyState === 1) {
        clearTimeout(t);
    } else {
        // 3已经关闭了与服务器的连接
        if (socket.readyState === 3) {
            connectWs();
        }
        // 0正尝试与服务器建立连接,2正在关闭与服务器的连接
        t = setTimeout(function() {
            reconnection();
        }, 100);
    }
}