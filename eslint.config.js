import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ["node_modules", "**/node_modules/**", "dist", "**/dist/**"],
  formatters: true,
  typescript: true,
  vue: {
    overrides: {
      'vue/component-name-in-template-casing': ['off'],
    }
  }
})
