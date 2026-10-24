export default function StructuredData() {
  return (
    <>
      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'SkoConnect',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web, Android',
            offers: {
              '@type': 'Offer',
              price: '199',
              priceCurrency: 'JMD',
              priceValidUntil: '2026-12-31',
              availability: 'https://schema.org/InStock',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '500',
              bestRating: '5',
            },
            description: 'School communication platform for Jamaican schools with real-time announcements, emergency alerts, digital forms, and mobile apps.',
            url: 'https://skoconnect.com',
          }),
        }}
      />

      {/* EducationalOrganization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'SkoConnect',
            url: 'https://skoconnect.com',
            description: 'School communication platform for Jamaican schools',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'JM',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'support@skoconnect.com',
              contactType: 'customer service',
            },
          }),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SkoConnect',
            url: 'https://skoconnect.com',
            logo: 'https://skoconnect.com/logo.png',
            description: 'School communication platform for Jamaican schools',
            foundingDate: '2025',
            sameAs: [
              'https://twitter.com/skoconnect',
              'https://linkedin.com/company/skoconnect',
            ],
          }),
        }}
      />
    </>
  );
}
