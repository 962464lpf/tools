let unOrder = [10, 5, 3, 2, 1, 4, 12, 6, 7, 8, 9]
for (let i = 0; i < 100000; i++) {
  unOrder.push(Math.random())
}
function Merger(a, b) {
  // left
  var n = a && a.length;
  // right
  var m = b && b.length;
  var c = [];
  // a的第i位
  var i = 0
  // b的第i位
  var j = 0;

  // 循环传进来的数组，把较小的数添加到c中
  while (i < n && j < m) {
    if (a[i] < b[j])
      c.push(a[i++]);
    else
      c.push(b[j++]);
  }

  // 把没有放进去的数据加进去
  while (i < n)
    c.push(a[i++]);

  while (j < m)
    c.push(b[j++]);

  return c;
}
function merge_sort(arr) {
  if (arr.length == 1) {
    return arr
  }

  var mid = Math.floor(arr.length / 2)
  var left = arr.slice(0, mid)
  var right = arr.slice(mid)

  return Merger(merge_sort(left), merge_sort(right)); //合并左右部分
}

let start = new Date().getTime()
let order = merge_sort(unOrder)
let end = new Date().getTime()
console.log('归并排序法所用时间：' + (end-start))

/**
 * left 10 5 3 2 1 
 *   left 10 5 
 *     left  10 
 *     right 5 
 *   (left 5 10)
 *   right 3 2 1 
 *     left 3
 *     right 2 1
 *       left 2 
 *       right 1
 *     (right 1 2)
 *   (right 1 2 3)
 * (left 1 2 3 5 10)
 * right 4 12 6 7 8
 *   left 4 12
 *     left 4
 *     right 12
 *   (left 4 12)
 *   right 6 7 8
 *     left 6
 *     right 7 8
 *       left 7 
 *       right 8
 *     (right 7 8)
 *   (right 6 7 8)
 * (right 4 6 7 8 12)
 * 
 * result:
 *    left: 1 2 3 5 10              i =  1 2 3  4     5
 *    right: 4 6 7 8 12             j =        1 2 3 4 
 *  1 2 3 4 5 6 7 8 10 12
 * 
 *    
 */