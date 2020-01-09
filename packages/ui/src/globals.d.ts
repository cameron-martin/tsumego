declare module '*.st.css' {
  const stylesheet: import('@stylable/runtime').RuntimeStylesheet;
  export = stylesheet;
}

declare function gtag(...args: unknown[]): void;
