import {ActionType} from '../action-type';
import {ActionStack} from '../actions/stackActions';

const initialState = 'auth';

const stackReducer = (state: string = initialState, action: ActionStack) => {
  switch (action.type) {
    case ActionType.STACK_INSERT:
      return action.payload;

    case ActionType.STACK_UPDATE:
      return action.payload;

    case ActionType.STACK_DELETE:
      return initialState;

    default:
      return state;
  }
};

export default stackReducer;
