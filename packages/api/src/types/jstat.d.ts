declare module 'jstat' {
  interface JStat {
    beta: JStatBeta;
  }

  interface JStatBeta {
    sample(alpha: number, beta: number): number;
  }

  interface JStatExport {
    jStat: JStat;
  }

  const JStatExport: JStatExport;

  export = JStatExport;
}
