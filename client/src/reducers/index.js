import { combineReducers } from 'redux';
import randomProfilesReducer from './randomProfilesReducer';
import authReducer from './authReducer';
import generalNetworksReducer from './generalNetworksReducer';

export default combineReducers({
    randomProfiles: randomProfilesReducer,
    auth: authReducer,
    generalNetworks: generalNetworksReducer
});