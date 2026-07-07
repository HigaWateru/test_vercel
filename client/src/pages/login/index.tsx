import React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../../redux/store"
import { login } from "@/apis/auth.api"
import { useHead } from "@/hooks/useHead"

export default function Login() {
  // SEO: Set meta tags for login page
  useHead({
    title: 'Đăng nhập | Project Manager',
    description: 'Đăng nhập vào ứng dụng quản lý dự án nhóm để bắt đầu quản lý các dự án và nhiệm vụ của bạn.',
    keywords: 'đăng nhập, login, quản lý dự án, project manager',
    canonical: 'https://project-manager.vercel.app/login',
    ogTitle: 'Đăng nhập | Project Manager',
    ogDescription: 'Đăng nhập vào ứng dụng quản lý dự án nhóm để bắt đầu quản lý các dự án và nhiệm vụ của bạn.',
    ogUrl: 'https://project-manager.vercel.app/login'
  })
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { error, currentUser } = useSelector((state: RootState) => state.account)

  const [loginData, setLoginData] = React.useState({ email: "", password: "" })
  const [formError, setFormError] = React.useState({ email: "", password: "" })
  const [isSubmit, setIsSubmit] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(currentUser) navigate("/projects")
  }, [currentUser, navigate])

  const validate = (): boolean => {
    const errors = { email: "", password: "" }

    if(!loginData.email.trim()) errors.email = "Email không được để trống"
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) errors.email = "Email không đúng định dạng"

    if(!loginData.password.trim()) errors.password = "Mật khẩu không được để trống"
    setFormError(errors)
    return !errors.email && !errors.password
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if(!validate()) return
    try {
      await dispatch(login(loginData)).unwrap()
      setIsSubmit(true)
      setFormError({ email: "", password: "" })
      setTimeout(() => navigate("/projects"), 1200)
    } catch (rejected) {
      setIsSubmit(false)
      if(rejected && typeof rejected === "object") setFormError(prev => ({ ...prev, ...(rejected) }))
    }
  }

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[400px] flex flex-col gap-6">
        <h1 className="text-4xl font-semibold text-center">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4 p-5 shadow-lg border border-gray-100 rounded-md">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Email</label>
            <input type="email" value={loginData.email} onChange={event => {
                setFormError({...formError, email: ''})
                setLoginData({...loginData, email: event.target.value})
                setFormError(prev => ({ ...prev, email: "" }))
              }} className="border border-gray-300 rounded-md p-3 outline-none"/>
            <p className="text-red-500 text-sm">{formError.email || error?.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Mật khẩu</label>
            <input type="password" value={loginData.password} onChange={event => {
                setFormError({...formError, password: ''})
                setLoginData({...loginData, password: event.target.value})
                setFormError(prev => ({ ...prev, password: "" }))
              }} className="border border-gray-300 rounded-md p-3 outline-none"/>
            <p className="text-red-500 text-sm">{formError.password || error?.password}</p>
          </div>
          <p className="text-green-500 text-sm">{isSubmit && "✓ Đăng nhập thành công!"}</p>
          <button type="submit" className="p-3 bg-blue-600 text-white rounded-md cursor-pointer">Đăng nhập</button>
          <p className="text-center">Chưa có tài khoản? <NavLink className='font-semibold' to="/register">Đăng ký</NavLink></p>
        </form>
      </div>
    </div>
  )
}
