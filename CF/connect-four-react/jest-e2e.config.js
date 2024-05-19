module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['**/e2e/**/*.spec.(ts|tsx|js|jsx)'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsConfig.json',
        babel: true,
      },
    ],
  },
};
