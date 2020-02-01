import { combineReducers } from 'redux';
import randomProfilesReducer from './randomProfilesReducer';

export default combineReducers({
    randomProfiles: randomProfilesReducer
});