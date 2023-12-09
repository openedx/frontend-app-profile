module.exports = {
  PARAGON_THEME_URLS: {
    core: {
      urls: {
        default: 'https://cdn.jsdelivr.net/npm/@edx/paragon@alpha/dist/core.min.css',
        brandOverride: 'https://cdn.jsdelivr.net/npm/@edx/brand-edx.org@alpha/dist/core.min.css',
      },
    },
    defaults: {
      light: 'light',
      dark: 'dark',
    },
    variants: {
      light: {
        urls: {
          default: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$paragonVersion/dist/light.min.css',
          brandOverride: 'https://cdn.jsdelivr.net/npm/@edx/brand-edx.org@$brandVersion/dist/light.min.css',
        },
      },
    },
  },
};
