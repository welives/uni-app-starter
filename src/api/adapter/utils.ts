// @ts-expect-error
import buildURL from 'axios/unsafe/helpers/buildURL'
// @ts-expect-error
import buildFullPath from 'axios/unsafe/core/buildFullPath'
// @ts-expect-error ignore
import speedometer from 'axios/unsafe/helpers/speedometer'
import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { AxiosHeaders } from 'axios'
import type { UniNetworkRequestWithoutCallback } from './types'

interface AnyObj {
  [key: string]: any
}

type UniProgressResult = UniApp.OnProgressDownloadResult | UniApp.OnProgressUpdateResult

/**
 * @description 返回可选值存在的配置
 */
function mergeKeys(keys: string[], configObj: AnyObj) {
  let config: AnyObj = {}
  keys.forEach((key) => {
    if (typeof key !== 'undefined') {
      config[key] = configObj[key]
    }
  })
  return config
}

/**
 * @description 整理 uniapp 的请求参数
 */
export function resolveUniAppRequestOptions(config: AxiosRequestConfig): UniNetworkRequestWithoutCallback {
  const responseType = config.responseType === 'arraybuffer' ? 'arraybuffer' : 'text'
  const dataType = responseType === 'text' ? 'json' : void 0
  const { headers, baseURL, data, ...restConfig } = config
  // 格式化一下
  const requestHeaders = AxiosHeaders.from(headers as any).normalize(false)
  if (config.auth) {
    const username = config.auth.username || ''
    const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : ''
    requestHeaders.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`)
  }
  // 拼接完整URL
  const fullPath = buildFullPath(baseURL, config.url)
  const method = (config.method?.toUpperCase() ?? 'GET') as unknown as any
  // 拼接参数
  const url = buildURL(fullPath, config.params, config.paramsSerializer)
  const timeout = config.timeout || 60000
  // 上传相关
  let uploadData: AnyObj = {}
  if (method === 'UPLOAD' && data && typeof data === 'string') {
    const optionalKeys = [
      // #ifdef APP-PLUS || H5
      'files',
      // #endif
      // #ifdef MP-ALIPAY
      'fileType',
      // #endif
      // #ifdef H5
      'file',
      // #endif
      'filePath',
      'name',
    ]
    const parsed = JSON.parse(data)
    const formData: AnyObj = {}
    if (parsed !== null && typeof parsed === 'object') {
      uploadData = mergeKeys(optionalKeys, parsed)
      for (const [key, value] of Object.entries(parsed)) {
        if (!optionalKeys.includes(key)) {
          formData[key] = value
        }
      }
      if (Object.keys(uploadData).filter((k) => uploadData[k]).length === 0) {
        throw new Error('上传对象不能为空')
      }
      uploadData['formData'] = formData
    }
  }

  return {
    ...restConfig,
    url,
    header: requestHeaders.toJSON(), // uni-app要求header是一个plainObject,所以转成json对象
    method,
    responseType,
    dataType,
    timeout,
    ...(method === 'UPLOAD' ? uploadData : { data }),
  }
}

/**
 * @description 进度变化处理
 * @see https://github.com/axios/axios/blob/7d45ab2e2ad6e59f5475e39afd4b286b1f393fc0/lib/adapters/xhr.js#L17-L44
 */
export function progressEventReducer(listener: (progressEvent: AxiosProgressEvent) => void, isDownloadStream: boolean) {
  let bytesNotified = 0
  const _speedometer = speedometer(50, 250)

  return (result: UniProgressResult) => {
    // @ts-expect-error
    const loaded = isDownloadStream ? result.totalBytesWritten : result.totalBytesSent
    // @ts-expect-error
    const total = isDownloadStream ? result.totalBytesExpectedToWrite : result.totalBytesExpectedToSend
    const progressBytes = loaded - bytesNotified
    const rate = _speedometer(progressBytes)
    const inRange = loaded <= total

    bytesNotified = loaded

    const data: AxiosProgressEvent = {
      loaded,
      total,
      progress: total ? loaded / total : undefined,
      bytes: progressBytes,
      rate: rate || undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: result,
    }
    data[isDownloadStream ? 'download' : 'upload'] = true
    listener(data)
  }
}
