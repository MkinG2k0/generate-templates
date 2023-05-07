import { describe, expect } from 'vitest'
import { Reader } from '../modules/reader-class.js'

describe('Reader class', () => {
  test('Reader isRecursive:true', async () => {
    const reader = new Reader('./src/test/mock/folder', { isRecursive: true })

    const data = await reader.read()

    expect(data).matchSnapshot()
  })

  test('Reader isRecursive:false', async () => {
    const reader = new Reader('./src/test/mock/folder', { isRecursive: false })

    const data = await reader.read()

    expect(data).matchSnapshot()
  })

  test("Reader isRecursive:false path:'./src/test/'", async () => {
    const reader = new Reader('mock/folder', { isRecursive: false, path: './src/test/' })

    const data = await reader.read()

    expect(data).matchSnapshot()
  })
})
