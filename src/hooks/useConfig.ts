// useConfig — v1.2 (code/msg/data)
import { useState, useEffect, useCallback } from 'react';
import { getConfig } from '../api/config';
import type { ConfigJson } from '../types';
import { defaultConfigV2 } from '../types';

export function useConfig() {
  const [configJson, setConfigJson] = useState<ConfigJson>(defaultConfigV2);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    try {
      const res = await getConfig();
      const d = res.data;
      setConfigJson({
        theme: d.theme || defaultConfigV2.theme,
        typography: d.typography || defaultConfigV2.typography,
        layout: d.layout || defaultConfigV2.layout,
        background: d.background || defaultConfigV2.background,
        navbar: d.navbar || defaultConfigV2.navbar,
        footer: d.footer || defaultConfigV2.footer,
      });
      setVersion(d.version ?? null);
    } catch {
      setConfigJson(defaultConfigV2);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { configJson, version, loading, refetch: fetch };
}
