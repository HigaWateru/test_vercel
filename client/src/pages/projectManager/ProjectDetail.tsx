import { addTodo, deleteTodo, fetchTodo, updateTodo } from "@/apis/auth.api"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Breadcrumb from "@/components/Breadcrumb"
import ProjectIntroduce from "@/components/ProjectIntroduce"
import { useHead } from "@/hooks/useHead"
import type { AppDispatch, RootState } from "@/redux/store"
import type { IMember, Todo } from "@/utils/types"
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons"
import { Modal, Select } from "antd"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

export default function ProjectDetail() {
  const [search, setSearch] = React.useState('')
  const project = useSelector((state: RootState) => state.projectDetail.project)
  const todos = useSelector((state: RootState) => state.projectDetail.project?.todos) || []
  const dispatch = useDispatch<AppDispatch>()
  const {id} = useParams<{id: string}>()

  // SEO: Set meta tags for project detail page
  useHead({
    title: project ? `${project.name} | Project Manager` : 'Chi tiết Dự án | Project Manager',
    description: project ? project.description : 'Xem chi tiết dự án, danh sách nhiệm vụ, thành viên và quản lý dự án.',
    keywords: project ? `${project.name}, dự án, nhiệm vụ, chi tiết dự án` : 'chi tiết dự án, dự án, nhiệm vụ',
    canonical: `https://project-manager.vercel.app/projects/${id}`,
    ogTitle: project ? `${project.name} | Project Manager` : 'Chi tiết Dự án | Project Manager',
    ogDescription: project ? project.description : 'Xem chi tiết dự án, danh sách nhiệm vụ, thành viên và quản lý dự án.',
    ogUrl: `https://project-manager.vercel.app/projects/${id}`
  })

  const [tableOpt, setTableOpt] = React.useState<{todo: boolean, inProgress: boolean, pending: boolean, done: boolean}>
    ({todo: true, inProgress: true, pending: false, done: false})
  const [formData, setFormData] = React.useState<{
    name: string,
    personChange: string,
    status: 'to-do' | 'in-progress' | 'pending' | 'done' | null,
    startDate: string,
    endDate: string,
    priority: 'low' | 'medium' | 'high' | null,
    progress: 'scheduled' | 'in-progress' | 'delayed' | null
  }>({name: '', personChange: '', status: null, startDate: '', endDate: '', priority: null, progress: null})
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [optModal, setOptModal] = React.useState<'add' | 'edit'>('add')
  const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false)

  const [errorMol, setErrorMol] = React.useState<{name: string, personChange: string, status: string, startDate: string, endDate: string, priority: string, progress: string}>
    ({name: '', personChange: '', status: '', startDate: '', endDate: '', priority: '', progress: ''})

  const validate = (): boolean => {
    const errors = {name: '', personChange: '', status: '', startDate: '', endDate: '', priority: '', progress: ''}
    if (!formData.name.trim()) errors.name = 'Tên nhiệm vụ không được để trống'
    if (!formData.personChange) errors.personChange = 'Vui lòng chọn người phụ trách'
    if (!formData.status) errors.status = 'Vui lòng chọn status nhiệm vụ'
    if (!formData.startDate) errors.startDate = 'Vui lòng chọn ngày bắt đầu'
    else if (new Date() > new Date(formData.startDate) && optModal === 'add') errors.startDate = 'Ngày bắt đầu phải lớn hơn thời gian hiện tại'
    if (!formData.endDate) errors.endDate = 'Vui lòng chọn thời gian hạn chót'
    else if (new Date(formData.endDate) < new Date(formData.startDate)) errors.endDate = 'Hạn chót không hợp lệ'
    if (!formData.priority) errors.priority = 'Vui lòng chọn độ ưu tiên'
    if (!formData.progress) errors.progress = 'Vui lòng chọn tiến độ'
    setErrorMol(errors)
    return !errors.name && !errors.personChange && !errors.status && !errors.startDate && !errors.endDate && !errors.priority && !errors.progress
  }


  const [ID, setID] = React.useState<string>('')
  const [sort, setSort] = React.useState<'endDate' | 'priority' | null>(null)
  const handleSort = (tasks: Todo[]) => {
    if (!sort) return tasks
    const sortedTask = [...tasks]
    if (sort === 'endDate') sortedTask.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    if (sort === 'priority') {
      const order = {high: 1, medium: 2, low: 3}
      sortedTask.sort((a, b) => order[a.priority] - order[b.priority])
    }
    return sortedTask
  }

  React.useEffect(() => {
    const timeout = setTimeout(() => dispatch(fetchTodo({projectId: Number(id), search})), 200)
    return () => clearTimeout(timeout)
  }, [dispatch, id, search])

  return <div className="h-[100vh] w-[100vw] flex flex-col justify-between">
    <Header />
    <main className="p-10 flex flex-col items-center gap-6 overflow-auto">
      <div className="w-[1200px] text-[16px] flex flex-col gap-6">
        <Breadcrumb projectName={project?.name} />
        <ProjectIntroduce />
        <div className="flex justify-between">
          <button onClick={() => {
            setOptModal('add')
            setOpenModal(true)
          }} className="bg-[#007bff] text-white px-3 py-1 rounded-md cursor-pointer">+ Thêm nhiệm vụ</button>
          <div className="flex gap-4">
            <Select value={sort} style={{width: 200, height: 40}} placeholder="Sắp xếp theo" optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={[
              { value: 'endDate', label: 'Hạn chót' },
              { value: 'priority', label: 'Độ ưu tiên' }
            ]} onChange={value => setSort(value as 'endDate' | 'priority')} />
            <input value={search} onChange={event => setSearch(event.target.value)} className="border border-gray-300 rounded-md px-3 py-1 outline-none w-[300px]" type="text" placeholder="Tìm kiếm nhiệm vụ" />
          </div>
        </div>
      </div>
      <div className="border w-[1200px] border-gray-100 rounded-md p-6 flex flex-col gap-6 shadow-xl text-[16px]">
        <h2 className="text-xl font-semibold">Danh sách nhiệm vụ</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Tên Nhiệm Vụ</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Người phụ trách</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Ưu tiên</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Ngày bắt đầu</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Hạn chót</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Tiến độ</th>
              <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr onClick={() => setTableOpt({ ...tableOpt, todo: !tableOpt.todo })} className="border border-gray-300"><td className="p-2 font-semibold text-[14px] cursor-pointer">{tableOpt.todo ? <CaretDownOutlined /> : <CaretRightOutlined />} Todo ({todos.filter((todo: Todo) => todo.status === 'to-do' && todo.title.toLowerCase().includes(search.toLowerCase())).length})</td></tr>
            {handleSort(todos.filter((todo: Todo) => todo.status === 'to-do' && todo.title.toLowerCase().includes(search.toLowerCase()))).map((todo: Todo) => (
              <tr key={todo.id} className={tableOpt.todo ? '' : 'hidden'}>
                <td className="p-2 border border-gray-300">{todo.title}</td>
                <td className="text-center border border-gray-300">{todo.personChange.username}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.priority === 'low' ? 'bg-[#0dcaf0]' : todo.priority === 'medium' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.priority === 'low' ? 'Thấp' : todo.priority === 'medium' ? 'Trung bình' : 'Cao'}</span></td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.startDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.endDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.progress === 'scheduled' ? 'bg-[#198754]' : todo.progress === 'in-progress' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.progress === 'scheduled' ? 'Đúng tiến độ' : todo.progress === 'in-progress' ? 'Có rủi ro' : 'Trễ hạn'}</span></td>
                <td className="text-center border border-gray-300">
                  <div className="flex justify-center gap-3 ">
                    <button onClick={() => {
                      setOptModal('edit')
                      setFormData({name: todo.title, personChange: todo.personChange.username, status: todo.status, startDate: todo.startDate, endDate: todo.endDate, priority: todo.priority, progress: todo.progress})
                      setID(todo.id)
                      setOpenModal(true)
                    }} className="p-3 py-1 bg-[#ffc107] text-[14px] rounded-md cursor-pointer">Sửa</button>
                    <button onClick={() => {
                      setConfirmDelete(true)
                      setID(todo.id)
                    }} className="px-3 py-1 bg-[#dc3545] text-[14px] text-white rounded-md cursor-pointer">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            <tr onClick={() => setTableOpt({...tableOpt, inProgress: !tableOpt.inProgress})} className="border border-gray-300"><td className="p-2 font-semibold text-[14px] cursor-pointer">{tableOpt.inProgress ? <CaretDownOutlined /> : <CaretRightOutlined />} In Progress ({todos.filter((todo: Todo) => todo.status === 'in-progress' && todo.title.toLowerCase().includes(search.toLowerCase())).length})</td></tr>
            {handleSort(todos.filter((todo: Todo) => todo.status === 'in-progress' && todo.title.toLowerCase().includes(search.toLowerCase()))).map((todo: Todo) => (
              <tr key={todo.id} className={tableOpt.inProgress ? '' : 'hidden'}>
                <td className="p-2 border border-gray-300">{todo.title}</td>
                <td className="text-center border border-gray-300">{todo.personChange.username}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.priority === 'low' ? 'bg-[#0dcaf0]' : todo.priority === 'medium' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.priority === 'low' ? 'Thấp' : todo.priority === 'medium' ? 'Trung bình' : 'Cao'}</span></td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.startDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.endDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.progress === 'scheduled' ? 'bg-[#198754]' : todo.progress === 'in-progress' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.progress === 'scheduled' ? 'Đúng tiến độ' : todo.progress === 'in-progress' ? 'Có rủi ro' : 'Trễ hạn'}</span></td>
                <td className="text-center border border-gray-300">
                  <div className="flex justify-center gap-3 ">
                    <button onClick={() => {
                      setOptModal('edit')
                      setFormData({name: todo.title, personChange: todo.personChange.username, status: todo.status, startDate: todo.startDate, endDate: todo.endDate, priority: todo.priority, progress: todo.progress})
                      setID(todo.id)
                      setOpenModal(true)
                    }} className="p-3 py-1 bg-[#ffc107] text-[14px] rounded-md cursor-pointer">Sửa</button>
                    <button onClick={() => {
                      setConfirmDelete(true)
                      setID(todo.id)
                    }} className="px-3 py-1 bg-[#dc3545] text-[14px] text-white rounded-md cursor-pointer">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            <tr onClick={() => setTableOpt({...tableOpt, pending: !tableOpt.pending})} className="border border-gray-300"><td className="p-2 font-semibold text-[14px] cursor-pointer">{tableOpt.pending ? <CaretDownOutlined /> : <CaretRightOutlined />} Pending ({todos.filter((todo: Todo) => todo.status === 'pending' && todo.title.toLowerCase().includes(search.toLowerCase())).length})</td></tr>
            {handleSort(todos.filter((todo: Todo) => todo.status === 'pending' && todo.title.toLowerCase().includes(search.toLowerCase()))).map((todo: Todo) => (
              <tr key={todo.id} className={tableOpt.pending ? '' : 'hidden'}>
                <td className="p-2 border border-gray-300">{todo.title}</td>
                <td className="text-center border border-gray-300">{todo.personChange.username}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.priority === 'low' ? 'bg-[#0dcaf0]' : todo.priority === 'medium' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.priority === 'low' ? 'Thấp' : todo.priority === 'medium' ? 'Trung bình' : 'Cao'}</span></td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.startDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.endDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.progress === 'scheduled' ? 'bg-[#198754]' : todo.progress === 'in-progress' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.progress === 'scheduled' ? 'Đúng tiến độ' : todo.progress === 'in-progress' ? 'Có rủi ro' : 'Trễ hạn'}</span></td>
                <td className="text-center border border-gray-300">
                  <div className="flex justify-center gap-3 ">
                    <button onClick={() => {
                      setOptModal('edit')
                      setFormData({name: todo.title, personChange: todo.personChange.username, status: todo.status, startDate: todo.startDate, endDate: todo.endDate, priority: todo.priority, progress: todo.progress})
                      setID(todo.id)
                      setOpenModal(true)
                    }} className="p-3 py-1 bg-[#ffc107] text-[14px] rounded-md cursor-pointer">Sửa</button>
                    <button onClick={() => {
                      setConfirmDelete(true)
                      setID(todo.id)
                    }} className="px-3 py-1 bg-[#dc3545] text-[14px] text-white rounded-md cursor-pointer">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            <tr onClick={() => setTableOpt({...tableOpt, done: !tableOpt.done})} className="border border-gray-300"><td className="p-2 font-semibold text-[14px] cursor-pointer">{tableOpt.done ? <CaretDownOutlined /> : <CaretRightOutlined />} Done ({todos.filter((todo: Todo) => todo.status === 'done' && todo.title.toLowerCase().includes(search.toLowerCase())).length})</td></tr>
            {handleSort(todos.filter((todo: Todo) => todo.status === 'done' && todo.title.toLowerCase().includes(search.toLowerCase()))).map((todo: Todo) => (
              <tr key={todo.id} className={tableOpt.done ? '' : 'hidden'}>
                <td className="p-2 border border-gray-300">{todo.title}</td>
                <td className="text-center border border-gray-300">{todo.personChange.username}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.priority === 'low' ? 'bg-[#0dcaf0]' : todo.priority === 'medium' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.priority === 'low' ? 'Thấp' : todo.priority === 'medium' ? 'Trung bình' : 'Cao'}</span></td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.startDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300 text-blue-600">{new Date(todo.endDate).toLocaleDateString('vi-VN')}</td>
                <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${todo.progress === 'scheduled' ? 'bg-[#198754]' : todo.progress === 'in-progress' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                  }`}>{todo.progress === 'scheduled' ? 'Đúng tiến độ' : todo.progress === 'in-progress' ? 'Có rủi ro' : 'Trễ hạn'}</span></td>
                <td className="text-center border border-gray-300">
                  <div className="flex justify-center gap-3 ">
                    <button onClick={() => {
                      setOptModal('edit')
                      setFormData({name: todo.title, personChange: todo.personChange.username, status: todo.status, startDate: todo.startDate, endDate: todo.endDate, priority: todo.priority, progress: todo.progress})
                      setID(todo.id)
                      setOpenModal(true)
                    }} className="p-3 py-1 bg-[#ffc107] text-[14px] rounded-md cursor-pointer">Sửa</button>
                    <button onClick={() => {
                      setConfirmDelete(true)
                      setID(todo.id)
                    }} className="px-3 py-1 bg-[#dc3545] text-[14px] text-white rounded-md cursor-pointer">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
    <Footer />
    <Modal open={openModal} maskClosable={false} okText='Lưu' title={optModal === 'add' ? 'Thêm nhiệm vụ' : 'Sửa nhiệm vụ'} onCancel={() => {
      setOpenModal(false)
      setFormData({name: '', personChange: '', status: null, startDate: '', endDate: '', priority: null, progress: null})
      setErrorMol({name: '', personChange: '', status: '', startDate: '', endDate: '', priority: '', progress: ''})
    }} onOk={async() => {
      if (!validate()) return
      const member = project!.members.find(member => member.username === formData.personChange)
      if (!member) {
        setErrorMol(prev => ({...prev, personChange: "Người phụ trách không hợp lệ"}))
        return
      }
      if (optModal === 'add') {
        try {
          const newTodo: Omit<Todo, "id"> = {
            title: formData.name.trim(),
            personChange: member,
            status: formData.status!,
            startDate: formData.startDate,
            endDate: formData.endDate,
            priority: formData.priority!,
            progress: formData.progress!,
          }
          const result = await dispatch(addTodo({projectId: project!.id.toString(), newTodo}))
          if (addTodo.rejected.match(result)) {
            setErrorMol(prev => ({...prev, name: result.payload as string}))
            return
          }
          setOpenModal(false)
          setFormData({name: "", personChange: "", status: null, startDate: "", endDate: "", priority: null, progress: null})
        } catch {
          console.log('Lỗi thêm nhiệm vụ')
        }
      } else {
        try {
          const updated: Omit<Todo, 'id'> = {
            title: formData.name.trim(),
            personChange: member,
            status: formData.status!,
            startDate: formData.startDate,
            endDate: formData.endDate,
            priority: formData.priority!,
            progress: formData.progress!,
          }
          const result = await dispatch(updateTodo({projectId: project!.id.toString(), todoId: ID, updated}))
          if (updateTodo.rejected.match(result)) {
            setErrorMol(prev => ({...prev, name: result.payload as string}))
            return
          }
          setOpenModal(false)
          setFormData({name: "", personChange: "", status: null, startDate: "", endDate: "", priority: null, progress: null})
        } catch {
          console.log('Lỗi sửa nhiệm vụ')
        }
      }
    }}>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Tên nhiệm vụ</label>
        <input onChange={event => {
          setErrorMol({...errorMol, name: ''})
          setFormData({...formData, name: event.target.value})
        }} value={formData.name} type="text" className="border border-gray-300 rounded-md p-3 outline-none" />
        <p className="text-red-500 text-sm">{errorMol.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Người phụ trách</label>
        <Select value={formData.personChange} style={{ width: 470, height: 50 }} placeholder="Chọn người phụ trách" optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={
          project?.members.map((member: IMember) => ({
            value: member.username, label: member.username
          }))
        } onChange={value => {
          setErrorMol({...errorMol, personChange: ''})
          setFormData({...formData, personChange: value})
        }} />
        <p className="text-red-500 text-sm">{errorMol.personChange}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Trạng thái</label>
        <Select value={formData.status} style={{width: 470, height: 50}} placeholder="Chọn trạng thái nhiệm vụ" optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={[
          { value: 'to-do', label: 'To do' },
          { value: 'in-progress', label: 'In progress' },
          { value: 'pending', label: 'Pending' },
          { value: 'done', label: 'Done' }
        ]} onChange={value => {
          setErrorMol({...errorMol, status: ''})
          setFormData({...formData, status: value})
        }} />
        <p className="text-red-500 text-sm">{errorMol.status}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Ngày bắt đầu</label>
        <input onChange={event => {
          setErrorMol({...errorMol, startDate: ''})
          setFormData({...formData, startDate: event.target.value})
        }} value={formData.startDate} type="date" className="border border-gray-300 rounded-md p-3 outline-none" />
        <p className="text-red-500 text-sm">{errorMol.startDate}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Ngày kết thúc</label>
        <input onChange={event => {
          setErrorMol({...errorMol, endDate: ''})
          setFormData({...formData, endDate: event.target.value})
        }} value={formData.endDate} type="date" className="border border-gray-300 rounded-md p-3 outline-none" />
        <p className="text-red-500 text-sm">{errorMol.endDate}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Độ ưu tiên</label>
        <Select value={formData.priority} style={{width: 470, height: 50}} placeholder="Chọn độ ưu tiên" optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={[
          { value: 'low', label: 'Thấp' },
          { value: 'medium', label: 'Trung bình' },
          { value: 'high', label: 'Cao' }
        ]} onChange={value => {
          setErrorMol({...errorMol, priority: ''})
          setFormData({...formData, priority: value})
        }} />
        <p className="text-red-500 text-sm">{errorMol.priority}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Tiến độ</label>
        <Select value={formData.progress} style={{width: 470, height: 50}} placeholder="Chọn tiến độ" optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={[
          { value: 'scheduled', label: 'Đúng tiến độ' },
          { value: 'in-progress', label: 'Có rủi ro' },
          { value: 'delayed', label: 'Trễ hạn' }
        ]} onChange={value => {
          setErrorMol({...errorMol, progress: ''})
          setFormData({...formData, progress: value})
        }} />
        <p className="text-red-500 text-sm">{errorMol.progress}</p>
      </div>
    </Modal>
    <Modal title='Xác nhận xoá' open={confirmDelete} onCancel={() => {
      setConfirmDelete(false)
    }} onOk={async() => {
      try {
        const result = await dispatch(deleteTodo({projectId: project!.id.toString(), todoId: ID}))
        if (deleteTodo.rejected.match(result)) return
        setConfirmDelete(false)
      } catch {
        console.log('Lỗi xoá nhiệm vụ')
      }
    }} okText='Xoá' okType="danger">
      <p>Bạn có chắc chắn xoá nhiệm vụ <span className="font-medium">{todos.find(todo => todo.id === ID)?.title || 'Not found'}</span></p>
    </Modal>
  </div>
}
