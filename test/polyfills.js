// jsdom lacks these Node globals; react-router uses them at import time
const { TextEncoder, TextDecoder } = require('node:util')

Object.assign(globalThis, { TextEncoder, TextDecoder })
