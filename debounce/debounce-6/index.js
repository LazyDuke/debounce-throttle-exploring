function debounce(func, wait, options) {
  var timerId, // 定时器 ID
    lastThis, // 缓存的上一个 this
    lastArgs, // 缓存的上一个 arguments
    lastCallTime, // 缓存的上一个 执行 debounced 的时间
    lastInvokeTime = 0, // 缓存的上一个 执行 invokeFunc 的时间
    maxWait,
    maxing = false,
    leading = false,
    trailing = true,
    result,
    /** 常量的缓存 */
    FUNC_ERROR_TEXT = 'Expected a function',
    /** 辅助函数的缓存 */
    now = Date.now,
    nativeMax = Math.max,
    nativeMin = Math.min

  formatArgs()

  debounced.cancel = cancel
  debounced.flush = flush
  return debounced

  // 校验并格式化入参
  function formatArgs() {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT)
    }

    wait = +wait || 0
    if (isObject(options)) {
      maxing = 'maxWait' in options
      maxWait = maxing ? nativeMax(+options.maxWait || 0, wait) : maxWait
      leading = !!options.leading
      trailing = 'trailing' in options ? !!options.trailing : trailing
    }

    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value
      // 确保 value 是 truthy 的值
      // 保证 type 值为 'object'（包括Array等...）或者 'function'
      return !!value && (type == 'object' || type == 'function')
    }
  }

  function startTimer(time) {
    return setTimeout(timeExpired, time)
  }

  // setTimeout 定时器的回调函数
  function timeExpired() {
    var time = now(),
      canInvoke = shouldInvoke(time)

    if (canInvoke) {
      return trailingEdge(time)
    }

    var realwait = remainingWait(time)
    timerId = startTimer(realwait)

    // 计算真正延迟触发的时间
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall

      return maxing
        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting
    }
  }

  // 判断是否要调用 func
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  // 触发函数 func
  function invokeFunc(time) {
    var args = lastArgs,
      thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time

    result = func.apply(thisArg, args)
    return result
  }

  // 前置触发 func 的边界函数
  function leadingEdge(time) {
    lastInvokeTime = time
    timerId = startTimer(wait)

    return leading ? invokeFunc(time) : result
  }

  // 后置触发 func 的边界函数
  function trailingEdge(time) {
    timerId = undefined

    if (trailing && lastArgs) {
      return invokeFunc(time)
    }

    lastArgs = lastThis = undefined
    return result
  }

  // 要返回的包装 debounce 操作的函数
  function debounced() {
    var time = now(),
      isInvoking = shouldInvoke(time)

    lastArgs = arguments
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        clearTimeout(timerId)
        timerId = startTimer(wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(wait)
    }
    return result
  }

  // 取消 debounce 函数
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  // 取消并立即执行一次 debounce 函数
  function flush() {
    return timerId === undefined ? result : trailingEdge(now())
  }
}
