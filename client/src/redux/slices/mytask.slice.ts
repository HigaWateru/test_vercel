import { fetchMyTask } from "@/apis/auth.api"
import type { MyTask } from "@/utils/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface State {
    projects: {
        id: number
        name: string
        tasks: {
            id: string
            name: string
            priority: 'low' | 'medium' | 'high'
            status: 'to-do' | 'in-progress' | 'pending' | 'done'
            startDate: string
            endDate: string
            progress: 'scheduled' | 'in-progress' | 'delayed'
        }[]
    }[] | null,
    loading: boolean
}

const initialState: State = {
    projects: null,
    loading: false
}

const myTaskSlice = createSlice({
    name: 'myTask',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(fetchMyTask.pending, state => {
            state.loading = true
        })
        .addCase(fetchMyTask.fulfilled, (state, action: PayloadAction<MyTask>) => {
            state.projects = action.payload.projects
            state.loading = false
        })
        .addCase(fetchMyTask.rejected, state => {
            state.loading = false
        })
    }
})
export default myTaskSlice.reducer