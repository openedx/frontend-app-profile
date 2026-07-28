export const deriveProfileStatusCounts = (courses = []) => {
  const now = Date.now();

  return courses.reduce(
    (counts, course) => {
      const completion = course?.completion ?? 0;
      const { dueDate } = course;
      const next = { ...counts };

      if (completion === 100) {
        next.completed += 1;
      } else if (completion > 0 && completion < 100) {
        next.inProgress += 1;
      }

      if (dueDate != null && completion < 100) {
        next.assigned += 1;
        const dueMs = Date.parse(dueDate);
        if (!Number.isNaN(dueMs) && dueMs < now) {
          next.overdue += 1;
        }
      }

      return next;
    },
    {
      completed: 0,
      inProgress: 0,
      assigned: 0,
      overdue: 0,
    },
  );
};
