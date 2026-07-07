import { logout } from '@/redux/slices/account.slice'
import { type AppDispatch } from '@/redux/store'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()

    const theme = React.useMemo(() => {
        if(location.pathname.startsWith('/mytask')) return 'mytask'
        return 'projects'
    }, [location.pathname])

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        dispatch(logout())
        navigate('/login')
    }

    return (
        <header 
            className="bg-[#212529] text-white flex justify-between items-center px-[300px] py-3"
            role="banner"
            aria-label="Main Navigation"
        >
            <h1 className="text-[20px] font-bold">Quản lý dự án</h1>
            <nav 
                className="flex gap-4 text-[14px]"
                role="navigation"
                aria-label="Main menu"
            >
                <button
                    onClick={() => navigate('/projects')}
                    className={theme === 'projects' ? 'cursor-pointer text-white font-semibold' : 'cursor-pointer text-gray-400 hover:text-white transition'}
                    aria-current={theme === 'projects' ? 'page' : undefined}
                    aria-label="Go to Projects"
                >
                    Dự án
                </button>
                <button
                    onClick={() => navigate('/mytask')}
                    className={theme === 'mytask' ? 'cursor-pointer text-white font-semibold' : 'cursor-pointer text-gray-400 hover:text-white transition'}
                    aria-current={theme === 'mytask' ? 'page' : undefined}
                    aria-label="Go to My Tasks"
                >
                    Nhiệm vụ của tôi
                </button>
                <button
                    onClick={handleLogout}
                    className="cursor-pointer text-gray-400 hover:text-white transition"
                    aria-label="Logout"
                >
                    Đăng xuất
                </button>
            </nav>
        </header>
    )
}

