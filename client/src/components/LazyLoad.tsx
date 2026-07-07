import { Spin } from "antd";
import { Suspense } from "react";

const LazyLoadFallback = () => (
  <div className="flex items-center justify-center h-screen" role="status" aria-label="Loading content">
    <Spin size="large" tip="Đang tải..." />
  </div>
);

const LazyLoad = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LazyLoadFallback />}>
      {children}
    </Suspense>
  );
};

export default LazyLoad;

