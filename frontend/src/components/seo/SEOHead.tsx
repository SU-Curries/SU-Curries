import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  rating?: {
    value: number;
    count: number;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'SU Curries - Authentic Indian Cuisine',
  description = 'Discover authentic Indian cuisine with our online store, cooking classes, and catering services. Order fresh spices, ready meals, and book cooking experiences.',
  keywords = 'Indian food, curry, cooking classes, catering, food delivery, authentic cuisine, spices, Indian restaurant',
  image = '/Assets/su_curries_logo.png',
  url = window.location.href,
  type = 'website',
  author = 'SU Curries',
  publishedTime,
  modifiedTime,
  section,
  tags,
  price,
  availability,
  rating,
  breadcrumbs,
}) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://sucurries.com';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : 'WebSite',
      name: title,
      description,
      url: fullUrl,
      image: fullImageUrl,
    };

    if (type === 'product' && price) {
      return {
        ...baseData,
        '@type': 'Product',
        offers: {
          '@type': 'Offer',
          price: price.amount,
          priceCurrency: price.currency,
          availability: `https://schema.org/${availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
        },
        aggregateRating: rating ? {
          '@type': 'AggregateRating',
          ratingValue: rating.value,
          reviewCount: rating.count,
        } : undefined,
      };
    }

    if (breadcrumbs) {
      return {
        ...baseData,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`,
          })),
        },
      };
    }

    return baseData;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SU Curries" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@sucurries" />
      <meta name="twitter:creator" content="@sucurries" />

      {/* Product specific tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.amount.toString()} />
          <meta property="product:price:currency" content={price.currency} />
          <meta property="product:availability" content={availability} />
        </>
      )}

      {/* Mobile and App Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SU Curries" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Additional Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Restaurant',
          name: 'SU Curries',
          description: 'Authentic Indian cuisine restaurant with online ordering and cooking classes',
          url: siteUrl,
          logo: `${siteUrl}/Assets/su_curries_logo.png`,
          image: `${siteUrl}/Assets/su_curries_logo.png`,
          servesCuisine: 'Indian',
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US',
          },
          hasMenu: `${siteUrl}/menu`,
          acceptsReservations: true,
          paymentAccepted: 'Cash, Credit Card, Debit Card',
          currenciesAccepted: 'USD',
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;