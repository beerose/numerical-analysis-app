import React from 'react';
import { render } from 'react-dom';

window.process = process || {};
process.env = process.env || {};
process.env['NODE' + 'ENV'] = process.env.NODE_ENV;

const { App } = require('./App');

render(<App />, document.getElementById('root'));
