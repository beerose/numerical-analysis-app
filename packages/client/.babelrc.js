module.exports = {
  plugins: [
    'babel-plugin-transform-inline-environment-variables',
    '@emotion/babel-plugin-core',
    '@babel/plugin-transform-react-constant-elements',
  ],
  env: {
    test: {
      presets: ['env'],
    },
  },
};
