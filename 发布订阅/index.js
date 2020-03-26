/**
 * 简单的发布订阅实现
 * 
 */
class Dingyue {
    constructor() {
            this.dingyueArr = []
        }
        // 添加一个订阅者（订阅者是一个处理消息的方法）
    addChangeListener(fun) {
        // 判断订阅者是否已经cunza
        let isExist = this.dingyueArr.some(item => {
            return item === fun
        })
        if (!isExist) {
            // 将所有的订阅者存放到一个数组中，用于发布消息
            this.dingyueArr.push(fun)
        }
    }

    // 移除某一个订阅者
    removeChangeListener(fun) {
            for (let i = 0; i < this.dingyueArr.length; i++) {
                if (this.dingyueArr[i] === fun) {
                    this.dingyueArr.splice(i, 1)
                }
            }
        }
        // 给所有的订阅者发布消息
    emit(msg) {
        for (let i = 0; i < this.dingyueArr.length; i++) {
            this.dingyueArr[i](msg)
        }
    }
}

// 订阅者1
function renyuan1(msg) {
    console.log('人员1接收到' + msg)
}

// 订阅者2
function renyuan2(msg) {
    console.log('人员2接收到' + msg)
}
let dingyue = new Dingyue()
dingyue.addChangeListener(renyuan1)
dingyue.addChangeListener(renyuan2)
let i = 0
let timerId = setInterval(() => {
    let msg = `第${i++}次发布消息`
    dingyue.emit(msg)
    if (i === 10) {
        dingyue.removeChangeListener(renyuan2)
    }
}, 1000)