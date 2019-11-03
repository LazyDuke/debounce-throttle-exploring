function debounce(func, wait) {
  var timerId, // 定时器 ID
    lastThis, // 缓存的上一个 this
    lastArgs, // 缓存的上一个 arguments
    lastCallTime, // 缓存的上一个 执行 debounced 的时间
    /** 常量的缓存 */
    FUNC_ERROR_TEXT = 'Expected a function',
    /**辅助函数的缓存 */
    now = Date.now

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
    var time = now(),
      canInvoke = shouldInvoke(time)

    if (canInvoke) {
      return invokeFunc()
    }

    var realWait = remainingWait(time)
    timerId = startTimer(realWait)

    // 计算真正延迟触发的时间
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
        timeWaiting = wait - timeSinceLastCall

      return timeWaiting
    }
  }

  // 判断是否要调用 func
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0
    )
  }

  // 触发函数 func
  function invokeFunc() {
    timerId = undefined
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
    var time = now()
    lastThis = this
    lastArgs = arguments
    lastCallTime = time

    if (timerId === undefined) {
      timerId = startTimer(timeExpired, wait)
    }
  }
}
