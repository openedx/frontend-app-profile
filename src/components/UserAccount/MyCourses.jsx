import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardImg, CardBody, CardTitle } from 'reactstrap';

import EditableItemHeader from './EditableItemHeader';


function MyCourses(props) {
  const {
    courses,
  } = props;

  return (
    <React.Fragment>
      <EditableItemHeader
        content="My Courses"
      />
      <Row>
        {courses.map(({ title }) => (
          <Col key={title} sm={6} lg={4}>
            <Card className="mb-4">
              <CardImg top src="https://placeholdit.imgix.net/~text?txt=Certificate&w=300&h=100" />
              <CardBody>
                <CardTitle>{title}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
}

export default MyCourses;

MyCourses.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
};

MyCourses.defaultProps = {
  courses: [],
};
