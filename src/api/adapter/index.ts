import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Axios } from 'axios'
import { getMethod } from './methods'

export { AxiosRequestConfig, AxiosResponse }
/**
 * @description axios适配器的构造器
 */
export function createUniAppAxiosAdapter(): AxiosAdapter {
  if (!uni)
    throw new Error('这个适配器只能在uni-app环境中使用')

  // 通过原型扩展此插件特有的方法
  Axios.prototype.upload = function (url, data, config) {
    return this.request({ ...config, url, data, method: 'upload' })
  }
  Axios.prototype.download = function (url, config) {
    return this.request({ ...config, url, method: 'download' })
  }
  const uniappAdapter = (config: AxiosRequestConfig) => {
    const method = getMethod(config)
    return method(config)
  }
  return uniappAdapter
}
export default createUniAppAxiosAdapter
