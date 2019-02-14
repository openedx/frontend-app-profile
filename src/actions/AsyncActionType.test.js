import AsyncActionType from './AsyncActionType';

describe('AsyncActionType', () => {
  it('should return well formatted action strings', () => {
    const actionType = new AsyncActionType('HOUSE_CATS', 'START_THE_RACE');

    expect(actionType.BASE).toBe('HOUSE_CATS__START_THE_RACE');
    expect(actionType.BEGIN).toBe('HOUSE_CATS__START_THE_RACE__BEGIN');
    expect(actionType.SUCCESS).toBe('HOUSE_CATS__START_THE_RACE__SUCCESS');
    expect(actionType.FAILURE).toBe('HOUSE_CATS__START_THE_RACE__FAILURE');
    expect(actionType.RESET).toBe('HOUSE_CATS__START_THE_RACE__RESET');
  });
});
