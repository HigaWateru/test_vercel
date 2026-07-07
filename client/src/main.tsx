import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routers from "./routes";
import { ConfigProvider, App as AntdApp } from "antd"; // bold
import viVN from "antd/locale/vi_VN"; // Ngôn ngữ Tiếng Việt
import "./index.css";
import "@/apis/axiosClient";
import "@fontsource/poppins/400.css";
import { Provider } from "react-redux";
import { store } from './redux/store/index'
import { organizationSchema, websiteSchema } from "./utils/schemas";

// Add structured data to head
function addStructuredData() {
  // Organization Schema
  const orgScript = document.createElement('script');
  orgScript.type = 'application/ld+json';
  orgScript.textContent = JSON.stringify(organizationSchema);
  document.head.appendChild(orgScript);

  // Website Schema
  const webScript = document.createElement('script');
  webScript.type = 'application/ld+json';
  webScript.textContent = JSON.stringify(websiteSchema);
  document.head.appendChild(webScript);
}

addStructuredData();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          fontFamily: ", sans-serif",
        },
      }}
      locale={viVN} // Thiết lập ngôn ngữ Tiếng Việt
    >
      <Provider store = {store}>
        <AntdApp>
          <RouterProvider router={routers} />
        </AntdApp>
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
