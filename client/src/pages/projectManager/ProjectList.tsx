import { addProject, deleteProject, fetchProject, updateProject, uploadImg } from "@/apis/auth.api"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Breadcrumb from "@/components/Breadcrumb"
import { useHead } from "@/hooks/useHead"
import type { AppDispatch, RootState } from "@/redux/store"
import type { IProject } from "@/utils/types"
import { message, Modal, Pagination } from "antd"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function ProjectList() {
  // SEO: Set meta tags for project list page
  useHead({
    title: 'Danh sách Dự án | Project Manager',
    description: 'Xem danh sách tất cả dự án của nhóm, tìm kiếm, thêm, sửa và quản lý dự án một cách hiệu quả.',
    keywords: 'danh sách dự án, quản lý dự án, project list, dự án nhóm',
    canonical: 'https://project-manager.vercel.app/projects',
    ogTitle: 'Danh sách Dự án | Project Manager',
    ogDescription: 'Xem danh sách tất cả dự án của nhóm, tìm kiếm, thêm, sửa và quản lý dự án một cách hiệu quả.',
    ogUrl: 'https://project-manager.vercel.app/projects'
  })
  const {list: projectList, total} = useSelector((state: RootState) => state.projectList)
  const dispatch = useDispatch<AppDispatch>()
  const [search, setSearch] = React.useState('')
  const navigate = useNavigate()

  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [errorMol, setErrorMol] = React.useState<{name: string, image: string, description: string}>({name: '', image: '', description: ''})
  const [optModal, setOptModal] = React.useState<'add' | 'edit'>('add')
  const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false)
  const [ID, setID] = React.useState<number | null>(null)
  const [currPage, setCurrPage] = React.useState<number>(1)

  const [formData, setFormData] = React.useState<{name: string, image: string, description: string}>({name: '', image: '', description: ''})

  const validate = (): boolean => {
    const errors = {name: '', image: '', description: ''}
    if(!formData.name.trim()) errors.name = 'Tên dự án không được để trống'
    if(formData.description.trim().length < 20) errors.description = 'Mô tả phải có ít nhất 20 kí tự'
    setErrorMol(errors)
    return !errors.name && !errors.description
  }

  React.useEffect(() => {
    const timeout = setTimeout(() => dispatch(fetchProject({page: currPage, limit: 9, search})), 200)
    return () => clearTimeout(timeout)
  }, [search, dispatch, currPage])

  return <div className="h-[100vh] w-[100vw] flex flex-col justify-between content-between ">
    <Header />
    <main className="p-10 flex flex-col items-center gap-6 overflow-auto">
      <div className="w-[1200px]">
        <Breadcrumb />
      </div>
      <div className="border w-[1200px] border-gray-100 rounded-md p-6 flex flex-col gap-6 shadow-lg text-[16px]">
        <h1 className="text-3xl font-bold">Quản lý dự án nhóm</h1>
        <div className="flex justify-between">
          <button onClick={() => {
            setOptModal('add')
            setOpenModal(true)
          }} className="bg-[#007bff] text-white px-3 py-1 rounded-md cursor-pointer">+ Thêm dự án</button>
          <input 
            value={search} 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)} 
            className="border border-gray-300 rounded-md px-3 py-1 outline-none w-[300px]" 
            type="text" 
            placeholder="Tìm kiếm dự án" 
          />
        </div>
        <h2 className="text-xl font-semibold">Danh sách dự án</h2>
        <table className="w-full table-auto border border-gray-300 text-left border-collapse ">
          <thead>
            <tr className="bg-[#1e1e1e] text-white">
              <th className="text-center p-3 border border-gray-400">ID</th>
              <th className="border border-gray-400 p-3">Tên dự án</th>
              <th className="text-center border border-gray-400">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {projectList.map((project: IProject) => (
              <tr key={project.id} className="even:bg-gray-100 odd:bg-white">
                <td className="text-center p-3">{project.id}</td>
                <td className="p-3 border-l border-r border-gray-300">{project.name}</td>
                <td className="text-center">
                  <div className="flex justify-center gap-4 ">
                    <button onClick={() => {
                      setOptModal('edit')
                      setID(project.id)
                      setOpenModal(true)
                      setFormData({name: project.name, image: project.image, description: project.description})
                    }} className="p-4 py-1 bg-[#ffc107] rounded-md cursor-pointer">Sửa</button>
                    <button onClick={() => {
                      setID(project.id)
                      setConfirmDelete(true)
                    }} className="px-3 py-1 bg-[#dc3545] text-white rounded-md cursor-pointer">Xóa</button>
                    <button onClick={() => navigate(`/projects/${project.id}`)} className="px-3 py-1 bg-[#007bff] text-white rounded-md cursor-pointer">Chi tiết</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination align="center" defaultCurrent={1} total={total} current={currPage} pageSize={9} onChange={page => setCurrPage(page)} />
    </main>
    <Footer />
    <Modal okText='Lưu' title={optModal === 'add' ? 'Thêm dự án' : 'Sửa dự án'} open={openModal} onCancel={() => {
      setOpenModal(false)
      setID(null)
      setErrorMol({name: '', image: '', description: ''})
      setFormData({name: '', image: '', description: ''})
    }} onOk={async() => {
      if(!validate()) return
      if(optModal === "add") {
        try {
          const response = await dispatch(addProject(formData))
          if(addProject.fulfilled.match(response)) {
            setOpenModal(false)
            setFormData({name: "", image: "", description: ""})
            setErrorMol({name: "", image: "", description: ""})
            dispatch(fetchProject({page: currPage, limit: 9, search}))
          } else if(addProject.rejected.match(response)) {
            const payload = response.payload as {name?: string, description?: string}
            setErrorMol({
              name: payload.name || "",
              image: "",
              description: payload.description || ""
            })
          }
        } catch (error) {
          console.log("Lỗi thêm dự án", error)
        }
      } else {
        try {
          if(ID == null) {
            setErrorMol({...errorMol, name: 'Lỗi xác định ID dự án'})
            return
          }
          const response = await dispatch(updateProject({id: ID, ...formData}))
          if(updateProject.fulfilled.match(response)) {
            setOpenModal(false)
            setFormData({name: "", image: "", description: ""})
            setErrorMol({name: "", image: "", description: ""})
            dispatch(fetchProject({page: currPage, limit: 9, search}))
          } else if(updateProject.rejected.match(response)) {
            const payload = response.payload as {name?: string, description?: string}
            setErrorMol({name: payload.name || "", image: "", description: payload.description || ""})
          }
        } catch (error) {
          console.log("Lỗi cập nhật dự án", error)
        }
      }
    }}>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Tên dự án</label>
        <input 
          value={formData.name} 
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setErrorMol({...errorMol, name: ''})
            setFormData({...formData, name: event.target.value})
          }} 
          type="text" 
          className="border border-gray-300 rounded-md p-3 outline-none " 
        />
        <p className="text-red-500 text-sm">{errorMol.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Hình ảnh dự án</label>
        <input 
          onChange={async(event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if(!file) return
            try {
              const imgUrl = await uploadImg(file)
              setFormData({...formData, image: imgUrl})
              message.success('Tải ảnh thành công')
            } catch {
              message.error('Lỗi tải ảnh lên Cloudinary')
            }
          }} 
          type="file" 
          accept="image/*" 
          className="border border-gray-300 rounded-md p-3 outline-none cursor-pointer" 
        />
        <p className="text-red-500 text-sm"></p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Mô tả dự án</label>
        <textarea 
          value={formData.description} 
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setErrorMol({...errorMol, description: ''})
            setFormData({...formData, description: event.target.value})
          }} 
          name="description" 
          id="description" 
          className="w-full h-[100px] border border-gray-300 rounded-md p-3 outline-none"
        />
        <p className="text-red-500 text-sm">{errorMol.description}</p>
      </div>
    </Modal>
    <Modal title="Xác nhận xoá" open={confirmDelete} onCancel={() => {
        setConfirmDelete(false)
        setID(null)
      }} onOk={async() => {
        if(ID === null) return
        try {
          const response = await dispatch(deleteProject(ID))
          if(deleteProject.fulfilled.match(response)) await dispatch(fetchProject({page: currPage, limit: 9, search}))
          else console.error("Xóa thất bại:", response)
        } catch (error) {
          console.error("Lỗi xoá:", error)
        } finally {
          setConfirmDelete(false)
          setID(null)
        }
    }} okText="Xoá" okType="danger">
      <p>Bạn có chắc chắn muốn xoá dự án này không?</p>
    </Modal>  
  </div>
}
