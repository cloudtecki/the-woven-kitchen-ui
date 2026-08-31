//Functions in this file are to be used by bundler - rspack
export function dynamicRemote(
    moduleName: string,
    urlExpression: string,
    fileName: string,
) {
    return `promise new Promise((resolve, reject) => {
      const urlValue = ${urlExpression};
      let remoteUrl = typeof urlValue === 'function' ? urlValue() : urlValue;

      const script = document.createElement('script');
      remoteUrl = remoteUrl + '/' + '${fileName}';
      script.src = remoteUrl;
      script.onload = () => {
        const proxy = {
          get: (...args) => window.${moduleName}.get(...args),
          init: (shareScope, initScope) => {
            try {
              return window.${moduleName}.init(shareScope, initScope);
            } catch (e) {
              console.log('Remote container already initialized');
            }
          },
        };
        resolve(proxy);
      };
      script.onerror = (event) => { reject(event); };
      document.head.appendChild(script);
    })`;
}

export function transformEnvVariables(
    input: Record<string, string>,
): Record<string, string> {
    const transformed: Record<string, string> = {};
    for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            transformed[`process.env.${key}`] = input[key];
        }
    }
    return transformed;
}

export function initEmptyVars(
    input: Record<string, string>,
): Record<string, string> {
    const transformed = { ...input };
    if (!transformed['REACT_APP_BUILD_NUMBER']) {
        //below line is to support the local build
        transformed['REACT_APP_BUILD_NUMBER'] = `${Date.now()}`;
    }
    return transformed;
}