import { FETCH_GENERAL_NETWORKS } from '../actions/types';

export default function(state = [], action) {
    // console.log(action);
    // console.log(state);
    switch (action.type) {
        case FETCH_GENERAL_NETWORKS:
            return action.payload;
        default:
            return state;
    }
}