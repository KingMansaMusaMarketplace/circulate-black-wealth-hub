
-- Clear generic/non-business-specific logos that were scraped from websites
UPDATE businesses SET logo_url = NULL WHERE logo_url IN (
  'https://fonts.gstatic.com/s/i/productlogos/translate/v14/24px.svg',
  'https://www.buyblack.org/images/BBO_Logo_Mobile_Square.png',
  'https://www.supportblackowned.com/images/unnamed.png',
  'https://cdn.apple-mapkit.com/mk/5.81.48/images/logos/logo-wordmark-en-US.png',
  'https://d28f3w0x9i80nq.cloudfront.net/icons/toast-logo-filled.svg'
)
OR logo_url LIKE '%static.hugedomains.com%'
OR logo_url LIKE '%parastorage.com%images/error-pages%'
OR logo_url LIKE '%weddingwire.com/assets/img/footer%'
OR logo_url LIKE '%blackrestaurantweeks.com/wp-content/plugins/gdpr%'
OR logo_url LIKE '%theknot.com%meta-graphics/coast-ico%';
