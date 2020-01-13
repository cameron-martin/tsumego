declare module '*.st.css' {
  const stylesheet: import('@stylable/runtime').RuntimeStylesheet;
  export = stylesheet;
}

declare module '*.jpg' {
  interface ResponsiveImage {
    height: number;
    width: number;
    placeholder: string;
    src: string;
    srcSet: string;
  }

  const image: ResponsiveImage;

  export = image;
}

declare function gtag(...args: unknown[]): void;
