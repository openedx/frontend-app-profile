import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  completed: {
    id: 'profile.statusCards.completed',
    defaultMessage: 'Completed',
    description: 'Label for completed courses count on profile header',
  },
  inProgress: {
    id: 'profile.statusCards.inProgress',
    defaultMessage: 'In Progress',
    description: 'Label for in-progress courses count on profile header',
  },
  assigned: {
    id: 'profile.statusCards.assigned',
    defaultMessage: 'Assigned',
    description: 'Label for assigned courses count on profile header',
  },
  totalHours: {
    id: 'profile.statusCards.totalHours',
    defaultMessage: 'Total Hours',
    description: 'Label for total learning hours on profile header',
  },
  viewAllInProgress: {
    id: 'profile.statusCards.viewAllInProgress',
    defaultMessage: 'View All In Progress',
    description: 'Button linking to in-progress courses on the learner dashboard',
  },
  viewAssignedCourses: {
    id: 'profile.statusCards.viewAssignedCourses',
    defaultMessage: 'View Assigned Courses',
    description: 'Button linking to assigned courses on the learner dashboard',
  },
  overdueBadge: {
    id: 'profile.statusCards.overdueBadge',
    defaultMessage: '{count} Overdue',
    description: 'Badge showing count of overdue assigned courses',
  },
});

export default messages;
