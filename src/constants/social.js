const SOCIAL = {
  linkedin: {
    title: 'LinkedIn',
  },
  twitter: {
    title: 'Twitter',
  },
  facebook: {
    title: 'Facebook',
  },
};

const getSocialLinks = (socialLinksState) => {
  const socialLinks = {};
  if (socialLinksState) {
    socialLinksState.forEach((link) => {
      const socialLinkUrl = link.socialLink;
      if (socialLinkUrl) {
        socialLinks[link.platform] = {
          ...SOCIAL[link.platform],
          url: link.socialLink,
          display: link.socialLink,
        };
      }
    });
  }

  return socialLinks;
};

export {
  getSocialLinks,
  SOCIAL,
};
