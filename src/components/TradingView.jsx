import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function TradingView({ locale, hide, index }) {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById(`tradingview_${index}`) &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          // autosize: true,
          // symbol: "BITSTAMP:BTCUSD",
          // interval: "60",
          // timezone: "exchange",
          // theme: "dark",
          // style: "1",
          // locale: "en",
          // enable_publishing: false,
          // hide_top_toolbar: true,
          // allow_symbol_change: true,
          // container_id: `tradingview_${}`,
          symbol: "BTCUSDT",
          width: "100%",
          height: "100%",
          interval: "H",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: locale,
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: true,
          allow_symbol_change: true,
          details: false,
          calendar: false,
          container_id: `tradingview_${index}`,
        });
      }
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{ display: hide ? "none" : "block" }}
    >
      <div id={`tradingview_${index}`} />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}
