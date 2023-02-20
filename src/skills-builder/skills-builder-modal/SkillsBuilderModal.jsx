import React, { useState, useContext } from 'react';
import {
  Button,
  Container,
  Stepper,
  ModalDialog,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { useHistory } from 'react-router';
import {
  STEP1,
  STEP2,
} from '../data/constants';
import messages from './messages';

import { SkillsBuilderContext } from '../skills-builder-context';
import { SkillsBuilderHeader } from '../skills-builder-header';
import SelectPreferences from './SelectPreferences';
import ViewResults from './ViewResults';

import headerImage from '../images/headerImage.png';

const SkillsBuilderModal = () => {
  const [{ careerInterests }] = useContext(SkillsBuilderContext);
  const [currentStep, setCurrentStep] = useState(STEP1);

  const history = useHistory();

  const onCloseHandle = () => {
    history.goBack();
  };

  return (
    <Stepper activeKey={currentStep}>
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
          <Container size="lg">
            <Stepper.Step eventKey={STEP1} title="Select preferences">
              <SelectPreferences />
            </Stepper.Step>

            <Stepper.Step eventKey={STEP2} title="Review results">
              <ViewResults />
            </Stepper.Step>
          </Container>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <Stepper.ActionRow eventKey={STEP1}>
            <Button variant="outline-primary">
              <FormattedMessage {...messages.goBackButton} />
            </Button>
            <Stepper.ActionRow.Spacer />
            <Button
              onClick={() => setCurrentStep(STEP2)}
              disabled={careerInterests.length === 0}
            >
              <FormattedMessage {...messages.nextStepButton} />
            </Button>
          </Stepper.ActionRow>
          <Stepper.ActionRow eventKey={STEP2}>
            <Button
              variant="outline-primary"
              onClick={() => setCurrentStep(STEP1)}
            >
              <FormattedMessage {...messages.goBackButton} />
            </Button>
            <Stepper.ActionRow.Spacer />
            <Button onClick={onCloseHandle}>
              <FormattedMessage {...messages.exitButton} />
            </Button>
          </Stepper.ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </Stepper>
  );
};

export default SkillsBuilderModal;
