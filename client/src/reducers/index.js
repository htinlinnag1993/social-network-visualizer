import { combineReducers } from 'redux';
import randomProfilesReducer from './randomProfilesReducer';
import authReducer from './authReducer';

export default combineReducers({
    randomProfiles: randomProfilesReducer,
    auth: authReducer
});