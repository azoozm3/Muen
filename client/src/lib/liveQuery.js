export const LIVE_QUERY_INTERVAL = 15000;
export const LIVE_QUERY_STALE_TIME = 10000;

export function liveQueryOptions(overrides = {}) {
  const { meta, ...rest } = overrides;
  return {
    meta: { live: true, ...(meta || {}) },
    staleTime: LIVE_QUERY_STALE_TIME,
    refetchInterval: LIVE_QUERY_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
    ...rest,
  };
}

export function staticQueryOptions(overrides = {}) {
  const { meta, ...rest } = overrides;
  return {
    meta: { live: false, ...(meta || {}) },
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    ...rest,
  };
}
