import React from 'react';
import {
  ActionRow,
  Button,
  Container,
  FullscreenModal,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import messages from './messages';

const SkillsBuilder = () => {
  const onCloseHandle = () => {
    window.history.back();
  };

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
        <h3>Skills Builder content will go here</h3>
      </Container>
    </FullscreenModal>
  );
};

export default SkillsBuilder;
