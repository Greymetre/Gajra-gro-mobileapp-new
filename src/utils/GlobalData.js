import axios from 'axios';
import {Share} from 'react-native';

export default class GlobalData {
  constructor() {
    // super();
    global.userToken;
    global.userId;
    global.menuView;
    global.mainView;
    global.reviewView;
    global.instructionId;

  }
}

export function monthShort(value) {
  switch (value) {
    case 'January':
      return 'Jan';
    case 'February':
      return 'Feb';
    case 'March':
      return 'Mar';
    case 'April':
      return 'Apr';
    case 'May':
      return 'May';
    case 'June':
      return 'Jun';
    case 'July':
      return 'Jul';
    case 'August':
      return 'Aug';
    case 'September':
      return 'Sep';
    case 'October':
      return 'Oct';
    case 'November':
      return 'Nov';
    case 'December':
      return 'Dec';
    default:
      return '';
  }
}

