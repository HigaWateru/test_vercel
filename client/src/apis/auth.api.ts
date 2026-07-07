import { type Todo, type IProject, type IUser, type IMember, type MyTask } from "@/utils/types"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    name: string
    email: string
    password: string
}

export const fetchData = createAsyncThunk<IUser[]>('auth/fetchData', async() => {
    const response = await axios.get<IUser[]>('http://localhost:3000/users')
    return response.data
})

export const login = createAsyncThunk<IUser, LoginPayload, {rejectValue: {email: string, password: string}}>("auth/login", async(payload, {rejectWithValue}) => {
    try {
        const response = await axios.get<IUser[]>("http://localhost:3000/users")
        const foundUser = response.data.find((user) => user.email === payload.email)
        if(!foundUser) return rejectWithValue({email: "Email không tồn tại", password: ''})
        if(foundUser.password !== payload.password) return rejectWithValue({email: '', password: 'Mật khẩu không đúng'})
        localStorage.setItem("currentUser", foundUser.id)
        return foundUser
    } catch {
        return rejectWithValue({email: '', password: 'Lỗi server'})
    }
})
export const register = createAsyncThunk<IUser, RegisterPayload, {rejectValue: {email: string, password: string}}>("auth/register", async(payload, {rejectWithValue}) => {
    try {
        const response = await axios.get<IUser[]>("http://localhost:3000/users")
        const exists = response.data.find((user) => user.email === payload.email)
        if(exists) return rejectWithValue({email: "Email đã tồn tại", password: ''})

        const newUser: IUser = {
            id: String(Date.now()),
            username: payload.name,
            email: payload.email,
            password: payload.password,
            projects: [],
        }
        await axios.post("http://localhost:3000/users", newUser)
        localStorage.setItem("currentUser", newUser.id)
        return newUser
    } catch {
        return rejectWithValue({email: '', password: 'Lỗi server'})
    }
})

export const fetchProject = createAsyncThunk<{data: IProject[], total: number}, {page: number, limit: number, search: string}>('auth/fetchProject', async({page, limit, search}) => {
    const userID = localStorage.getItem('currentUser')
    if(!userID) return {data: [], total: 0}
    const response = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)
    const projectData = response.data.projects

    const filtered = projectData.filter(project => project.name.toLowerCase().includes(search.toLowerCase()))

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedProject = filtered.slice(start, end)
    return {data: paginatedProject, total: filtered.length}
})

export const addProject = createAsyncThunk<IProject, {name: string, image: string, description: string}, {rejectValue: {name: string, description: string}}>("project/add", async(payload, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem("currentUser")
        if(!userID) return rejectWithValue({name: 'Không tìm thấy người dùng hiện tại', description: ''})
        const { data: userData } = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)
        const exitst = userData.projects.some(project => project.name.toLowerCase().trim() === payload.name.toLowerCase())
        if(exitst) return rejectWithValue({name: 'Tên dự án đã tồn tại', description: ''})
        if(payload.description.trim().length < 20) return rejectWithValue({name: '', description: 'Mô tả phải tối thiểu 20 kí tự'})
        const newProject: IProject = {
            id: userData.projects.length > 0 ? Math.max(...userData.projects.map(project => Number(project.id))) + 1 : 1,
            name: payload.name,
            image: payload.image,
            description: payload.description,
            todos: [],
            members: [],
        }
        const updatedUser: IUser = {...userData, projects: [...userData.projects, newProject]}
        await axios.put(`http://localhost:3000/users/${userID}`, updatedUser)
        return newProject
    } catch {
        return rejectWithValue({name: 'Lỗi khi thêm dự án', description: ''})
    }
})

export const uploadImg = async(file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "re_upload")
    const response = await axios.post("https://api.cloudinary.com/v1_1/dxkw3nupk/image/upload",formData)
    return response.data.secure_url
}

export const deleteProject = createAsyncThunk("project/delete", async(id: number, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem("currentUser")
        if(!userID) return rejectWithValue("Không tìm thấy người dùng hiện tại")
        const { data: userData } = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)
        const updatedProjects = userData.projects.filter((project) => project.id !== id)
        await axios.put(`http://localhost:3000/users/${userID}`, {...userData, projects: updatedProjects})
        return id
    } catch {
        return rejectWithValue("Lỗi khi xoá dự án")
    }
})

export const updateProject = createAsyncThunk('project/update', async(payload: {id: number, name: string, image: string, description: string}, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem("currentUser")
        if(!userID) return rejectWithValue({name: 'Không tìm thấy người dùng hiện tại', description: ''})
        const { data: userData } = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)
        const duplicated = userData.projects.find(project => project.name.toLocaleLowerCase() === payload.name.toLocaleLowerCase() && project.id !== payload.id)
        if(duplicated) return rejectWithValue({name: 'Tên dự án đã tồn tại', description: ''})
        const updatedProjects = userData.projects.map(project => project.id === payload.id ? {...project, name: payload.name, image: payload.image, description: payload.description} : project)
        await axios.put(`http://localhost:3000/users/${userID}`, {...userData, projects: updatedProjects})
        return payload
    } catch {
        return rejectWithValue({name: '', description: 'Lỗi cập nhật dự án'})
    }
})

export const fetchTodo = createAsyncThunk<IProject, {projectId: number, search: string }>('auth/fetchTodo', async({projectId, search}) => {
    const userID = localStorage.getItem('currentUser')
    if(!userID) throw new Error('No current user')

    const response = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)
    const project = response.data.projects.find((p) => p.id === projectId)
    if(!project) throw new Error('Project not found')

    const filteredTodos = project.todos.filter(todo => todo.title.toLowerCase().includes(search.toLowerCase())) || []
    return {...project, todos: filteredTodos}
  }
)

export const addTodo = createAsyncThunk<IProject, {projectId: string, newTodo: Omit<Todo, 'id'>}, {rejectValue: string}>('todo/addTodo', async({projectId, newTodo}, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem('currentUser')
        if(!userID) return rejectWithValue('Không tìm thấy người dùng hiện tại')
        const { data: userData } = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)
        const projectIndex = userData.projects.findIndex(project => project.id === Number(projectId))
        if(projectIndex === -1) return rejectWithValue('Không tìm thấy dự án')
        const project = userData.projects[projectIndex]
        const isDuplicateTitle = project.todos.some(todo => todo.title.trim().toLowerCase() === newTodo.title.trim().toLowerCase())
        if(isDuplicateTitle) return rejectWithValue('Tên nhiệm vụ không được trùng')
        const todoWithId: Todo = {id: `t${Date.now()}`,...newTodo}
        const updatedProject: IProject = {...project,todos: [...project.todos, todoWithId]}
        const updatedUser: IUser = {...userData, projects: userData.projects.map(project => project.id === updatedProject.id ? updatedProject : project)}
        await axios.put(`http://localhost:3000/users/${userID}`, updatedUser)
        return updatedProject
    } catch (error) {
        console.error('Error adding todo:', error)
        return rejectWithValue('Lỗi hệ thống khi thêm nhiệm vụ')
    }
})

export const updateTodo = createAsyncThunk<IProject, {projectId: string, todoId: string, updated: Omit<Todo, 'id'>}, {rejectValue: string}>('todo/updateTodo', async({projectId, todoId, updated}, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem('currentUser')
        if(!userID) return rejectWithValue('Không tìm thấy người dùng hiện tại')
        const { data: userData } = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)
        const projectIndex = userData.projects.findIndex(project => project.id === Number(projectId))
        if(projectIndex === -1) return rejectWithValue('Không tìm thấy dự án')
        const project = userData.projects[projectIndex]

        const exists = project.todos.some(todo => todo.id !== todoId && todo.title.trim().toLowerCase() === updated.title.trim().toLowerCase())
        if(exists) return rejectWithValue('Tên nhiệm vụ không được trùng')

        const updatedTodos = project.todos.map(todo => todo.id === todoId ? {id: todoId, ...updated} : todo)
        const updatedProject: IProject = {...project, todos: updatedTodos}
        const updatedUser: IUser = {...userData, projects: userData.projects.map(project => project.id === updatedProject.id ? updatedProject : project)}
        await axios.put(`http://localhost:3000/users/${userID}`, updatedUser)
        return updatedProject
    } catch (error) {
        console.error('Error updating todo:', error)
        return rejectWithValue('Lỗi hệ thống khi sửa nhiệm vụ')
    }
})

export const deleteTodo = createAsyncThunk<IProject, {projectId: string, todoId: string}, {rejectValue: string}>('todo/deleteTodo', async({projectId, todoId}, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem('currentUser')
        if(!userID) return rejectWithValue('Không tìm thấy người dùng hiện tại')
        const {data: userData} = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)

        const projectIndex = userData.projects.findIndex(project => project.id === Number(projectId))
        if(projectIndex === -1) return rejectWithValue('Không tìm thấy dự án')
        const project = userData.projects[projectIndex]

        const updatedTodos = project.todos.filter(todo => todo.id !== todoId)
        const updatedProject: IProject = {...project, todos: updatedTodos}
        const updatedUser: IUser = {...userData, projects: userData.projects.map(p => p.id === updatedProject.id ? updatedProject : p)}
        await axios.put(`http://localhost:3000/users/${userID}`, updatedUser)
        return updatedProject
    } catch (error) {
        console.error('Error deleting todo:', error)
        return rejectWithValue('Lỗi hệ thống khi xoá nhiệm vụ')
    }
})

export const addMember = createAsyncThunk<IProject, {projectId: string, email: string, role: string}, {rejectValue: string}>('member/addMember', async({projectId, email, role}, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem('currentUser')
        if(!userID) return rejectWithValue('Không tìm thấy người dùng hiện tại')
        const [{data: currentUser}, {data: allUsers}] = await Promise.all([
            axios.get<IUser>(`http://localhost:3000/users/${userID}`),
            axios.get<IUser[]>(`http://localhost:3000/users`),
        ])

        const projectIndex = currentUser.projects.findIndex(project => project.id === Number(projectId))
        if(projectIndex === -1) return rejectWithValue('Không tìm thấy dự án')
        const userToAdd = allUsers.find(user => user.email.trim().toLowerCase() === email.trim().toLowerCase())
        if(!userToAdd) return rejectWithValue('Email không tồn tại trong hệ thống')
        const project = currentUser.projects[projectIndex]
        const exists = project.members.some(member => member.id === userToAdd.id)
        if(exists) return rejectWithValue('Thành viên đã tồn tại trong dự án')
        const rawName: string | undefined = (userToAdd as unknown as {name?: string}).name
        const baseUsername = userToAdd.username || rawName || userToAdd.email.split('@')[0]
        const composedUsername = userToAdd.username && rawName && userToAdd.username !== rawName ? `${userToAdd.username} (${rawName})` : baseUsername
        const newMember: IMember = {
            id: userToAdd.id,
            username: composedUsername,
            email: userToAdd.email,
            role: role.trim() || 'Member'
        }

        const updatedProject: IProject = {...project, members: [...project.members, newMember]}
        const updatedUser: IUser = {...currentUser, projects: currentUser.projects.map(project => project.id === updatedProject.id ? updatedProject : project)}
        await axios.put(`http://localhost:3000/users/${userID}`, updatedUser)
        return updatedProject
    } catch (error) {
        console.error('Error adding member:', error)
        return rejectWithValue('Lỗi hệ thống khi thêm thành viên')
    }
})

export const updateMember = createAsyncThunk<IProject, {projectId: string, memberId: string, role: string}, {rejectValue: string}>('member/updateMember', async({projectId, memberId, role}, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem('currentUser')
        if(!userID) return rejectWithValue('Không tìm thấy người dùng hiện tại')
        const {data: currentUser} = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)

        const projectIndex = currentUser.projects.findIndex(project => project.id === Number(projectId))
        if(projectIndex === -1) return rejectWithValue('Không tìm thấy dự án')
        const project = currentUser.projects[projectIndex]

        const updatedMembers = project.members.map(member => (member.id === memberId ? {...member, role} : member))
        const updatedProject: IProject = {...project, members: updatedMembers}
        const updatedUser: IUser = {...currentUser, projects: currentUser.projects.map(project => project.id === updatedProject.id ? updatedProject : project)}
        await axios.put(`http://localhost:3000/users/${userID}`, updatedUser)
        return updatedProject
    } catch (error) {
        console.error('Error updating member:', error)
        return rejectWithValue('Lỗi hệ thống khi sửa thành viên')
    }
})

export const deleteMember = createAsyncThunk<IProject, {projectId: string, memberId: string}, {rejectValue: string}>('member/deleteMember', async({projectId, memberId}, {rejectWithValue}) => {
    try {
        const userID = localStorage.getItem('currentUser')
        if(!userID) return rejectWithValue('Không tìm thấy người dùng hiện tại')
        const {data: currentUser} = await axios.get<IUser>(`http://localhost:3000/users/${userID}`)

        const projectIndex = currentUser.projects.findIndex((p) => p.id === Number(projectId))
        if(projectIndex === -1) return rejectWithValue('Không tìm thấy dự án')
        const project = currentUser.projects[projectIndex]

        const updatedMembers = project.members.filter(member => member.id !== memberId)
        const updatedProject: IProject = {...project, members: updatedMembers}
        const updatedUser: IUser = {...currentUser, projects: currentUser.projects.map(project => project.id === updatedProject.id ? updatedProject : project)}
        await axios.put(`http://localhost:3000/users/${userID}`, updatedUser)
        return updatedProject
    } catch (error) {
        console.error('Error deleting member:', error)
        return rejectWithValue('Lỗi hệ thống khi xoá thành viên')
    }
})

export const fetchMyTask = createAsyncThunk<MyTask, {search: string}>('auth/fetchMyTask', async({search}) => {
    const userID = localStorage.getItem('currentUser')
    if(!userID) throw new Error('No current user')
    const [{data: currentUser}, {data: allUsers}] = await Promise.all([
        axios.get<IUser>(`http://localhost:3000/users/${userID}`),
        axios.get<IUser[]>(`http://localhost:3000/users`)
    ])

    const term = (search || '').toLowerCase().trim()
    const resultProjects: MyTask['projects'] = []

    for(const user of allUsers) for(const project of user.projects) {
        const assignedTodos = project.todos.filter(todo => {
            const matchesAssignee = todo.personChange?.email?.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
            const matchesSearch = term ? todo.title.toLowerCase().includes(term) : true
            return matchesAssignee && matchesSearch
        })
        if(assignedTodos.length > 0) resultProjects.push({
            id: project.id,
            name: project.name,
            tasks: assignedTodos.map(todo => ({
                id: todo.id,
                name: todo.title,
                priority: todo.priority,
                status: todo.status,
                startDate: todo.startDate,
                endDate: todo.endDate,
                progress: todo.progress
            }))
        })    
    }
    return {projects: resultProjects}
})

export const changeStatus = createAsyncThunk<IUser[], {taskID: string}>('auth/changeStatus', async({taskID}) => {
    const response = await axios.get<IUser[]>("http://localhost:3000/users")
    for(const user of response.data) for(const project of user.projects) {
        const foundTask = project.todos.find(todo => todo.id === taskID)
        if(foundTask) {
            if(foundTask.status === 'in-progress') foundTask.status = 'pending'
            else if(foundTask.status === 'pending') foundTask.status = 'in-progress'
        }
        await axios.put(`http://localhost:3000/users/${user.id}`, user)
    }
    return response.data
})