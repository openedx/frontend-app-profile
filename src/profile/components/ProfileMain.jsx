import { AppContext, fetchUserAccount } from '@edx/frontend-base';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import ConnectedProfilePage from './ProfilePage';

function ProfileMain(props) {
  const { authenticatedUser } = useContext(AppContext);

  useEffect(() => {
    props.fetchUserAccount(authenticatedUser.username);
  }, [authenticatedUser.username]);

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
