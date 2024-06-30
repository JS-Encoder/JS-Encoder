const { from, map } = rxjs

const source = from([1, 2, 3, 4, 5])
const example = source.pipe(map((val) => val + 10))
const subscribe = example.subscribe((val) => console.log(val))