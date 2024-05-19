module.exports = {
  browsers: ['chromium'],
  exitOnPageError: false,
  launchOptions: {
    headless: false,
  },
  contextOptions: {
    viewport: {
      width: 1920,
      height: 1080,
    },
  },
  skipInitialization: false,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
