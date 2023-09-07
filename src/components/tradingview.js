

function updateWidget(symb){
  let symbol = symb
  new TradingView.widget(
    {
        "symbol": symbol,
        "width" : "100%",
        "height" : "100%",
        "interval": "H",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "ru",
        "enable_publishing": false,
        "withdateranges": true,
        "hide_side_toolbar": true,
        "allow_symbol_change": true,
        "details": false,
        "calendar": false,
        "container_id": "tradingview_c902b"
    }
  );
}

updateWidget("BTCUSDT")