// 控制滚动条位置。前提条件页面必须有滚动条
// var t = setInterval(function() {
//     window.scrollBy(0, 10);
//     console.log(document.body.scrollTop);
//     if (document.body.scrollTop || document.documentElement.scrollTop >= 100) {
//         clearInterval(t);
//     }
// }, 1000);


/*
    计时器一直是javascript动画的核心技术。而编写动画循环的关键是要知道延迟时间多长合适。
    一方面，循环间隔必须足够短，这样才能让不同的动画效果显得平滑流畅；
    另一方面，循环间隔还要足够长，这样才能确保浏览器有能力渲染产生的变化

　　大多数电脑显示器的刷新频率是60Hz，大概相当于每秒钟重绘60次。
    大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，
    因为即使超过那个频率用户体验也不会有提升。
    因此，最平滑动画的最佳循环间隔是1000ms/60，约等于16.6ms

　　而setTimeout和setInterval的问题是，它们都不精确。
    它们的内在运行机制决定了时间间隔参数实际上只是指定了
    把动画代码添加到浏览器UI线程队列中以等待执行的时间。
    如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行

　　requestAnimationFrame采用系统时间间隔，（刷新频率是60Hz）
    保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；
    也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，
    从而节省系统资源，提高系统性能，改善视觉效果

    requestAnimationFrame存在兼容性问题，（IE10）如果不支持还是得使用定时器

*/

let one = document.getElementById('one')
let content = document.getElementById('content')
let x = 0
let y = 0
let stepx = 5
let stepy = 2

// 移动一次
function stepMove() {
    x += stepx
    y += stepy
    if (x >= content.offsetWidth - one.offsetWidth || x <= 0) {
        stepx = -1 * stepx;
    }
    if (y >= content.offsetHeight - one.offsetHeight || y <= 0) {
        stepy = -1 * stepy;
    }
    one.style.left = x + 'px'
    one.style.top = y + 'px'
    requestAnimationFrame(stepMove)
}

// 设置时间间隔进行移动
function move() {
    setInterval(stepMove, 50)
}
// move()

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

requestAnimationFrame(stepMove)