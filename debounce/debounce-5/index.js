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
  // 设置一个 Timer
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
    // 重新启动计时器
    timerId = startTimer(realwait)

    // 计算真正延迟触发的时间
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, // debounced 上次触发到现在的经历的时间
        timeSinceLastInvoke = time - lastInvokeTime, // invokeFunc 上次触发到现在的经历的时间
        timeWaiting = wait - timeSinceLastCall // 真正还需等待触发的时间
      // 如果用户设置了最长等待时间，则需要取最小值
      return maxing
        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting
    }
  }

  // 判断是否要调用 func
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, // debounced 上次触发到现在的经历的时间
      timeSinceLastInvoke = time - lastInvokeTime // invokeFunc 上次触发到现在的经历的时间

    return (
      lastCallTime === undefined || // 如果是第一次调用，则一定允许
      timeSinceLastCall >= wait || // 等待时间超过设置的时间
      timeSinceLastCall < 0 || // 当前时刻早于上次事件触发时间，比如说调整了系统时间
      (maxing && timeSinceLastInvoke >= maxWait) // 等待时间超过最大等待时间
    )
  }

  // 触发函数 func
  function invokeFunc(time) {
    var args = lastArgs,
      thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time // 更新 lastInvokeTime

    result = func.apply(thisArg, args)
    return result
  }

  // 前置触发 func 的边界函数
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  // 后置触发 func 的边界函数
  function trailingEdge(time) {
    timerId = undefined

    // 只有当事件至少发生过一次且配置了末端触发才调用真正的事件处理程序，
    // 意思是如果程序设置了末端触发，且没有设置最大等待时间，
    // 但是事件自始至终只触发了一次，则真正的事件处理程序永远不会执行
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
        // Handle invocations in a tight loop.
        timerId = startTimer(wait)
        return invokeFunc(lastCallTime)
      }
    }
    // 负责一种case：trailing 为 true 的情况下，在前一个 wait 的 trailingEdge 已经执行了函数；
    // 而这次函数被调用时 shouldInvoke 不满足条件，因此要设置定时器，在本次的 trailingEdge 保证函数被执行
    if (timerId === undefined) {
      timerId = startTimer(wait)
    }
    return result
  }
}
