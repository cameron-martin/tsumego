declare module 'jstat' {
  interface jStat {
    beta: jStatBeta;
  }

  interface jStatBeta {
    sample(alpha: number, beta: number): number;
  }

  interface jStatExport {
    jStat: jStat;
  }

  const jStatExport: jStatExport;

  export = jStatExport;
}
