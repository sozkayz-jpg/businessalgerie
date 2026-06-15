"use client";

import * as React from "react";
import Script from "next/script";
import type { SiteSettings } from "@/lib/cms/types";

export function AnalyticsProvider({ settings }: { settings: SiteSettings }) {
  const ga4Id = settings.analytics.ga4MeasurementId;
  const fbPixel = settings.pixels.facebook;
  const ttPixel = settings.pixels.tiktok;
  const liPixel = settings.pixels.linkedin;

  return (
    <>
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { page_location: window.location.href });
            `}
          </Script>
        </>
      )}

      {fbPixel && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixel}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {ttPixel && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              var ttq = w.ttq || (w.ttq = []);
              ttq.push(['init', '${ttPixel}']);
              ttq.push(['track', 'Browse']);
              var s = d.createElement(t); s.async = true;
              s.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${ttPixel}';
              var first = d.getElementsByTagName(t)[0];
              first.parentNode.insertBefore(s, first);
            }(window, document, 'script');
          `}
        </Script>
      )}

      {liPixel && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "${liPixel}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])}; window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript"; b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      )}
    </>
  );
}
