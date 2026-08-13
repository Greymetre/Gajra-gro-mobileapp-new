import {ActionType} from '../action-type';

interface StackInsertAction {
  type: ActionType.STACK_INSERT;
  payload: string;
}
interface StackUpdateAction {
  type: ActionType.STACK_UPDATE;
  payload: string;
}
interface StackDeleteAction {
  type: ActionType.STACK_DELETE;
}

export type ActionStack =
  | StackInsertAction
  | StackUpdateAction
  | StackDeleteAction;
