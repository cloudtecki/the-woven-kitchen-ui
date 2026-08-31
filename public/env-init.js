if (globalThis.twkVars) {
  Object.defineProperty(globalThis, 'twkVars', {
    writable: false,
    configurable: false,
    enumerable: true,
  });
  Object.defineProperties(globalThis.twkVars, {
    apiUrl: { writable: false, configurable: false, enumerable: true },
    apiScope: { writable: false, configurable: false, enumerable: true },
    clientId: { writable: false, configurable: false, enumerable: true },
    authority: { writable: false, configurable: false, enumerable: true },
  });
}
//From meta tage with name="csp-nonce", get the nonce value
const metaTag = document.querySelector('meta[name="csp-nonce"]');
if (metaTag) {
  const nonce = metaTag.getAttribute('content');
  if (nonce) {
    Object.defineProperty(globalThis, 'cspNonce', {
      value: nonce,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  }
}
