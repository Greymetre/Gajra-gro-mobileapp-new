import {ActionType} from '../action-type';
import {Action} from '../actions/login';

const initialState = null;

const loginReducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN:
      return action.payload;

    case ActionType.UPDATE_INFO:
      return action.payload;

    // case ActionType.UPDATE_INFO_EMAIL:
    //   return {...state, Email: action.payload};

    case ActionType.LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default loginReducer;
