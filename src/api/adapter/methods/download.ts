// @ts-expect-error
import settle from 'axios/unsafe/core/settle'
import { AxiosError, AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { AdapterMethod } from '../types'
import { progressEventReducer, resolveUniAppRequestOptions } from '../utils'
import Canceled from './cancel'

const download: AdapterMethod = (config) => {
  const requestOptions = resolveUniAppRequestOptions(config)
  const responseConfig = config as InternalAxiosRequestConfig
  responseConfig.headers = new AxiosHeaders(requestOptions.header)
  const onCancel = new Canceled(config)
  return new Promise((resolve, reject) => {
    const success = (result: UniApp.DownloadSuccessData) => {
      if (!task)
        return
      const response = {
        config: responseConfig,
        data: result.tempFilePath,
        status: result.statusCode,
        statusText: result.errMsg ?? 'OK',
        request: task,
      }
      settle(resolve, reject, response)
    }
    const fail = (error: any) => {
      const { errMsg = '' } = error ?? {}
      if (errMsg) {
        const isTimeoutError = errMsg === 'downloadFile:fail timeout'
        const isNetworkError = errMsg === 'downloadFile:fail'
        if (isTimeoutError)
          reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task))
        if (isNetworkError)
          reject(new AxiosError(errMsg, AxiosError.ERR_NETWORK, responseConfig, task))
      }
      reject(new AxiosError(error.errMsg, undefined, responseConfig, task))
    }
    let task: UniApp.DownloadTask | null = uni.downloadFile({
      ...requestOptions,
      success,
      fail,
      complete() {
        onCancel.unsubscribe()
        task = null
      },
    })
    if (typeof config.onDownloadProgress === 'function')
      task.onProgressUpdate(progressEventReducer(config.onDownloadProgress, true))
    if (typeof config.onHeadersReceived === 'function')
      task.onHeadersReceived(config.onHeadersReceived)
    onCancel.subscribe(task, reject)
  })
}
export default download
