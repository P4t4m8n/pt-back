export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testPathIgnorePatterns = ['/node_modules/', '/dist/'];
export const transform = {
  '^.+\\.tsx?$': 'ts-jest',
};