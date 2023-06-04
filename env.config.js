const config = {
  PARAGON_THEME_URLS: {
    core: {
      urls: {
        default: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$paragonVersion/dist/core.min.css',
        brandOverride: 'https://cdn.jsdelivr.net/npm/@edx/brand-edx.org@2.2.0-alpha.9/dist/core.min.css',
      },
    },
    variants: {
      light: {
        urls: {
          default: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$paragonVersion/dist/light.min.css',
          brandOverride: 'https://cdn.jsdelivr.net/npm/@edx/brand-edx.org@2.2.0-alpha.9/dist/light.min.css',
        },
        default: true,
        dark: false,
      },
    },
  },
};

export default config;
