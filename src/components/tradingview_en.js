

function updateWidget(symb, newChartID){
  let symbol = symb
  let newCID = newChartID
  new TradingView.widget(
    {
        "symbol": symbol,
        "width" : "100%",
        "height" : "96%",
        "interval": "H",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "withdateranges": true,
        "hide_side_toolbar": true,
        "allow_symbol_change": true,
        "details": false,
        "calendar": false,
        "container_id": newCID
    }
  );
}

updateWidget('BTCUSDT', 'tradingview_first')