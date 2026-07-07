import { useEffect } from 'react';

interface IMetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

interface IHeadConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
}

const DEFAULT_META = {
  description: 'Ứng dụng quản lý dự án nhóm chuyên nghiệp - Tổ chức, phân công và theo dõi nhiệm vụ dự án một cách hiệu quả.',
  keywords: 'quản lý dự án, project management, task management, quản lý nhiệm vụ, công cụ quản lý nhóm',
  ogImage: 'https://project-manager.vercel.app/og-image.png',
  ogUrl: 'https://project-manager.vercel.app',
  twitterCard: 'summary_large_image'
};

export const useHead = (config: IHeadConfig) => {
  useEffect(() => {
    // Update Title
    if (config.title) {
      document.title = config.title;
    }

    // Update or Create Meta Tags
    const updateOrCreateMetaTag = (selector: string, attributes: Record<string, string>) => {
      let tag = document.querySelector(selector) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        Object.keys(attributes).forEach(key => {
          if (key !== 'content') {
            tag.setAttribute(key, attributes[key]);
          }
        });
        document.head.appendChild(tag);
      }
      tag.content = attributes.content;
    };

    // Update Meta Description
    if (config.description) {
      updateOrCreateMetaTag(
        'meta[name="description"]',
        { name: 'description', content: config.description }
      );
    }

    // Update Meta Keywords
    if (config.keywords) {
      updateOrCreateMetaTag(
        'meta[name="keywords"]',
        { name: 'keywords', content: config.keywords }
      );
    }

    // Update Canonical
    if (config.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = config.canonical;
    }

    // Update Open Graph Tags
    const ogTags = {
      'og:title': config.ogTitle || config.title || 'Quản lý Dự án Nhóm | Project Manager',
      'og:description': config.ogDescription || config.description || DEFAULT_META.description,
      'og:image': config.ogImage || DEFAULT_META.ogImage,
      'og:url': config.ogUrl || DEFAULT_META.ogUrl,
      'og:type': config.ogType || 'website'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      updateOrCreateMetaTag(
        `meta[property="${property}"]`,
        { property, content }
      );
    });

    // Update Twitter Tags
    const twitterTags = {
      'twitter:card': config.twitterCard || DEFAULT_META.twitterCard,
      'twitter:title': config.twitterTitle || config.title || 'Quản lý Dự án Nhóm | Project Manager',
      'twitter:description': config.twitterDescription || config.description || DEFAULT_META.description,
      'twitter:image': config.twitterImage || DEFAULT_META.ogImage
    };

    Object.entries(twitterTags).forEach(([property, content]) => {
      updateOrCreateMetaTag(
        `meta[property="${property}"]`,
        { property, content }
      );
    });

    // Update Structured Data
    if (config.structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(config.structuredData);
    }

    return () => {
      // Cleanup if needed
    };
  }, [config]);
};
