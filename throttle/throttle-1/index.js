function debounce(func, wait, options) {
  var timerId, // 定时器 ID
    lastThis, // 缓存的上一个 this
    lastArgs, // 缓存的上一个 arguments
    lastCallTime, // 缓存的上一个 执行 debounced 的时间
    lastInvokeTime = 0, // 缓存的上一个 执行 invokeFunc 的时间
    maxWait,
    maxing = false,
    /** 常量的缓存 */
    FUNC_ERROR_TEXT = 'Expected a function',
    /** 辅助函数的缓存 */
    now = Date.now,
    nativeMax = Math.max,
    nativeMin = Math.min

  formatArgs()
  return debounced

  // 检验并格式化入参
  function formatArgs() {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT)
    }

    wait = +wait || 0
    if (isObject(options)) {
      maxing = 'maxWait' in options
      maxWait = maxing ? nativeMax(+options.maxWait || 0, wait) : maxWait
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

  // setTimeout 定时器的回调函数
  function timeExpired() {
    var time = now(),
      canInvoke = shouldInvoke(time)

    if (canInvoke) {
      return invokeFunc(time)
    }

    var realWait = remainingWait(time)
    timerId = startTimer(realWait)

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
    timerId = undefined
    var args = lastArgs,
      thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time // 更新 lastInvokeTime
    func.apply(thisArg, args)
  }

  // 设置一个 Timer
  function startTimer(time) {
    return setTimeout(timeExpired, time)
  }

  // 要返回的包装 debounce 操作的函数
  function debounced() {
    var time = now(),
      isInvoking = shouldInvoke(time)

    lastThis = this
    lastArgs = arguments
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        lastInvokeTime = time
        timerId = startTimer(wait)
      } else {
        if (maxing) {
          clearTimeout(timerId)
          // Handle invocations in a tight loop.
          timerId = startTimer(wait)
          return invokeFunc(lastCallTime)
        }
      }
    }

    if (timerId === undefined) {
      timerId = startTimer(wait)
    }
  }
}

function throttle(func, wait) {
  return debounce(func, wait, {
    maxWait: wait
  })
}
