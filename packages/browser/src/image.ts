import { BackgroundRemovalError } from './errors'

export const MAX_IMAGE_BYTES = 40 * 1024 * 1024
const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function validateImage(input: Blob): void {
  if (!SUPPORTED_TYPES.has(input.type)) {
    throw new BackgroundRemovalError(
      'unsupported-image',
      'Choose a PNG, JPG, or WebP image.',
    )
  }
  if (input.size > MAX_IMAGE_BYTES) {
    throw new BackgroundRemovalError(
      'image-too-large',
      'This image is over 40 MB. Choose a smaller file.',
    )
  }
}

export async function decodeImage(input: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(input, { imageOrientation: 'from-image' })
  } catch (error) {
    throw new BackgroundRemovalError(
      'decode-failed',
      'This image could not be opened. Try exporting it as PNG or JPG.',
      { cause: error },
    )
  }
}

export function maskToPng(
  image: ImageBitmap,
  mask: Float32Array,
  maskWidth: number,
  maskHeight: number,
  quality: 'fast' | 'quality',
): Promise<Blob> {
  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = maskWidth
  maskCanvas.height = maskHeight
  const maskContext = maskCanvas.getContext('2d')
  if (!maskContext) throw new Error('Canvas is unavailable')

  const pixels = maskContext.createImageData(maskWidth, maskHeight)
  for (let index = 0; index < mask.length; index += 1) {
    const alpha =
      quality === 'quality' ? mask[index] : smoothstep(0.08, 0.92, mask[index])
    const offset = index * 4
    pixels.data[offset] = 255
    pixels.data[offset + 1] = 255
    pixels.data[offset + 2] = 255
    pixels.data[offset + 3] = Math.round(alpha * 255)
  }
  maskContext.putImageData(pixels, 0, 0)

  const output = document.createElement('canvas')
  output.width = image.width
  output.height = image.height
  const context = output.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')
  context.drawImage(image, 0, 0)
  context.globalCompositeOperation = 'destination-in'
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = quality === 'quality' ? 'high' : 'medium'
  context.drawImage(maskCanvas, 0, 0, image.width, image.height)

  return new Promise((resolve, reject) => {
    output.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
      'image/png',
    )
  })
}

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}
