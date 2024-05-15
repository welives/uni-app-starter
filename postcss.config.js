const { WeappTailwindcssDisabled } = require('./platform')

module.exports = {
  plugins: [
    require('tailwindcss')(),
    require('autoprefixer')(),
    require('postcss-rem-to-responsive-pixel')({
      rootValue: 32, // 1rem = 32rpx
      propList: ['*'], // 默认所有属性都转化
      transformUnit: 'rpx', // 转化的单位,可以变成 px / rpx
      disabled: WeappTailwindcssDisabled, // v6版本新增的参数,用来禁止插件的转化
    }),
    require('weapp-tailwindcss/css-macro/postcss'),
  ],
}
