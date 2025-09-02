// Client-side tracking script for conversion attribution
export const initializeTracking = () => {
  // Store referral code from URL or existing localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    localStorage.setItem('stakeshare_ref', refCode);
    localStorage.setItem('stakeshare_ref_timestamp', Date.now().toString());
    
    // Track click event
    fetch('/api/track/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referralCode: refCode,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign')
      })
    }).catch(err => console.warn('StakeShare: Click tracking failed', err));
  }
};

// Function to track conversion
export const trackConversion = (options = {}) => {
  const storedRef = localStorage.getItem('stakeshare_ref');
  const refTimestamp = localStorage.getItem('stakeshare_ref_timestamp');
  
  // Check if referral is still valid (within 30 days)
  if (storedRef && refTimestamp) {
    const daysSinceRef = (Date.now() - parseInt(refTimestamp)) / (1000 * 60 * 60 * 24);
    
    if (daysSinceRef <= 30) {
      const conversionData = {
        referralCode: storedRef,
        customerEmail: options.customerEmail || '',
        revenueAmount: options.revenueAmount || 0,
        conversionType: options.conversionType || 'paid',
        timestamp: new Date().toISOString(),
        companyId: options.companyId || '',
        orderId: options.orderId || '',
        metadata: options.metadata || {}
      };

      fetch('/api/track/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversionData)
      }).then(response => {
        if (response.ok) {
          console.log('StakeShare: Conversion tracked successfully');
          // Clear referral after successful conversion
          localStorage.removeItem('stakeshare_ref');
          localStorage.removeItem('stakeshare_ref_timestamp');
        }
      }).catch(err => {
        console.warn('StakeShare: Conversion tracking failed', err);
      });
    }
  }
};