const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { EleventyRenderPlugin } = require('@11ty/eleventy');

const { execSync } = require('child_process');

const markdown = require('./_eleventy/utils/markdown');

// Shortcodes
const linkShortCodes = require('./_eleventy/shortcodes/links');
const version = require('./_eleventy/shortcodes/version');
const resources = require('./_eleventy/shortcodes/resources');

// Filters
const jsmin = require('./_eleventy/filters/jsmin');
const cssmin = require('./_eleventy/filters/cssmin');
const htmlmin = require('./_eleventy/filters/htmlmin');
const sortByOrder = require('./_eleventy/filters/sort-by-order');
const resourceShortCodes = require('./_eleventy/filters/resource-shortcodes');

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addWatchTarget('./src/styles/main.css');

  eleventyConfig.ignores.add('./src/roadmaps/**/content');

  // To be copied as it is
  eleventyConfig
    .addPassthroughCopy('./src/assets')
    .addPassthroughCopy('./src/CNAME')
    .addPassthroughCopy('./src/.nojekyll')
    .addPassthroughCopy({
      './node_modules/roadmap-renderer/dist/index.umd.js':
        'assets/roadmap-renderer.js',
    });

  // Shortcodes
  eleventyConfig.addShortcode('Video', linkShortCodes.Video);
  eleventyConfig.addShortcode('Blog', linkShortCodes.Blog);
  eleventyConfig.addShortcode('Course', linkShortCodes.Course);
  eleventyConfig.addShortcode('Official', linkShortCodes.Official);
  eleventyConfig.addShortcode('version', version);
  eleventyConfig.addPairedShortcode('resources', resources);

  // Filters
  eleventyConfig.addNunjucksAsyncFilter('jsmin', jsmin);
  eleventyConfig.addNunjucksAsyncFilter('cssmin', cssmin);
  eleventyConfig.addNunjucksFilter('htmlmin', htmlmin);
  eleventyConfig.addFilter('sortByOrder', sortByOrder);
  eleventyConfig.addFilter('resourceShortCodes', resourceShortCodes);

  // Transforms
  eleventyConfig.addTransform('htmlmin', htmlmin);
  // @todo add transform for jsmin
  // @todo add transform for cssmin

  // Custom markdown library
  eleventyConfig.setLibrary('md', markdown);

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Rebuild tailwind before reloading
  eleventyConfig.on('eleventy.after', async () => {
    console.log('Building Tailwind…');
    console.log(execSync('npm run build:tailwind').toString());
  });

  return {
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: '_site',
    },
  };
};
