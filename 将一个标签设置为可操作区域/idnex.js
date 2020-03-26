// 1.设置标签的属性

// <div> contenteditable = "true" < /div></div >

// 2.获取光标的位置， 点击标签，和鼠标离开时
function getCursorPosition(element) {
    let caretOffset = 0
    const doc = element.ownerDocument || element.document
    const win = doc.defaultView || doc.parentWindow
    const sel = win.getSelection()
    if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        caretOffset = preCaretRange.toString().length
    }
    return caretOffset
}
// 3.设置光标位置
function setCursorPosition(element, cursorPosition) {
    const range = document.createRange()
    range.setStart(element.firstChild, cursorPosition)
    range.setEnd(element.firstChild, cursorPosition)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
}
// 4.给光标处添加内容
function setText() {
    const text = editor.innerHTML
    editor.innerHTML = text.slice(0, this.cursorPosition) + 'emoji' + text.slice(this.cursorPosition, text.length)
    setCursorPosition(this.editor, this.cursorPosition + 1)
    cursorPosition = getCursorPosition(editor) + 1
}