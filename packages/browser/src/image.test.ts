import { describe, expect, test } from 'bun:test'
import { BackgroundRemovalError } from './errors'
import { inspectMask, MAX_IMAGE_BYTES, validateImage } from './image'

describe('validateImage', () => {
  test('accepts supported image formats', () => {
    expect(() =>
      validateImage(new Blob(['image'], { type: 'image/png' })),
    ).not.toThrow()
  })

  test('rejects unsupported formats with a product error', () => {
    expect(() =>
      validateImage(new Blob(['image'], { type: 'image/gif' })),
    ).toThrow(BackgroundRemovalError)
  })

  test('rejects images over the local limit', () => {
    const image = new Blob([new Uint8Array(MAX_IMAGE_BYTES + 1)], {
      type: 'image/jpeg',
    })
    expect(() => validateImage(image)).toThrow('over 40 MB')
  })
})

describe('inspectMask', () => {
  test('accepts a finite mask with foreground signal', () => {
    expect(inspectMask(new Float32Array([0.01, 0.12, 0.7, 0.99]), 4)).toEqual({
      valid: true,
      hasForegroundSignal: true,
    })
  })

  test('identifies the flat transparent output seen on broken WebGPU runs', () => {
    expect(inspectMask(new Float32Array(16), 16)).toEqual({
      valid: true,
      hasForegroundSignal: false,
    })
  })

  test('rejects malformed or non-finite tensors', () => {
    expect(inspectMask(new Float32Array([0, Number.NaN]), 2).valid).toBe(false)
    expect(inspectMask(new Float32Array([0, 1]), 3).valid).toBe(false)
  })
})
