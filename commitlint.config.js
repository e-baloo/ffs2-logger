export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation
        'style',    // Formatage, points-virgules manquants, etc.
        'refactor', // Refactoring du code
        'test',     // Ajout de tests manquants
        'chore',    // Maintenance (build, outils, etc.)
        'perf',     // Amélioration des performances
        'ci',       // Changements dans la CI
        'build',    // Changements qui affectent le système de build
        'revert'    // Retour en arrière
      ]
    ],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100]
  }
};