import {Dispatch} from 'redux';
import {ActionType} from '../action-type';
import {Action} from '../actions/login';
import {ActionStack} from '../actions/stackActions';

export const login = (logindata: any): any => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({type: ActionType.LOGIN, payload: logindata});
  };
};

export const userLogout = (logoutdata: any): any => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({type: ActionType.LOGOUT, payload: logoutdata});
  };
};

export const register = (registerdata: any): any => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({type: ActionType.REGISTER, payload: registerdata});
  };
};

export const stackInsert = (data: string): any => {
  return (dispatch: Dispatch<ActionStack>) => {
    dispatch({type: ActionType.STACK_INSERT, payload: data});
  };
};
export const stackUpdate = (data: string): any => {
  return (dispatch: Dispatch<ActionStack>) => {
    dispatch({type: ActionType.STACK_UPDATE, payload: data});
  };
};
export const StackDelete = (): any => {
  return (dispatch: Dispatch<ActionStack>) => {
    dispatch({type: ActionType.STACK_DELETE});
  };
};
