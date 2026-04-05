(() => {
  const CANONICAL_HOST = 'soundscript.dev';
  const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

  if (typeof window === 'undefined') {
    return;
  }

  const {hostname, pathname, search, hash, protocol} = window.location;
  const shouldNormalizeLegacyPath =
    pathname === '/website' || pathname.startsWith('/website/');
  const shouldNormalizeHost = !LOCAL_HOSTS.has(hostname) && hostname !== CANONICAL_HOST;

  if (!shouldNormalizeLegacyPath && !shouldNormalizeHost) {
    return;
  }

  const normalizedPath = shouldNormalizeLegacyPath
    ? pathname.replace(/^\/website(?=\/|$)/, '') || '/'
    : pathname;
  const targetUrl = `https://${CANONICAL_HOST}${normalizedPath}${search}${hash}`;

  if (protocol === 'http:' || protocol === 'https:') {
    window.location.replace(targetUrl);
  }
})();
