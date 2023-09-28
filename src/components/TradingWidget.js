import React, { useEffect } from "react";

function TradingWidget({ locale }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "1D",
      showChart: false,
      locale: locale,
      width: "100%",
      height: "100%",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      tabs: [
        {
          title: "Forex",
          symbols: [
            {
              s: "FX:EURUSD",
              d: "Euro",
            },
            {
              s: "FX:GBPUSD",
              d: "Pound",
            },
            {
              s: "FX:USDJPY",
              d: "Yen",
            },
            {
              s: "FX:USDCHF",
              d: "Franc",
            },
            {
              s: "FX:AUDUSD",
              d: "Australian",
            },
            {
              s: "FX:USDCAD",
              d: "Canadian",
            },
          ],
          originalTitle: "Forex",
        },
        {
          title: "Crypto",
          symbols: [
            {
              s: "BINANCE:BTCUSDT",
              d: "Bitcoin",
            },
            {
              s: "BINANCE:ETHUSDT",
              d: "Ethereum",
            },
            {
              s: "BINANCE:SOLUSDT",
              d: "Solana",
            },
            {
              s: "BINANCE:XRPUSDT",
              d: "Ripple",
            },
            {
              s: "BINANCE:MATICUSDT",
              d: "Matic",
            },
            {
              s: "BINANCE:BNBUSDT",
              d: "Binance Coin",
            },
            {
              s: "BINANCE:ADAUSDT",
              d: "Cardano",
            },
            {
              s: "BINANCE:DOGEUSDT",
              d: "Dogecoin",
            },
            {
              s: "BINANCE:SHIBUSDT",
              d: "Shiba Inu",
            },
            {
              s: "BINANCE:DOTUSDT",
              d: "Polkadot",
            },
            {
              s: "BINANCE:LTCUSDT",
              d: "Litecoin",
            },
          ],
        },
        {
          title: "Indices",
          symbols: [
            {
              s: "FOREXCOM:SPXUSD",
              d: "S&P 500",
            },
            {
              s: "FOREXCOM:NSXUSD",
              d: "US 100",
            },
            {
              s: "FOREXCOM:DJI",
              d: "Dow 30",
            },
            {
              s: "INDEX:NKY",
              d: "Nikkei 225",
            },
            {
              s: "INDEX:DEU40",
              d: "DAX Index",
            },
            {
              s: "FOREXCOM:UKXGBP",
              d: "UK 100",
            },
          ],
          originalTitle: "Indices",
        },
      ],
    });

    const container = document.getElementById("tradingview-widget-container");
    container.appendChild(script);

    // return () => {
    //   // Clean up the script when the component unmounts
    //   container?.removeChild(script);
    // };
  }, []);

  return (
    <div id="tradingview-widget-container">
      <div id="tradingview_c902b">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}

export default TradingWidget;
