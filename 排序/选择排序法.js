let unOrder = [10, 5, 3, 2, 1, 4, 12, 6, 7, 8, 9]
for (let i = 0; i < 100000; i++) {
  unOrder.push(Math.random())
}
var swap = function (array, index1, index2){
  var aux = array[index1];
  array[index1] = array[index2];
  array[index2] = aux;
}
function chooseSort(array) {
  var length = array.length
  var indexMin;
  for (var i = 0;i < length -1;i++) {
    indexMin = i;
    for (var j = i;j < length;j++) {
      if (array[indexMin] > array[j]) {
        indexMin = j;
      }
    }
    if (i !== indexMin) {
      swap(array, i, indexMin);
    }
  }
  return array;
}
let start = new Date().getTime()
let order = chooseSort(unOrder)
let end = new Date().getTime()
console.log('选择排序法所用时间：' + (end-start))