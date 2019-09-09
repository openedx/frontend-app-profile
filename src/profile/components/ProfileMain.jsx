import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import { AuthenticationContext, fetchUserAccount } from '../../../frontend-core';

import NotFoundPage from './NotFoundPage';
import ConnectedProfilePage from './ProfilePage';

function ProfileMain(props) {
  const authentication = useContext(AuthenticationContext);

  useEffect(() => {
    props.fetchUserAccount(authentication.username);
  }, [authentication.username]);

  return (
    <main>
      <Switch>
        <Route path="/u/:username" component={ConnectedProfilePage} />
        <Route path="/notfound" component={NotFoundPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </main>
  );
}

ProfileMain.propTypes = {
  fetchUserAccount: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    fetchUserAccount,
  },
)(ProfileMain);
