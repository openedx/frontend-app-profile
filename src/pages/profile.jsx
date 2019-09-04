import React from 'react';

import { Link } from "gatsby"

export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        ProfilePage
        <Link to="/">Go back to the homepage</Link>
      </div>
    );
  }
}
