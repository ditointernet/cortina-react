// prettier-ignore
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js',
  ],
  coverageReporters: ['html', 'text'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  testMatch: [
    '<rootDir>/test/**/*.js',
  ],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.js$',
  ],
  moduleDirectories: [
    'node_modules',
    'src',
    'src/modules',
  ],
  moduleFileExtensions: [
    'web.js',
    'mjs',
    'js',
    'json',
    'node',
  ]
};
