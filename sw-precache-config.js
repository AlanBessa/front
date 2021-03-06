module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/**.js',
    'dist/**.css',
    'dist/**.eot',
    'dist/**.woff2',
    'dist/**.ttf',
    'dist/**.woff',
    'dist/**.svg'
  ]
};