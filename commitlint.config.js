export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting, missing semi-colons, etc.
        'refactor', // Code refactoring
        'test',     // Adding missing tests
        'chore',    // Maintenance (build, tools, etc.)
        'perf',     // Performance improvements
        'ci',       // CI changes
        'build',    // Build system changes
        'revert'    // Revert a previous commit
      ]
    ],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100]
  }
};