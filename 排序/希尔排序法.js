let unOrder = [10, 5, 3, 2, 1, 4, 12, 6, 7, 8, 9]
for (let i = 0; i < 1000000; i++) {
  unOrder.push(Math.random())
}
function shellSort(arr) {
  let len = arr.length;
  // gap 即为增量
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 插入排序法
    for (let i = gap; i < len; i++) {
      let j = i;
      let current = arr[i];
      while(j - gap >= 0 && current < arr[j - gap]) {
        arr[j] = arr[j - gap];
        j = j - gap;
      }
      arr[j] = current;
    }
  }
  return arr
}
let start = new Date().getTime()
let order = shellSort(unOrder)
let end = new Date().getTime()
console.log('希尔排序法所用时间：' + (end-start))


