import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores(['.next/**', 'node_modules/', 'out/**', 'build/**', 'next-env.d.ts', 'eslint.config.mjs', '**/*.css']),
  {
    rules: {
      '@next/next/no-img-element': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
])

export default eslintConfig
