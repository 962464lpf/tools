let unOrder = [10, 5, 3, 2, 1, 4, 12, 6, 7, 8, 9]
// for (let i = 0; i < 100000; i++) {
//   unOrder.push(Math.random())
// }
function quickSort(arr) {
    arr = arr.concat();
    if (arr.length <= 1) {
        return arr
    }
    let left = [], right = [];
    let basis = arr.splice(0, 1);
    arr.forEach(function (v) {
        if (v < basis) {
            left.push(v)
        } else {
            right.push(v)
        }
    });
    return quickSort(left).concat(basis, quickSort(right))
}

let start = new Date().getTime()
let order = quickSort(unOrder)
let end = new Date().getTime()
console.log('快速排序法所用时间：' + (end - start))



function quickSort2(arr) {
    return arr.length <= 1 ? arr : quickSort2(arr.slice(1).filter(v => v < arr[0])).concat(arr[0], quickSort2(arr.slice(1).filter(v => v >= arr[0])))
}
let order2 = quickSort2(unOrder)
console.log(order2)

