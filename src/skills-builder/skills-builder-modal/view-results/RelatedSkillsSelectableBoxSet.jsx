import React from 'react';
import PropTypes from 'prop-types';
import {
  SelectableBox, Chip, Stack, useMediaQuery, breakpoints,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const RelatedSkillsSelectableBoxSet = ({ jobSkillsList, selectedJobTitle, onChange }) => {
  const { formatMessage } = useIntl();
  const isExtraSmall = useMediaQuery({ maxWidth: breakpoints.extraSmall.maxWidth });

  const renderTopFiveSkills = (skills) => {
    const topFiveSkills = skills.sort((a, b) => b.significance - a.significance).slice(0, 5);
    return (
      topFiveSkills.map(skill => (
        <Chip key={skill.id}>
          {skill.name}
        </Chip>
      ))
    );
  };

  return (
    <SelectableBox.Set
      name="selected job title"
      type="radio"
      value={selectedJobTitle}
      onChange={onChange}
      columns={isExtraSmall ? 1 : 3}
    >
      {jobSkillsList.map(job => (
        <SelectableBox
          key={job.id}
          type="radio"
          value={job.name}
          aria-label={job.name}
          inputHidden={false}
        >
          <p>{job.name}</p>
          <Stack gap={2} className="align-items-start">
            <p className="heading-label x-small">{formatMessage(messages.relatedSkillsHeading)}</p>
            {renderTopFiveSkills(job.skills)}
          </Stack>
        </SelectableBox>
      ))}
    </SelectableBox.Set>
  );
};

RelatedSkillsSelectableBoxSet.propTypes = {
  jobSkillsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedJobTitle: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RelatedSkillsSelectableBoxSet;
