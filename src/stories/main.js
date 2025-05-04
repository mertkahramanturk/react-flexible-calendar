module.exports = {
  stories: ['../stories/**/*.@(js|jsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
		'@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/react-vite', 
    options: {},
  },
};
