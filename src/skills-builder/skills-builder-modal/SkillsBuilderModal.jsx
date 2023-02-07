import React, { useContext, useState } from 'react';
import {
  ActionRow,
  Button,
  Container,
  FullscreenModal,
  Form,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  setGoal,
} from '../data/actions';
import messages from './messages';
import { SkillsBuilderContext } from '../skills-builder-context';

const SkillsBuilderModal = () => {
  const onCloseHandle = () => {
    window.history.back();
  };

  const [state, dispatch] = useContext(SkillsBuilderContext);

  const [learnerGoal, setLearnerGoal] = useState('');

  return (
    <FullscreenModal
      title="Skills Builder"
      isOpen
      onClose={onCloseHandle}
      footerNode={(
        <ActionRow>
          <Button variant="tertiary">
            <FormattedMessage {...messages.goBackButton} />
          </Button>
          <ActionRow.Spacer />
          <Button>
            <FormattedMessage {...messages.nextStepButton} />
          </Button>
        </ActionRow>
          )}
    >
      <Container>
        <h3>Your current goal: {state.currentGoal}</h3>
        <br />
        <Form.Group controlId="currentLearnerGoal">
          <Form.Control
            type="text"
            floatingLabel="Goal"
            value={learnerGoal}
            onChange={(e) => setLearnerGoal(e.target.value)}
          />
        </Form.Group>
        <Button
          onClick={() => dispatch(setGoal(learnerGoal))}
        >
          Submit
        </Button>
      </Container>
    </FullscreenModal>
  );
};

export default SkillsBuilderModal;
