// Run source-level TSX unit tests with the project's existing TypeScript install.
// CSS is intentionally omitted: these tests do not assert browser layout.
import { registerHooks } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.') && context.parentURL) {
      const url = new URL(specifier, context.parentURL)
      for (const extension of ['.ts', '.tsx']) {
        if (existsSync(fileURLToPath(url) + extension)) {
          return next(url.href + extension, context)
        }
      }
    }
    return next(specifier, context)
  },
  load(url, context, next) {
    if (url.endsWith('.css')) return { format: 'module', source: 'export default ""', shortCircuit: true }
    if (/\.tsx?$/.test(url) && !url.includes('/node_modules/')) {
      const source = ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
        fileName: fileURLToPath(url),
        compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      }).outputText
      return { format: 'module', source, shortCircuit: true }
    }
    return next(url, context)
  },
})
