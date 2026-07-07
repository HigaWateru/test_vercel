import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import { changeStatus, fetchMyTask } from '@/apis/auth.api'
import { useHead } from '@/hooks/useHead'
import type { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Select } from 'antd'
import React from 'react'
import { CaretDownOutlined, CaretRightOutlined, EditOutlined } from '@ant-design/icons'

export default function MyTask() {
    // SEO: Set meta tags for my tasks page
    useHead({
      title: 'Nhiệm vụ của Tôi | Project Manager',
      description: 'Xem danh sách tất cả các nhiệm vụ được giao cho bạn, quản lý trạng thái và theo dõi tiến độ công việc.',
      keywords: 'nhiệm vụ, task management, công việc của tôi, my tasks',
      canonical: 'https://project-manager.vercel.app/mytask',
      ogTitle: 'Nhiệm vụ của Tôi | Project Manager',
      ogDescription: 'Xem danh sách tất cả các nhiệm vụ được giao cho bạn, quản lý trạng thái và theo dõi tiến độ công việc.',
      ogUrl: 'https://project-manager.vercel.app/mytask'
    })
    const [search, setSearch] = React.useState<string>('')
    const dispatch = useDispatch<AppDispatch>()
    const projects = useSelector((state: RootState) => state.mytask.projects) || []
    const [showTask, setShowTask] = React.useState<number[]>([])
    const [openModal, setOpenModal] = React.useState<boolean>(false)
    const [sort, setSort] = React.useState< 'endDate' | 'priority' | null> (null)
    const [ID, setID] = React.useState<string>('')

    const toggleTask = (projectId: number) => setShowTask(prev => prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId])
    const handleSort = (tasks: {
        id: string
        name: string
        priority: 'low' | 'medium' | 'high'
        status: 'to-do' | 'in-progress' | 'pending' | 'done'
        startDate: string
        endDate: string
        progress: 'scheduled' | 'in-progress' | 'delayed'
    }[]) => {
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
        const timeout = setTimeout(() => dispatch(fetchMyTask({search})), 200)
        return () => clearTimeout(timeout)
    }, [dispatch, search])
    return (
        <div className="h-[100vh] w-[100vw] flex flex-col justify-between">
            <Header />
            <main className="p-10 flex flex-col items-center gap-6 overflow-auto">
                <div className="w-[1200px]">
                    <Breadcrumb />
                </div>
                <div className='flex flex-col justify-between w-[1200px]'>
                    <h1 className='font-semibold text-3xl font-bold mb-6 w-full self-start'>Quản lý nhiệm vụ</h1>
                    <div className="flex gap-4 w-full justify-end">
                        <Select style={{width: 200, height: 40}} placeholder="Sắp xếp theo" optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={[
                            { value: 'endDate', label: 'Hạn chót' },
                            { value: 'priority', label: 'Độ ưu tiên' }
                        ]} onChange={value => setSort(value)}/>
                        <input value={search} onChange={event => setSearch(event.target.value)} className="border border-gray-300 rounded-md px-3 py-1 outline-none w-[300px]" type="text" placeholder="Tìm kiếm nhiệm vụ" />
                    </div>
                </div>
                <div className="border w-[1200px] border-gray-100 rounded-md p-6 flex flex-col gap-6 shadow-xl text-[16px]">
                    <h2 className="text-xl font-semibold">Danh sách nhiệm vụ</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Tên Nhiệm Vụ</th>
                                <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Ưu tiên</th>
                                <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Trạng thái</th>
                                <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Ngày bắt đầu</th>
                                <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Hạn chót</th>
                                <th scope="col" className="px-6 py-3 text-center border border-gray-300 text-[14px] font-semibold">Tiến độ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <React.Fragment key={project.id}>
                                    <tr onClick={() => toggleTask(project.id)} className="border border-gray-300"><td className="p-2 font-semibold text-[14px] cursor-pointer">{project.name} {showTask.includes(project.id) ? <CaretDownOutlined /> : <CaretRightOutlined />}</td></tr>
                                    {handleSort(project.tasks).map(task => (
                                        <tr key={task.id} className={showTask.includes(project.id) ? '' : 'hidden'}>
                                            <td className="p-2 border border-gray-300">{task.name}</td>
                                            <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${task.priority === 'low' ? 'bg-[#0dcaf0]' : task.priority === 'medium' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                                            }`}>{task.priority === 'low' ? 'Thấp' : task.priority === 'medium' ? 'Trung bình' : 'Cao'}</span></td>
                                            <td onClick={() => {
                                                if(task.status === 'in-progress' || task.status === 'pending') {
                                                    setID(task.id)
                                                    setOpenModal(true)
                                                }
                                            }} className={`text-center border border-gray-300 font-medium ${task.status === 'in-progress' || task.status === 'pending' ? 'cursor-pointer' : ''}`}>{task.status === 'to-do' ? 'Todo' : task.status === 'in-progress' ? 'In progress' : task.status === 'pending' ? 'Pending' : 'Done'} {task.status === 'in-progress' || task.status === 'pending' ? <EditOutlined/> : <></>}</td>
                                            <td className="text-center border border-gray-300 text-blue-600">{new Date(task.startDate).toLocaleDateString('vi-VN')}</td>
                                            <td className="text-center border border-gray-300 text-blue-600">{new Date(task.endDate).toLocaleDateString('vi-VN')}</td>
                                            <td className="text-center border border-gray-300"><span className={`text-white font-medium text-[12px] px-2 py-1 rounded ${task.progress === 'scheduled' ? 'bg-[#198754]' : task.progress === 'in-progress' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'
                                            }`}>{task.progress === 'scheduled' ? 'Đúng tiến độ' : task.progress === 'in-progress' ? 'Có rủi ro' : 'Trễ hạn'}</span></td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
            <Modal title='Cập nhật trạng thái' open={openModal} okText='Xác nhận' onCancel={() => {
                setID('')
                setOpenModal(false)
            }} onOk={async() => {
                if(ID) {
                    await dispatch(changeStatus({taskID: ID}))
                    await dispatch(fetchMyTask({search}))
                } else console.log('Không tìm thấy id')
                setID('')
                setOpenModal(false)
            }}>
                <p>Xác nhận cập nhật trạng thái nhiệm vụ</p>
            </Modal>
        </div>
    )
}
