import React from 'react';

function renderEducationAndSocial() {
  return (
    <React.Fragment>
      <h3>Education</h3>
      <p>Bachelor’s Degree</p>

      <h3>Social Links</h3>
      <dl>
        <dt>Linked In</dt>
        <dd>https://www.linkedin.com/in/hermione-granger</dd>

        <dt>Twitter</dt>
        <dd>https://www.twitter.com/hermione_granger</dd>

        <dt>Personal Website</dt>
        <dd>www.hermionegranger.com</dd>
      </dl>
    </React.Fragment>
  );
}

function renderCard(title) {
  return (
    <div className="card mb-4">
      <img className="card-img-top" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16861abde81%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16861abde81%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1953125%22%20y%3D%2296.6%22%3E286x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="certificate" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
      </div>
    </div>
  );
}

function UserAccount() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <div className="row mb-3">
            <div className="col d-flex d-md-block">
              <div className="flex-grow-0 mr-1">
                <img className="mw-100 rounded-circle d-block" src="data:image/svg+xml;charset=UTF-8,<svg%20width%3D'100'%20height%3D'100'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20200%20200'%20preserveAspectRatio%3D'none'><defs><style%20type%3D'text%2Fcss'>%23holder_168619af758%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20<%2Fstyle><%2Fdefs><g%20id%3D'holder_168619af758'><rect%20width%3D'200'%20height%3D'200'%20fill%3D'%23777'><%2Frect><g><text%20x%3D'74.4296875'%20y%3D'104.65'>100 x 100<%2Ftext><%2Fg><%2Fg><%2Fsvg>" alt="avatar" />
              </div>
              <div>
                <h1>Hermione Granger</h1>
                <ul className="list-unstyled">
                  <li>itslevioooosa20</li>
                  <li>Member since 2017</li>
                  <li>London, UK</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row mb-3 d-none d-md-block">
            <div className="col">
              {renderEducationAndSocial()}
            </div>
          </div>
        </div>
        <div className="col-md-8 col-lg-9">

          <h3>About Hermione</h3>
          <p>These are some words about me and who I am as a person.</p>

          <div className="d-md-none">
            {renderEducationAndSocial()}
          </div>

          <h3>My Certificates</h3>
          <div className="row">
            <div className="col-md-6 col-lg-4">
              {renderCard('Certificate')}
            </div>
            <div className="col-md-6 col-lg-4">
              {renderCard('Certificate')}
            </div>
            <div className="col-md-6 col-lg-4">
              {renderCard('Certificate')}
            </div>
          </div>

          <h3>Courses I’ve Taken</h3>
          <div className="row">
            <div className="col-md-6 col-lg-4">
              {renderCard('Course')}
            </div>
            <div className="col-md-6 col-lg-4">
              {renderCard('Course')}
            </div>
            <div className="col-md-6 col-lg-4">
              {renderCard('Course')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccount;
