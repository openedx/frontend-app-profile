import {
  CLOSE_FORM,
  formReducer,
  initialFormState,
  OPEN_FORM,
  SAVE_BEGIN,
  SAVE_FAILURE,
  SAVE_RESET,
  SAVE_SUCCESS,
  UPDATE_DRAFT,
} from './formReducer';

describe('formReducer', () => {
  it('returns the initial state by default', () => {
    expect(formReducer(undefined, {})).toEqual(initialFormState);
  });

  describe('editing', () => {
    it('opens a form and clears the drafts', () => {
      const state = { ...initialFormState, drafts: { bio: 'stale' } };
      expect(formReducer(state, { type: OPEN_FORM, formId: 'bio' })).toEqual({
        ...initialFormState,
        currentlyEditingField: 'bio',
        drafts: {},
      });
    });

    it('closes the open form and clears the drafts', () => {
      const state = { ...initialFormState, currentlyEditingField: 'bio', drafts: { bio: 'draft' } };
      expect(formReducer(state, { type: CLOSE_FORM, formId: 'bio' })).toEqual(initialFormState);
    });

    it('forgets a failed save when the form closes or another opens', () => {
      const failed = {
        ...initialFormState,
        currentlyEditingField: 'bio',
        saveState: 'error',
        errors: { bio: { userMessage: 'Too long' } },
      };
      expect(formReducer(failed, { type: CLOSE_FORM, formId: 'bio' })).toEqual(initialFormState);
      expect(formReducer(failed, { type: OPEN_FORM, formId: 'name' })).toEqual({
        ...initialFormState,
        currentlyEditingField: 'name',
      });
    });

    it('ignores a close from a form that is not open', () => {
      const state = { ...initialFormState, currentlyEditingField: 'bio', drafts: { bio: 'draft' } };
      expect(formReducer(state, { type: CLOSE_FORM, formId: 'name' })).toBe(state);
    });

    it('records drafts by field', () => {
      const drafted = formReducer(initialFormState, { type: UPDATE_DRAFT, name: 'bio', value: 'draft' });
      expect(drafted.drafts).toEqual({ bio: 'draft' });

      const both = formReducer(drafted, { type: UPDATE_DRAFT, name: 'visibilityBio', value: 'private' });
      expect(both.drafts).toEqual({ bio: 'draft', visibilityBio: 'private' });
    });
  });

  describe('saving', () => {
    const editing = {
      ...initialFormState,
      currentlyEditingField: 'bio',
      drafts: { bio: 'draft' },
      errors: { bio: { userMessage: 'old' } },
    };

    it('marks the save pending and clears the errors', () => {
      expect(formReducer(editing, { type: SAVE_BEGIN })).toEqual({
        ...editing,
        saveState: 'pending',
        errors: {},
      });
    });

    it('marks the save complete', () => {
      expect(formReducer(editing, { type: SAVE_SUCCESS })).toEqual({
        ...editing,
        saveState: 'complete',
        errors: {},
      });
    });

    it('records the field errors of a failed save', () => {
      const errors = { bio: { userMessage: 'Too long' } };
      expect(formReducer(editing, { type: SAVE_FAILURE, errors })).toEqual({
        ...editing,
        saveState: 'error',
        errors,
      });
    });

    it('resets the save state and errors, keeping the form open', () => {
      const failed = formReducer(editing, { type: SAVE_FAILURE, errors: { bio: { userMessage: 'Too long' } } });
      expect(formReducer(failed, { type: SAVE_RESET })).toEqual({
        ...editing,
        saveState: null,
        errors: {},
      });
    });
  });
});
