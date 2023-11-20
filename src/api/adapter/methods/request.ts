// @ts-expect-error
import settle from 'axios/unsafe/core/settle'
import { AxiosError, AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { resolveUniAppRequestOptions } from '../utils'
import type { AdapterMethod } from '../types'
import Canceled from './cancel'

const request: AdapterMethod = (config) => {
  const requestOptions = resolveUniAppRequestOptions(config)
  const responseConfig = config as InternalAxiosRequestConfig
  responseConfig.headers = new AxiosHeaders(requestOptions.header)
  const onCancel = new Canceled(config)
  return new Promise((resolve, reject) => {
    const success = (result: UniApp.RequestSuccessCallbackResult) => {
      if (!task) return
      const headers = new AxiosHeaders(result.header)
      const response = {
        config: responseConfig,
        headers,
        data: result.data,
        status: result.statusCode,
        statusText: result.errMsg ?? 'OK',
        request: task,
        cookies: result.cookies,
      }
      settle(resolve, reject, response)
    }
    const fail = (error: UniApp.GeneralCallbackResult) => {
      const { errMsg = '' } = error ?? {}
      if (errMsg) {
        const isTimeoutError = errMsg === 'request:fail timeout'
        const isNetworkError = errMsg === 'request:fail'
        if (isTimeoutError) reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task))
        if (isNetworkError) reject(new AxiosError(errMsg, AxiosError.ERR_NETWORK, responseConfig, task))
      }
      reject(new AxiosError(error.errMsg, undefined, responseConfig, task))
    }
    let task: UniApp.RequestTask | null = uni.request({
      ...requestOptions,
      success,
      fail,
      complete() {
        onCancel.unsubscribe()
        task = null
      },
    })
    if (typeof config.onHeadersReceived === 'function') task.onHeadersReceived(config.onHeadersReceived)
    onCancel.subscribe(task, reject)
  })
}
export default request
