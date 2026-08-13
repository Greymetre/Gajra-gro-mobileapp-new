import {ActionType} from '../action-type';

interface LoginAction {
  type: ActionType.LOGIN;
  payload: any;
}

interface RegisterAction {
  type: ActionType.REGISTER;
  payload: any;
}
interface UpdateInfoAction {
  type: ActionType.UPDATE_INFO;
  payload: any;
}

interface LogoutAction {
  type: ActionType.LOGOUT;
}

export type Action = LoginAction | RegisterAction| UpdateInfoAction | LogoutAction;
