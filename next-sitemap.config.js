/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://blog.rorytech.com',
  outDir: 'out',
  // feed 不是页面，不该进 sitemap
  exclude: ['/atom.xml'],
}
