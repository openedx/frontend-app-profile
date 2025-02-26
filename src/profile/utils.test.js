import {
  AsyncActionType,
  modifyObjectKeys,
  camelCaseObject,
  snakeCaseObject,
  convertKeyNames,
  moveCheckboxFieldsToEnd,
  capitalizeFirstLetter,
} from './utils';

describe('modifyObjectKeys', () => {
  it('should use the provided modify function to change all keys in and object and its children', () => {
    function meowKeys(key) {
      return `${key}Meow`;
    }

    const result = modifyObjectKeys(
      {
        one: undefined,
        two: null,
        three: '',
        four: 0,
        five: NaN,
        six: [1, 2, { seven: 'woof' }],
        eight: { nine: { ten: 'bark' }, eleven: true },
      },
      meowKeys,
    );

    expect(result).toEqual({
      oneMeow: undefined,
      twoMeow: null,
      threeMeow: '',
      fourMeow: 0,
      fiveMeow: NaN,
      sixMeow: [1, 2, { sevenMeow: 'woof' }],
      eightMeow: { nineMeow: { tenMeow: 'bark' }, elevenMeow: true },
    });
  });
});

describe('camelCaseObject', () => {
  it('should make everything camelCase', () => {
    const result = camelCaseObject({
      what_now: 'brown cow',
      but_who: { says_you_people: 'okay then', but_how: { will_we_even_know: 'the song is over' } },
      'dot.dot.dot': 123,
    });

    expect(result).toEqual({
      whatNow: 'brown cow',
      butWho: { saysYouPeople: 'okay then', butHow: { willWeEvenKnow: 'the song is over' } },
      dotDotDot: 123,
    });
  });
});

describe('snakeCaseObject', () => {
  it('should make everything snake_case', () => {
    const result = snakeCaseObject({
      whatNow: 'brown cow',
      butWho: { saysYouPeople: 'okay then', butHow: { willWeEvenKnow: 'the song is over' } },
      'dot.dot.dot': 123,
    });

    expect(result).toEqual({
      what_now: 'brown cow',
      but_who: { says_you_people: 'okay then', but_how: { will_we_even_know: 'the song is over' } },
      dot_dot_dot: 123,
    });
  });
});

describe('convertKeyNames', () => {
  it('should replace the specified keynames', () => {
    const result = convertKeyNames(
      {
        one: { two: { three: 'four' } },
        five: 'six',
      },
      {
        two: 'blue',
        five: 'alive',
        seven: 'heaven',
      },
    );

    expect(result).toEqual({
      one: { blue: { three: 'four' } },
      alive: 'six',
    });
  });
});

describe('AsyncActionType', () => {
  it('should return well formatted action strings', () => {
    const actionType = new AsyncActionType('HOUSE_CATS', 'START_THE_RACE');

    expect(actionType.BASE).toBe('HOUSE_CATS__START_THE_RACE');
    expect(actionType.BEGIN).toBe('HOUSE_CATS__START_THE_RACE__BEGIN');
    expect(actionType.SUCCESS).toBe('HOUSE_CATS__START_THE_RACE__SUCCESS');
    expect(actionType.FAILURE).toBe('HOUSE_CATS__START_THE_RACE__FAILURE');
    expect(actionType.RESET).toBe('HOUSE_CATS__START_THE_RACE__RESET');
  });

  describe('moveCheckboxFieldsToEnd', () => {
    it('returns 1 when first field is checkbox and second field is not', () => {
      const a = { type: 'checkbox' };
      const b = { type: 'text' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(1);
    });

    it('returns -1 when first field is not checkbox and second field is', () => {
      const a = { type: 'text' };
      const b = { type: 'checkbox' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(-1);
    });

    it('returns 0 when both fields are checkboxes', () => {
      const a = { type: 'checkbox' };
      const b = { type: 'checkbox' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(0);
    });

    it('returns 0 when neither field is a checkbox', () => {
      const a = { type: 'text' };
      const b = { type: 'text' };

      expect(moveCheckboxFieldsToEnd(a, b)).toEqual(0);
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('capitalizes the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('returns an empty string when given an empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('handles single character strings', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
    });

    it('handles strings with only one word', () => {
      expect(capitalizeFirstLetter('word')).toBe('Word');
    });

    it('handles strings with multiple words', () => {
      expect(capitalizeFirstLetter('multiple words')).toBe('Multiple words');
    });

    it('handles non-string inputs by converting them to strings', () => {
      expect(capitalizeFirstLetter(123)).toBe('123');
      expect(capitalizeFirstLetter(null)).toBe('Null');
      expect(capitalizeFirstLetter(undefined)).toBe('Undefined');
      expect(capitalizeFirstLetter(true)).toBe('True');
    });

    it('handles strings with special characters', () => {
      expect(capitalizeFirstLetter('!hello')).toBe('!hello');
      expect(capitalizeFirstLetter('@world')).toBe('@world');
    });
  });
});
