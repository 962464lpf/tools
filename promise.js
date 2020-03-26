

function asyncStep1 () {
	return new Promise(resolve => {
		setTimeout(() => {
		resolve('fsfs')
		}, 2000)
	})
	
}

function asyncStep2 (val) {
	return new Promise(resolve => {
		setTimeout(() => {
		resolve('val + 2')
		}, 2000)
	})
}

async function asyncDemo () {
	console.log('start')
	let val1 = await asyncStep1()
	console.log(val1)
	// let val2 = await asyncStep2(val1)
	//  console.log( val2)
}
// async await 实现方式  await函数返回一个promise
asyncDemo()



