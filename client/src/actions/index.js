import axios from 'axios';
import { FETCH_RANDOM_SN, FETCH_USER } from './types';

export const fetchRandomSN = () => async dispatch => {
    const res = await axios.get('/api/generate/random-profiles');
    dispatch({
        type: FETCH_RANDOM_SN,
        // payload: res
        payload: res.data
    });
};

export const fetchUser = () => async dispatch => {
    console.log("fetchUser is called");
    const res = await axios.get('/api/current_user');
    dispatch({
        type: FETCH_USER,
        payload: res.data
    });
    
};