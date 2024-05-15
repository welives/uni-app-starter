import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [".DS_Store", "**/.DS_Store/**", "node_modules", "**/node_modules/**", "dist", "**/dist/**", ".idea", "**/.idea/**", ".vscode", "**/.vscode/**"],
  formatters: true,
  typescript: true,
  vue: {
    overrides: {
      'vue/component-name-in-template-casing': ['off'],
    }
  }
})
