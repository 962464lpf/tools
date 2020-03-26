let unOrder = [10, 5, 3, 2, 1, 4, 12, 6, 7, 8, 9]
for (let i = 0; i < 100000; i++) {
  unOrder.push(Math.random())
}
function insertSort(list) {
  for (var i = 1; i < list.length; i++) {
    var j = i;
    var temp = list[i];
    while (j > 0 && list[j - 1] > temp) {
      list[j] = list[j - 1];
      j--;
    }
    list[j] = temp;
  }
  return list
}
let start = new Date().getTime()
let order = insertSort(unOrder)
let end = new Date().getTime()
console.log('插入排序法所用时间：' + (end-start))