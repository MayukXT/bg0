import type { CaptureResult, PostHog } from 'posthog-js'

const POSTHOG_KEY = 'phc_wVUY4kf7cB9GCtKztaQ4dk6ooYU8QaagC88breDYcgaj'
const POSTHOG_HOST = 'https://us.i.posthog.com'

type InputMethod = 'drop' | 'paste' | 'picker'
type ResultView = 'compare' | 'original' | 'result'
type Feature =
  | 'compare_slider'
  | 'copy_result'
  | 'start_another_image'
  | `view_${ResultView}`

let clientPromise: Promise<PostHog | null> | null = null

function withoutUrls(properties: CaptureResult['properties'] | undefined) {
  if (!properties) return undefined
  const sanitized = { ...properties }
  delete sanitized.$current_url
  delete sanitized.$referrer
  delete sanitized.$initial_current_url
  delete sanitized.$initial_referrer
  return sanitized
}

function stripUrls(capture: CaptureResult | null) {
  if (!capture) return null
  return {
    ...capture,
    properties: withoutUrls(capture.properties) ?? {},
    $set: withoutUrls(capture.$set),
    $set_once: withoutUrls(capture.$set_once),
  }
}

function analyticsEnabled() {
  if (typeof window === 'undefined') return false
  return (
    window.location.hostname === 'bg0.dev' ||
    window.location.hostname === 'www.bg0.dev'
  )
}

function getClient(): Promise<PostHog | null> {
  if (!analyticsEnabled()) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          autocapture: false,
          capture_dead_clicks: false,
          capture_pageleave: true,
          capture_pageview: false,
          capture_performance: false,
          disable_session_recording: true,
          disable_surveys: true,
          advanced_disable_feature_flags: true,
          person_profiles: 'never',
          persistence: 'localStorage',
          before_send: stripUrls,
        })
        return posthog
      })
      .catch(() => null)
  }
  return clientPromise
}

function capture(event: string, properties: Record<string, string>) {
  void getClient().then((client) => client?.capture(event, properties))
}

export function capturePageView(route: string) {
  capture('$pageview', { route })
}

export function captureImageSelected(inputMethod: InputMethod) {
  capture('image_selected', { input_method: inputMethod })
}

export function captureRemovalSucceeded(
  inputMethod: InputMethod,
  provider: 'wasm' | 'webgpu',
) {
  capture('background_removal_succeeded', {
    input_method: inputMethod,
    provider,
  })
}

export function captureRemovalFailed(
  inputMethod: InputMethod,
  reason:
    | 'cancelled'
    | 'decode-failed'
    | 'image-too-large'
    | 'inference-failed'
    | 'model-load-failed'
    | 'out-of-memory'
    | 'unsupported-image',
) {
  capture('background_removal_failed', {
    input_method: inputMethod,
    reason,
  })
}

export function captureResultDownloaded(provider: 'wasm' | 'webgpu') {
  capture('result_downloaded', { provider })
}

export function captureFeatureUsed(feature: Feature) {
  capture('feature_used', { feature })
}
