module.exports = api => {
  const targets = api.env('test') ? { node: 'current' } : undefined;

  return {
    presets: [
      ['@babel/preset-env', { targets }],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
  };
};
