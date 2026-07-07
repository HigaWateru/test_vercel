export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Project Manager',
  url: 'https://project-manager.vercel.app',
  logo: 'https://project-manager.vercel.app/logo.png',
  description: 'Ứng dụng quản lý dự án nhóm chuyên nghiệp - tổ chức, phân công và theo dõi nhiệm vụ dự án một cách hiệu quả',
  sameAs: [
    'https://twitter.com/projectmanager',
    'https://facebook.com/projectmanager',
    'https://github.com/projectmanager'
  ],
  contact: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@project-manager.vercel.app'
  }
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Project Manager',
  url: 'https://project-manager.vercel.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://project-manager.vercel.app/projects?search={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Project Manager',
  description: 'Ứng dụng quản lý dự án nhóm chuyên nghiệp',
  url: 'https://project-manager.vercel.app',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'VND'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '150'
  }
};
