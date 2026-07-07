import { fetchTodo } from '@/apis/auth.api'
import type { IMember } from '@/utils/types'
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons'
import type { AppDispatch, RootState } from "@/redux/store"
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Modal } from 'antd'
import { updateMember, deleteMember } from '@/apis/auth.api'
import { addMember } from '@/apis/auth.api'

export default function ProjectIntroduce() {
    const projectTodo = useSelector((state: RootState) => state.projectDetail.project)
    const dispatch = useDispatch<AppDispatch>()
    const {id} = useParams<{id: string}>()

    const [addMemModal, setAddMemModal] = React.useState<boolean>(false)
    const [memDetailModal, setMemDetailModal] = React.useState<boolean>(false)
    const [editedRoles, setEditedRoles] = React.useState<Record<string, string>>({})
    const [membersToDelete, setMembersToDelete] = React.useState<Record<string, boolean>>({})
    const [memberEmail, setMemberEmail] = React.useState<string>('')
    const [memberRole, setMemberRole] = React.useState<string>('')
    const [addMemError, setAddMemError] = React.useState<{email: string, role: string}>({email: '', role: ''})

    React.useEffect(() => {
        dispatch(fetchTodo({projectId: Number(id), search: ''}))
    }, [dispatch, id])
    return (
        <div className='flex justify-between'>
            <div className='max-w-[650px]'>
                <h2 className='font-semibold text-2xl mb-6'>{projectTodo?.name}</h2>
                <div className='flex gap-6'>
                    <img 
                        className='w-[200px]' 
                        src={projectTodo?.image} 
                        alt={`Hình ảnh dự án: ${projectTodo?.name}`}
                        loading="lazy"
                        width="200"
                        height="200"
                    />
                    <p>{projectTodo?.description}</p>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-[400px]'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-semibold text-xl'>Thành viên</h3>
                    <button 
                        onClick={() => {
                            setAddMemError({email: '', role: ''})
                            setMemberEmail('')
                            setMemberRole('')
                            setAddMemModal(true)
                        }} 
                        className='bg-white text-gray-500 px-3 py-1 border rounded-md border-gray-500 cursor-pointer'
                        aria-label="Add new team member"
                    >
                        + Thêm thành viên
                    </button>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='grid grid-cols-2 mt-2 w-full' role="list">
                        {projectTodo?.members?.map((member: IMember) => (
                            <div className='flex gap-3 items-center'>
                                <img className='w-[40px] h-[40px] rounded-3xl object-cover border border-gray-300' src="https://png.pngtree.com/png-clipart/20230925/original/pngtree-vector-template-of-tl-initials-in-handwriting-style-with-circle-logo-png-image_12769584.png" alt="" />
                                <div>
                                    <span className='font-semibold'>{member.username}</span>
                                    <p className='text-[12px]'>{member.role}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div>
                        <span onClick={() => { 
                            const init: Record<string, string> = {};
                            (projectTodo?.members || []).forEach(member => { init[member.id] = member.role })
                            setEditedRoles(init)
                            setMembersToDelete({})
                            setMemDetailModal(true)
                        }} className='text-2xl font-bold px-1 rounded-4xl bg-[#e2e3e5] cursor-pointer'><EllipsisOutlined /></span>
                    </div>
                </div>
            </div>
            <Modal open={addMemModal} title='Thêm thành viên' onCancel={() => {
                setAddMemModal(false)
                setAddMemError({email: '', role: ''})
                setMemberEmail('')
                setMemberRole('')
            }} okText='Lưu' onOk={async() => {
                if(!memberEmail.trim()) { 
                    setAddMemError({...addMemError, email: 'Vui lòng nhập email'})
                    return 
                }
                if(!memberRole.trim()) { 
                    setAddMemError({...addMemError, role: 'Vui lòng nhập vai trò'})
                    return 
                }
                const result = await dispatch(addMember({projectId: id as string, email: memberEmail.trim(), role: memberRole.trim()}))
                if(addMember.rejected.match(result)) { 
                    setAddMemError({...addMemError, email: result.payload as string})
                    return 
                }
                setAddMemModal(false)
                setAddMemError({email: '', role: ''})
                setMemberEmail('')
                setMemberRole('')
            }}>
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Email</label>
                    <input value={memberEmail} onChange={event => setMemberEmail(event.target.value)} type="text" className="border border-gray-300 rounded-md p-3 outline-none" />
                    <p className="text-red-500 text-sm">{addMemError.email}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Vai trò</label>
                    <input value={memberRole} onChange={event => setMemberRole(event.target.value)} type="text" className="border border-gray-300 rounded-md p-3 outline-none" />
                    <p className="text-red-500 text-sm">{addMemError.role}</p>
                </div>
            </Modal>
            <Modal open={memDetailModal} title='Thành viên' onCancel={() => setMemDetailModal(false)} cancelText='Đóng' okText='Lưu' onOk={async () => { 
                const members = projectTodo?.members || []
                for(const m of members) { 
                    const newRole = editedRoles[m.id]
                    if(typeof newRole === 'string' && newRole.trim() !== m.role) await dispatch(updateMember({projectId: id as string, memberId: m.id, role: newRole.trim()}))
                } 
                for(const m of members) if(membersToDelete[m.id]) await dispatch(deleteMember({projectId: id as string, memberId: m.id})) 
                setMemDetailModal(false)}}>
                {(projectTodo?.members?.length ?? 0) > 0 ? (
                    <div className='flex flex-col w-full pb-10 gap-3'>
                        <div className='flex justify-around text-2xl py-4'>
                            <span>Thành viên</span>
                            <span>Vai trò</span>
                        </div>
                        {projectTodo?.members.map((member: IMember) => (
                            <div className='flex w-full justify-between items-center'>
                                <div className='flex gap-3 items-center'>
                                    <img className='w-[40px] h-[40px] rounded-3xl object-cover border border-gray-300' src="https://png.pngtree.com/png-clipart/20230925/original/pngtree-vector-template-of-tl-initials-in-handwriting-style-with-circle-logo-png-image_12769584.png" alt="" />
                                    <div>
                                        <span className='text-[16px]'>{member.username}</span>
                                        <p className='text-[14px] text-gray-500'>{member.email}</p>
                                    </div>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <input className='border border-gray-300 px-2 rounded outline-none' type="text" value={editedRoles[member.id] ?? member.role} onChange={event => { 
                                        setEditedRoles(prev => ({...prev, [member.id]: event.target.value}))}} />
                                    <button className={`cursor-pointer ${membersToDelete[member.id] ? 'text-green-500' : 'text-red-500'}`} onClick={() => setMembersToDelete(prev => ({...prev, [member.id]: !prev[member.id]}))}><DeleteOutlined /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <div>Chưa có thành viên</div>}
            </Modal>
        </div>
    )
}