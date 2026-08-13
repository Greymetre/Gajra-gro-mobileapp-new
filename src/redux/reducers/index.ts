import {combineReducers} from 'redux';
import loginReducers from './loginReducer';
import stackReducer from './stackReducer';

const rootReducer = combineReducers({
  loginReducers: loginReducers,
  stackReducer: stackReducer,
});

export default rootReducer;

export type ApplicationState = ReturnType<typeof rootReducer>;
