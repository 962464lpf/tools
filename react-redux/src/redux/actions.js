const addBeforeNameAction = (name) => ({
  type: 'before',
  data: name
})

const addAfterNameAction = (name) => ({
  type: 'after',
  data: name
})

export {
  addAfterNameAction,
  addBeforeNameAction
}