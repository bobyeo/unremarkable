module.exports = {
  setupFilesAfterEnv: ['jest-canvas-mock'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
}
