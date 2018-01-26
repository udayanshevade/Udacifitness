import { RECEIVE_ENTRIES, ADD_ENTRY } from '../actions';

const initialState = {
  entries: {},
};

const entriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ENTRIES: {
      const { entries } = action;
      return {
        ...state,
        entries: {
          ...state.entries,
          ...entries,
        },
      };
    }
    case ADD_ENTRY: {
      const { entry } = action;
      return {
        ...state,
        entries: {
          ...state.entries,
          ...entry,
        },
      };
    }
    default:
      return state;
  }
};

export default entriesReducer;
