import { deriveProfileStatusCounts } from './profileStatusCardsUtils';

describe('deriveProfileStatusCounts', () => {
  it('counts completed, in progress, and assigned courses', () => {
    const counts = deriveProfileStatusCounts([
      { completion: 100, dueDate: null },
      { completion: 50, dueDate: '2020-04-05T23:59:00+00:00' },
      { completion: 0, dueDate: '2099-05-01T23:59:00+00:00' },
      { completion: 100, dueDate: '2020-03-01T23:59:00+00:00' },
    ]);

    expect(counts).toEqual({
      completed: 2,
      inProgress: 1,
      assigned: 2,
      overdue: 1,
    });
  });

  it('returns zero counts for empty input', () => {
    expect(deriveProfileStatusCounts()).toEqual({
      completed: 0,
      inProgress: 0,
      assigned: 0,
      overdue: 0,
    });
  });
});
