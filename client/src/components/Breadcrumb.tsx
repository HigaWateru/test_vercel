import { useLocation, useParams } from 'react-router-dom';
import { useHead } from '@/hooks/useHead';

const BREADCRUMB_MAP: Record<string, { label: string; position: number }> = {
  '/projects': { label: 'Dự án', position: 2 },
  '/projects/:id': { label: 'Chi tiết Dự án', position: 3 },
  '/mytask': { label: 'Nhiệm vụ của tôi', position: 2 },
  '/login': { label: 'Đăng nhập', position: 2 },
  '/register': { label: 'Đăng ký', position: 2 }
};

interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export const generateBreadcrumbs = (pathname: string, projectName?: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    {
      name: 'Trang chủ',
      url: '/',
      position: 1
    }
  ];

  if (pathname === '/projects' || pathname.startsWith('/projects')) {
    items.push({
      name: 'Dự án',
      url: '/projects',
      position: 2
    });

    if (pathname.startsWith('/projects/') && projectName) {
      items.push({
        name: projectName,
        url: pathname,
        position: 3
      });
    }
  } else if (pathname === '/mytask') {
    items.push({
      name: 'Nhiệm vụ của tôi',
      url: '/mytask',
      position: 2
    });
  } else if (pathname === '/login') {
    items.push({
      name: 'Đăng nhập',
      url: '/login',
      position: 2
    });
  } else if (pathname === '/register') {
    items.push({
      name: 'Đăng ký',
      url: '/register',
      position: 2
    });
  }

  return items;
};

export const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: `https://project-manager.vercel.app${item.url}`
    }))
  };
};

interface BreadcrumbProps {
  projectName?: string;
}

export default function Breadcrumb({ projectName }: BreadcrumbProps) {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname, projectName);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  useHead({
    structuredData: breadcrumbSchema
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-gray-600"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex gap-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.url} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {index < breadcrumbs.length - 1 ? (
              <>
                <a href={item.url} itemProp="item">
                  <span itemProp="name">{item.name}</span>
                </a>
                <span className="mx-2">/</span>
              </>
            ) : (
              <span itemProp="name" aria-current="page">
                {item.name}
              </span>
            )}
            <meta itemProp="position" content={String(item.position)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
