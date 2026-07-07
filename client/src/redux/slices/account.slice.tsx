import { login, register } from "@/apis/auth.api"
import type { IUser } from "@/utils/types"
import { createSlice } from "@reduxjs/toolkit"

interface State {
    currentUser: IUser | null
    error: {email: string, password: string} | null
}

const initialState: State = {
    currentUser: null,
    error: null,
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null
            localStorage.removeItem("currentUser")
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.currentUser = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload || {email: '', password: ''}
            })

            .addCase(register.pending, (state) => {
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.currentUser = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload || {email: '', password: ''}
            })

    }
})

export default accountSlice.reducer
export const { logout } = accountSlice.actions
