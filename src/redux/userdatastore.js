import {configureStore} from '@reduxjs/toolkit';

const getNewreUserData = (state = {}, action) =>{
    switch (action.type) {
        case "newreUsers":
            return action.data;
        default:
            return false;
    }
}


export const newreUserDataStore = configureStore({
    reducer:{
        "newreuserdata" : getNewreUserData 
    }
})