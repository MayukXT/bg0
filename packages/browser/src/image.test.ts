import { describe, expect, test } from 'bun:test'
import { BackgroundRemovalError } from './errors'
import { MAX_IMAGE_BYTES, validateImage } from './image'

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
