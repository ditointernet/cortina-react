// prettier-ignore
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js',
  ],
  coverageReporters: ['html', 'text'],

  testMatch: [
    '<rootDir>/test/**/*.js',
  ],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!cora)',
  ],
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'web.js',
    'mjs',
    'js',
    'json',
    'node',
  ]
};
