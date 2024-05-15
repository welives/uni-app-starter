import { parse, stringify } from 'qs'
import { useUserStore } from '../stores'
import { utils } from '../libs'

interface AnyObj {
  [key: string]: any
}
type RouterType = 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | 'navigateBack'
type UniAnimationType = Pick<UniApp.NavigateToOptions, 'animationType'> &
  Pick<UniApp.NavigateBackOptions, 'animationType'>
interface UniRouterOptions<S = any>
  extends Omit<UniApp.NavigateToOptions, 'success' | 'fail' | 'complete' | 'animationType'>,
  Omit<UniApp.NavigateBackOptions, 'success' | 'fail' | 'complete' | 'animationType'>,
  Omit<UniApp.RedirectToOptions, 'success' | 'fail' | 'complete'>,
  Omit<UniApp.ReLaunchOptions, 'success' | 'fail' | 'complete'>,
  Omit<UniApp.SwitchTabOptions, 'success' | 'fail' | 'complete'>,
  UniAnimationType {
  data?: string | AnyObj
  success?: (result: S) => void
  fail?: (result: any) => void
  complete?: (result: any) => void
}

function searchParams2Obj(params: any) {
  const searchParams = parse(params)
  const obj: AnyObj = {}
  for (const [key, value] of Object.entries(searchParams))
    obj[key] = value

  return obj
}

/**
 * 检查权限
 */
function authCheck(urlKey: string, type: RouterType, options: UniRouterOptions) {
  const isLogged = useUserStore().isLogged
  if (authRoutes.includes(urlKey)) {
    if (!isLogged) {
      // TODO 补充自己的业务逻辑
      return
    }
    navigate(type, options)
  }
  else {
    navigate(type, options)
  }
}
/**
 * 执行路由跳转
 */
function navigate(type: RouterType, options: UniRouterOptions) {
  const { data, ...rest } = options
  if (!['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'].includes(type))
    return
  if (!rest.url.startsWith('/'))
    rest.url = `/${rest.url}`

  // @ts-expect-error
  uni[type](rest)
}

const singletonEnforcer = Symbol('Router')
class Router {
  private static _instance: Router
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer)
      throw new Error('Cannot initialize single instance')
  }

  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    this._instance || (this._instance = new Router(singletonEnforcer))
    return this._instance
  }

  /**
   * 路由中间件,做跳转前的代理
   */
  private middleware(type: RouterType, options: UniRouterOptions) {
    let { url = '', data = {}, events, ...rest } = options
    let [urlKey, queryStr] = url.split('?')
    // 单独存一份url,待会要用
    urlKey = urlKey
      .split('/')
      .filter(e => e !== '')
      .join('/')
    try {
      if (type === 'navigateBack') {
        uni.navigateBack(rest)
      }
      else {
        if (!urlKey.trim() || !routes.includes(urlKey))
          throw new Error('无效的路由')

        if (type === 'switchTab') {
          url = urlKey
        }
        else {
          if (data && typeof data === 'string' && data.trim())
            data = searchParams2Obj(data)

          let obj: AnyObj = {}
          if (queryStr && queryStr.trim())
            obj = searchParams2Obj(queryStr)

          const str = stringify(utils.merge(data as object, obj))
          url = str ? `${urlKey}?${str}` : urlKey
        }
        authCheck(urlKey, type, { ...rest, url, events })
      }
    }
    catch (error: any) {
      // TODO
      console.error(error.message)
    }
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
  switchTab(options: UniRouterOptions) {
    this.middleware('switchTab', options)
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  reLaunch(options: UniRouterOptions) {
    this.middleware('reLaunch', options)
  }

  /**
   * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
   */
  redirectTo(options: UniRouterOptions) {
    this.middleware('redirectTo', options)
  }

  /**
   * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
   */
  navigateTo(options: UniRouterOptions<UniApp.NavigateToSuccessOptions>) {
    this.middleware('navigateTo', options)
  }

  /**
   * 关闭当前页面，返回上一页面或多级页面
   */
  navigateBack(options: Omit<UniRouterOptions, 'url'>) {
    this.middleware('navigateBack', { url: '', ...options })
  }
}
// 需要权限的路由,注意首尾不能带有斜杠
const authRoutes = ['pages/home/index', 'pages/profile/index']
// 全部路由
const routes = ['pages/blank/index', 'pages/index/index', 'pages/home/index', 'pages/profile/index']
export default Router.instance
