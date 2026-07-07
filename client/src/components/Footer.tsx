export default function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer 
            className="bg-[#212529] text-center p-4 text-white"
            role="contentinfo"
            aria-label="Site footer"
        >
            <p>
                &copy; {currentYear} Quản lý Dự án Nhóm. Tất cả quyền được bảo lưu.
            </p>
            <nav className="mt-2 flex gap-4 justify-center text-sm">
                <a href="#privacy" className="hover:underline">Chính sách bảo mật</a>
                <a href="#terms" className="hover:underline">Điều khoản sử dụng</a>
                <a href="#contact" className="hover:underline">Liên hệ</a>
            </nav>
        </footer>
    )
}
