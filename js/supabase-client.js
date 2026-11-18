let clientPromise

export function createSupabaseClient() {
  const config = window.PYESA_SUPABASE_CONFIG
  if (!config?.url || !config?.publishableKey) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('https://esm.sh/@supabase/supabase-js@2').then(({ createClient }) =>
      createClient(config.url, config.publishableKey),
    )
  }
  return clientPromise
}
