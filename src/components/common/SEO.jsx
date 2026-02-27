import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../data/seo-config';

/**
 * Component SEO - meta tags, Open Graph, Twitter Card, JSON-LD
 * Chỉ dùng cho trang shop, không dùng cho admin
 */
const SEO = ({
    title,
    description,
    image,
    imageAlt,
    url,
    type = 'website',
    noindex = false,
    jsonLd,
    keywords,
}) => {
    const siteName = siteConfig.name;
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const fullDescription = description || siteConfig.description;
    const fullImage = image ? (image.startsWith('http') ? image : `${siteConfig.siteUrl}${image.startsWith('/') ? '' : '/'}${image}`) : `${siteConfig.siteUrl}${siteConfig.defaultImage}`;
    const fullUrl = url ? (url.startsWith('http') ? url : `${siteConfig.siteUrl}${url.startsWith('/') ? '' : '/'}${url}`) : siteConfig.siteUrl;
    const fullKeywords = keywords || siteConfig.keywords;

    const defaultJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                name: siteName,
                url: siteConfig.siteUrl,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.siteUrl}/products?search={search_term_string}` },
                    'query-input': 'required name=search_term_string',
                },
            },
            siteConfig.organization,
        ],
    };

    const finalJsonLd = jsonLd ? { '@context': 'https://schema.org', ...jsonLd } : defaultJsonLd;

    return (
        <Helmet>
            {/* Basic */}
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <meta name="keywords" content={fullKeywords} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:image" content={fullImage} />
            {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={siteConfig.locale} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
            <meta name="twitter:image" content={fullImage} />

            {/* Canonical */}
            <link rel="canonical" href={fullUrl} />

            {/* JSON-LD */}
            <script type="application/ld+json">{JSON.stringify(finalJsonLd)}</script>
        </Helmet>
    );
};

export default SEO;
