import type { AxiosRequestConfig } from 'axios'
import type { AdapterMethod } from '../types'
import request from './request'
import download from './download'
import upload from './upload'

/**
 * @description 获取适配器的请求方法
 */
export function getMethod(config: AxiosRequestConfig): AdapterMethod {
  const { method: rawMethod = 'GET' } = config
  const method = rawMethod.toLocaleLowerCase()
  switch (method) {
    case 'download':
      return download
    case 'upload':
      return upload
    default:
      return request
  }
}
