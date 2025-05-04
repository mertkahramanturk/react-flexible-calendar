export default {
  root: 'example',
  build: {
    lib: {
      entry: './src/index.js',
      name: 'ReactCalendarLib',
      fileName: (format) => `react-calendar-lib.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
};
