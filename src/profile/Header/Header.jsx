import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
// import { useEnterpriseConfig } from "@edx/frontend-enterprise";
import { getConfig } from "@edx/frontend-platform";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { AppContext } from "@edx/frontend-platform/react";

import AnonymousUserMenu from "./AnonymousUserMenu";
import AuthenticatedUserDropdown from "./AuthenticatedUserDropdown";
import messages from "./messages";

import "./Header.scss";
import { Container } from "react-bootstrap";

function LinkedLogo({ href, src, alt, ...attributes }) {
  return (
    <a href={href} {...attributes} className="flex-grow-1">
      <img className="logo d-block" src={src} alt={alt} />
    </a>
  );
}

LinkedLogo.propTypes = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

function Header({ courseOrg, courseNumber, courseTitle, intl }) {
  const [colorChange, setColorchange] = useState(false);
  const { authenticatedUser } = useContext(AppContext);

  // const { enterpriseLearnerPortalLink, enterpriseCustomerBrandingConfig } =
  //   useEnterpriseConfig(
  //     authenticatedUser,
  //     getConfig().ENTERPRISE_LEARNER_PORTAL_HOSTNAME,
  //     getConfig().LMS_BASE_URL
  //   );

  // let headerLogo = (
  //   <LinkedLogo
  //     className="logo"
  //     href={`${getConfig().LMS_BASE_URL}/dashboard`}
  //     src={getConfig().LOGO_URL}
  //     alt={getConfig().SITE_NAME}
  //   />
  // );
  // if (
  //   enterpriseCustomerBrandingConfig &&
  //   Object.keys(enterpriseCustomerBrandingConfig).length > 0
  // ) {
  //   headerLogo = (
  //     <LinkedLogo
  //       className="logo"
  //       href={enterpriseCustomerBrandingConfig.logoDestination}
  //       src={enterpriseCustomerBrandingConfig.logo}
  //       alt={enterpriseCustomerBrandingConfig.logoAltText}
  //     />
  //   );
  // }

  const changeNavbarColor = () => {
    if (window.scrollY >= 400) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  window.addEventListener("scroll", changeNavbarColor);
  return (
    <div className={colorChange ? "header-color header-wrapper" : ""}>
      <Container className="my-4">
        <header className= "header">
          <a className="sr-only sr-only-focusable" href="#main-content">
            {intl.formatMessage(messages.skipNavLink)}
          </a>
          <div className="py-2 d-flex align-items-center ">
            {/* {headerLogo} */}
            {/* {authenticatedUser && (
              <AuthenticatedUserDropdown
                enterpriseLearnerPortalLink={enterpriseLearnerPortalLink}
                username={authenticatedUser.username}
              />
            )}
            {!authenticatedUser && <AnonymousUserMenu />} */}
          </div>
        </header>
      </Container>
    </div>
  );
}

Header.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  intl: intlShape.isRequired,
};

Header.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
};

export default injectIntl(Header);
