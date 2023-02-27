import React, { useState, useContext } from 'react';
import {
  Button, Container, Stepper, ModalDialog,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useHistory } from 'react-router';
import {
  STEP1, STEP2,
} from '../data/constants';
import messages from './messages';

import { SkillsBuilderContext } from '../skills-builder-context';
import { SkillsBuilderHeader } from '../skills-builder-header';
import { SelectPreferences } from './select-preferences';
import ViewResults from './view-results/ViewResults';

import headerImage from '../images/headerImage.png';

const SkillsBuilderModal = () => {
  const { formatMessage } = useIntl();
  const { state } = useContext(SkillsBuilderContext);
  const { careerInterests } = state;
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
        className="skills-builder-modal bg-light-200"
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

        <Stepper.Header />

        <ModalDialog.Body>
          <Container size="md" className="p-4.5">
            <Stepper.Step eventKey={STEP1} title={formatMessage(messages.selectPreferences)}>
              <SelectPreferences />
            </Stepper.Step>

            <Stepper.Step eventKey={STEP2} title={formatMessage(messages.reviewResults)}>
              <ViewResults />
            </Stepper.Step>
          </Container>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <Stepper.ActionRow eventKey={STEP1}>
            <Button variant="outline-primary" onClick={onCloseHandle}>
              {formatMessage(messages.goBackButton)}
            </Button>
            <Stepper.ActionRow.Spacer />
            <Button
              onClick={() => setCurrentStep(STEP2)}
              disabled={careerInterests.length === 0}
            >
              {formatMessage(messages.nextStepButton)}
            </Button>
          </Stepper.ActionRow>
          <Stepper.ActionRow eventKey={STEP2}>
            <Button
              variant="outline-primary"
              onClick={() => setCurrentStep(STEP1)}
            >
              {formatMessage(messages.goBackButton)}
            </Button>
            <Stepper.ActionRow.Spacer />
            <Button onClick={onCloseHandle}>
              {formatMessage(messages.exitButton)}
            </Button>
          </Stepper.ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </Stepper>
  );
};

export default SkillsBuilderModal;
