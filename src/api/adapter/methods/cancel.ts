import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { CanceledError } from 'axios'

/**
 * @description 用来代理操作uni-app的requestTask
 */
export default class Canceled<T> {
  private readonly config: AxiosRequestConfig<T>
  private onCanceled?: (cancelEvent?: any) => void
  constructor(config: AxiosRequestConfig<T>) {
    this.config = config
  }
  subscribe(task: any, reject: Function) {
    if (this.config.cancelToken || this.config.signal) {
      // ① ⚡注册取消事件函数, cancelEvent是从axios那里传递过来的
      this.onCanceled = (cancelEvent?: any) => {
        if (!task) return
        // ③ ⚡当axios请求被取消时才会触发这个事件函数
        reject(
          !cancelEvent || cancelEvent.type
            ? new CanceledError(void 0, void 0, this.config as InternalAxiosRequestConfig, task)
            : cancelEvent
        )
        task.abort()
        task = null
      }
      if (this.config.cancelToken) {
        // @ts-expect-error
        this.config.cancelToken?.subscribe(this.onCanceled) // ② ⚡订阅取消事件函数, 底层是保存在cancelToken的 _listeners
      }
      if (this.config.signal && this.config.signal.addEventListener) {
        this.config.signal.aborted ? this.onCanceled() : this.config.signal.addEventListener('abort', this.onCanceled)
      }
    }
  }
  unsubscribe() {
    if (this.config.cancelToken) {
      // @ts-expect-error
      this.config.cancelToken?.unsubscribe(this.onCanceled)
    }
    if (this.config.signal && this.config.signal.removeEventListener) {
      this.config.signal.removeEventListener('abort', this.onCanceled)
    }
  }
}
