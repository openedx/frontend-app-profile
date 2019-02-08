import React from 'react';
import { connect } from 'react-redux';
import { Hyperlink } from '@edx/paragon';
import SiteHeader from '@edx/frontend-component-site-header';

const mapStateToProps = state => ({
  accountMenu: {
    avatar: state.userAccount.profileImage.imageUrlMedium,
    username: state.userAccount.username,
    menuContent: (
      <div>
        <Hyperlink className="btn btn-outline-secondary btn-block" content="Logout" destination={process.env.LOGOUT_URL} />
      </div>
    ),
  },
});

export default connect(mapStateToProps)(SiteHeader);
