import React, { useContext, useState } from 'react';
import {
  ActionRow,
  Button,
  Container,
  Form,
  ModalDialog,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  setGoal,
} from '../data/actions';
import messages from './messages';
import { SkillsBuilderContext } from '../skills-builder-context';
import { SkillsBuilderHeader } from '../skills-builder-header';

import headerImage from '../images/headerImage.png';

const SkillsBuilderModal = () => {
  const onCloseHandle = () => {
    window.history.back();
  };

  const [state, dispatch] = useContext(SkillsBuilderContext);
  const [learnerGoal, setLearnerGoal] = useState('');

  return (
    <ModalDialog
      title="Skills Builder"
      size="fullscreen"
      className="skills-builder-modal"
      isOpen
      onClose={onCloseHandle}
    >
      <ModalDialog.Hero>
        <ModalDialog.Hero.Background className="bg-primary-500">
          <img src={headerImage} alt="" className="h-100" />
        </ModalDialog.Hero.Background>
        <ModalDialog.Hero.Content>
          <SkillsBuilderHeader />
        </ModalDialog.Hero.Content>
      </ModalDialog.Hero>
      <ModalDialog.Body>
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
          <Button onClick={() => dispatch(setGoal(learnerGoal))}>
            Submit
          </Button>
        </Container>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary">
            <FormattedMessage {...messages.goBackButton} />
          </Button>
          <ActionRow.Spacer />
          <Button>
            <FormattedMessage {...messages.nextStepButton} />
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default SkillsBuilderModal;
