let unOrder = [10, 5, 3, 2, 1, 4, 12, 6, 7, 8, 9]
for (let i = 0; i < 100000; i++) {
  unOrder.push(Math.random())
}
function sort(arr) {
  var len = arr.length;
  for (var i = 0; i < len-1; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
         // 相邻元素两两对比，元素交换，大的元素交换到后面
        if (arr[j] > arr[j + 1]) {
            var temp = arr[j];
            arr[j] = arr[j+1];
            arr[j+1] = temp;
        }
    }
  }
  return arr;
}
let start = new Date().getTime()
let order = sort(unOrder)
let end = new Date().getTime()
console.log('冒泡排序法所用时间：' + (end-start))