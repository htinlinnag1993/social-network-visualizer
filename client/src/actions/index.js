import axios from 'axios';
import { FETCH_RANDOM_SN } from './types';

export const fetchRandomSN = () => async dispatch => {
    const res = await axios.get('/api/generate/random-profiles');
    dispatch({
        type: FETCH_RANDOM_SN,
        // payload: res
        payload: res.data
    });
};
