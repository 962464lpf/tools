(function () {
    window.Lock = function (obj) {
        this.height = obj.height || 300
        this.width = obj.width || 300
        this.chooseType= obj.chooseType || 3
        this.parentDom = obj.dom
        this.title = '请绘制密码'
        // 所有的圆
        this.circleArr = []
        // 鼠标未经过的圆
        this.restCircle = []
        // 鼠标经过的圆
        this.lastPoint = []
    }

    Lock.prototype.init = function () {
        // 创建标题，canvas,Dom
        this.createTileBgDom()
        this.createCanvas()
        // canvas画圈
        this.carateCircle()
        // 绑定事件
        this.bindEvent()
    }

    Lock.prototype.createTileBgDom = function () {
        let title = `<h4 style="line-height: 32px; font-weight: 100" id="title">${this.title}</h4>`
        this.parentDom.innerHTML = title
        let canvas = document.createElement('canvas')
        canvas.setAttribute('width',this.width);
        canvas.setAttribute('height',this.height - 32);
        canvas.setAttribute('id', 'canvas')
        this.parentDom.appendChild(canvas)
    }

    Lock.prototype.createCanvas = function () {
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')
    }

    Lock.prototype.carateCircle = function () {
        this.r = this.width / (this.chooseType * 4 + 2)
        let r = this.r
        let count = 0
        this.ctx.strokeStyle = 'white'
        this.circleArr = [];			//所有的圆
        this.restCircle = [];	//未经过剩余的圆
        // 行
        for(let i = 0; i < this.chooseType; i++) {
            // 列
            for (let j = 0; j < this.chooseType; j++) {
                count++
                let obj = {}
                obj.x = j *4 * r + 3 * r
                obj.y = i * 4 * r + 3 * r
                obj.count = count
                this.circleArr.push(obj)
                this.restCircle.push(obj)
            }
        }
        for(let k = 0; k < this.circleArr.length; k++) {
            this.ctx.lineWidth = 1;
            this.ctx.beginPath()
            this.ctx.arc(this.circleArr[k].x, this.circleArr[k].y, r, 0, 2 * Math.PI)
            this.ctx.stroke()
        }
    }

    Lock.prototype.bindEvent = function () {
        let self = this
        this.mouseDown = false
        this.canvas.addEventListener('mousedown', function (e) {
            // 获取鼠标按下的位置
            self.getMousePoint(e)
            // 判断鼠标位置是否在圆内,鼠标未经过的圆
            self.mouseInCricle(self.restCircle)
        }, false)

        this.canvas.addEventListener('mousemove', function (e) {
            if (self.mouseDown) {
                // 获取鼠标按下的位置
                self.getMousePoint(e)
                // 判断鼠标位置是否在圆内,鼠标未经过的圆
                self.mouseInCricle(self.restCircle)
                // 更新canvas
                self.updateCanvas(self.lastPoint,'#CFE6FF');
            }
        }, false)

        this.canvas.addEventListener('mouseup', function (e) {
            if (self.mouseDown) {
                if (self.checkPass()) {
                    title = '解锁成功'
                    document.getElementById('title').innerHTML = title
                } else {
                    title = '解锁失败'
                    document.getElementById('title').innerHTML = title
                }
            }
            setTimeout(function(){
                self.reset()
            },500);
        }, false)
    }

    Lock.prototype.getMousePoint = function (e) {
        this.mouseInCanvas = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop
        }
    }

    Lock.prototype.mouseInCricle = function (arr) {
        for (let i = 0; i < arr.length; i++) {
            let xDis = Math.abs(arr[i].x - this.mouseInCanvas.x)
            let yDis = Math.abs(arr[i].y - this.mouseInCanvas.y)
            if (xDis < this.r && yDis < this.r) {
                this.mouseDown = true
                if (this.arrToHeavy(arr[i])) {
                    this.lastPoint.push(arr[i])
                }
                this.restCircle.splice(i, 1)
                break
            }
        }
    }

    Lock.prototype.arrToHeavy = function(obj) {
        let heavy = true
        if (this.lastPoint.length){
            for(let i = 0; i < this.lastPoint.length; i++) {
                if (obj.count === this.lastPoint[i].count) {
                    heavy = false
                }
            }
        }
        return heavy
    }

    Lock.prototype.updateCanvas = function (arr, style) {
        this.ctx.clearRect(0, 0, this.width, this.height - 32)
        this.carateCircle()
        this.drawPoint(arr, style)
        this.drawLine(arr, style)
    }

    Lock.prototype.drawPoint = function(arr, style) {
        this.ctx.fillStyle = style;
        for(var i=0; i<arr.length; i++){
            this.ctx.beginPath();
            this.ctx.arc( arr[i].x, arr[i].y, this.r/2, 0, Math.PI*2);
            this.ctx.fill();
        }
    }

    Lock.prototype.drawLine = function(arr, style) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#CFE6FF';
        this.ctx.lineWidth = 3;
        this.ctx.moveTo(arr[0].x, arr[0].y);
        for(var i=1; i<arr.length; i++){
            this.ctx.lineTo(arr[i].x, arr[i].y);
        }
        this.ctx.lineTo(this.mouseInCanvas.x, this.mouseInCanvas.y);
        this.ctx.stroke();
    }

    Lock.prototype.checkPass = function() {
        let passWord = '123654'
        let userPass = ''
        for (let i = 0; i < this.lastPoint.length; i++) {
            userPass += this.lastPoint[i].count
        }
        return userPass === passWord
    }

    Lock.prototype.reset = function () {
        this.ctx.clearRect(0, 0, this.width, this.height - 32)
        this.lastPoint = [];
        this.carateCircle()
        this.mouseDown = false;
        document.getElementById('title').innerHTML = this.title
    }
})()
