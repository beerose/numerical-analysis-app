module.exports = {
  presets: [
    [
      '@emotion/babel-preset-css-prop',
      {
        autoLabel: true,
        labelFormat: '[local]',
      },
    ],
  ],
  plugins: [
    'babel-plugin-transform-inline-environment-variables',
    '@emotion/babel-plugin-core',
    '@babel/plugin-transform-react-constant-elements',
    [
      'babel-plugin-jsx-pragmatic',
      {
        module: '@emotion/core',
        export: 'jsx',
        import: 'jsx',
      },
    ],
    [
      'babel-plugin-transform-react-jsx',
      {
        pragma: 'jsx',
        pragmaFrag: 'React.Fragment',
      },
    ],
  ],
  env: {
    test: {
      presets: ['env'],
    },
  },
};
