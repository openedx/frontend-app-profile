const config = {
  PARAGON_THEME_URLS: {
    core: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$paragonVersion/dist/core.min.css',
    variants: {
      light: {
        url: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$paragonVersion/dist/light.min.css',
        default: true,
        dark: false,
      },
    },
  },
};

export default config;
