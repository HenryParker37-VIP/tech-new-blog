import React, { useEffect, useRef, useState } from 'react';

function AdBanner({ slot = '', format = 'auto', style = {} }) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (pushed.current || !slot) return;

    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          pushed.current = true;

          // Check if the ad actually rendered after a delay
          setTimeout(() => {
            if (adRef.current) {
              const height = adRef.current.offsetHeight;
              if (height > 10) {
                setAdLoaded(true);
              }
            }
          }, 2000);
        }
      } catch {
        // AdSense not available
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [slot]);

  const placeholder = (
    <div
      className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs"
      style={{ minHeight: '90px', ...style }}
    >
      <div className="text-center">
        <svg className="w-5 h-5 mx-auto mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        Advertisement
      </div>
    </div>
  );

  if (!slot) return placeholder;

  return (
    <div style={{ minHeight: '90px', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3342068807259087"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {!adLoaded && placeholder}
    </div>
  );
}

export default AdBanner;
