import {configureStore} from '@reduxjs/toolkit'
import projectDetailSlice from '../slices/projectDetail.slice'
import projectListSlice from '../slices/projectList.slice'
import accountSlice from '../slices/account.slice'
import myTaskSlice from '../slices/mytask.slice'
export const store = configureStore({
    reducer: {
        projectList: projectListSlice,
        projectDetail: projectDetailSlice,
        account: accountSlice,
        mytask: myTaskSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch