import generalNetworks from '../apis/general-networks';
import currentUser from '../apis/current-user';
// import axios from 'axios';
import { FETCH_RANDOM_SN, FETCH_USER, FETCH_GENERAL_NETWORKS, DELETE_GENERAL_NETWORK } from './types';

export const fetchUser = () => async dispatch => {
    console.log("fetchUser is called");
    const res = await currentUser.get('/');
    dispatch({
        type: FETCH_USER,
        payload: res.data
    });
    
};

export const fetchGeneralNetworks = () => async dispatch => {
    const res = await generalNetworks.get('/general-networks');
    dispatch({ type: FETCH_GENERAL_NETWORKS, payload: res.data });
}

export const submitNewNetwork = (values, history) => async dispatch => {
    const res = await generalNetworks.post('/general-networks', values);

    history.push('/dashboard');
    dispatch({ type: FETCH_USER, payload: res.data });
}

export const deleteGeneralNetwork = (id, myGeneralNetworks) => async dispatch => {
    const res = await generalNetworks.delete(`/general-networks/${id}`);
    // console.log(res.data);
    if (res.status === 200) {
        var newArr = myGeneralNetworks.filter((item, index) => {
            return item._id !== id;
        });
        dispatch({ type: FETCH_GENERAL_NETWORKS, payload: newArr });
    }
}




// export const fetchRandomSN = () => async dispatch => {
//     // const res = await axios.get('/api/generate/random-profiles');
//     const res = await generalNetworks.get('/generate/random-profiles');
//     dispatch({
//         type: FETCH_RANDOM_SN,
//         payload: res.data
//     });
// };