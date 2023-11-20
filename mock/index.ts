import type { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: '/api/login',
    method: 'post',
    response: () => {
      return {
        code: '200',
        message: 'ok',
        data: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjMyODU2LCJzZXNzaW9uIjoiOTRlZTZjOThmMmY4NzgzMWUzNzRmZTBiMzJkYTIwMGMifQ.z5Llnhe4muNsanXQSV-p1DJ-89SADVE-zIkHpM0uoQs',
        success: true,
      }
    },
  },
  {
    url: '/api/user',
    method: 'get',
    response: () => {
      return {
        code: '200',
        message: 'ok',
        data: { id: 1, name: 'jandan' },
        success: true,
      }
    },
  },
] as MockMethod[]
