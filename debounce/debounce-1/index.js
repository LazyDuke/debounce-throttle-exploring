function debounce(func, wait) {
  var timerId, // 定时器 ID
    lastThis, // 缓存的上一个 this
    lastArgs, // 缓存的上一个 arguments
    /** 常量的缓存 */
    FUNC_ERROR_TEXT = 'Expected a function'

  formatArgs()
  return debounced

  // 检验并格式化入参
  function formatArgs() {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT)
    }

    wait = +wait || 0
  }

  // setTimeout 定时器的回调函数
  function timeExpired() {
    return invokeFunc()
  }

  // 触发函数 func
  function invokeFunc() {
    var args = lastArgs,
      thisArg = lastThis
    lastArgs = lastThis = undefined
    func.apply(thisArg, args)
  }

  // 设置一个 Timer
  function startTimer(time) {
    return setTimeout(timeExpired, time)
  }

  // 要返回的包装 debounce 操作的函数
  function debounced() {
    lastThis = this
    lastArgs = arguments

    clearTimeout(timerId)
    timerId = startTimer(wait)
  }
}
