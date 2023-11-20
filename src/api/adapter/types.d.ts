import type { AxiosPromise, AxiosRequestConfig } from 'axios'
// 扩展 axios 的类型
declare module 'axios' {
  interface AxiosRequestConfig
    extends Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete' | 'header'>,
      Omit<UniApp.UploadFileOption, 'success' | 'fail' | 'complete' | 'header' | 'formData'>,
      Omit<UniApp.DownloadFileOption, 'success' | 'fail' | 'complete' | 'header'>,
      Partial<Pick<UniApp.RequestTask, 'onHeadersReceived'>> {}
  interface AxiosResponse {
    cookies?: string[]
  }
  interface Axios {
    upload<T = any, R = AxiosResponse<T>, D = any>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<R>
    download<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
  }
}

export interface AdapterMethod {
  (config: AxiosRequestConfig): AxiosPromise
}
export type UniNetworkRequestWithoutCallback =
  | Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete'>
  | Omit<UniApp.DownloadFileOption, 'success' | 'fail' | 'complete'>
  | Omit<UniApp.UploadFileOption, 'success' | 'fail' | 'complete'>
