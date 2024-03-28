import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import stockTools from "highcharts/modules/stock-tools";
import dragPanes from "highcharts/modules/drag-panes";
import indicatorsAll from "highcharts/indicators/indicators-all";
import annotationsAdvanced from "highcharts/modules/annotations-advanced";
import priceIndicator from "highcharts/modules/price-indicator";
import fullScreen from "highcharts/modules/full-screen";
import { useSelector } from "react-redux";
import { getSymbolPriceHistory } from "../helper/firebaseHelpers";
// import exporting from "highcharts/modules/exporting";

stockTools(Highcharts);
dragPanes(Highcharts);
indicatorsAll(Highcharts);
annotationsAdvanced(Highcharts);
priceIndicator(Highcharts);
fullScreen(Highcharts);
// exporting(Highcharts);

// const aaple = require("../json/aapl/2024-03-18.json")
// const aapl = aaple.results.map(t=> [t.t, t.o, t.h, t.l, t.c])
// console.log("after process => ", aapl);

const dummy_data = [
  [1317888000000, 372, 375, 370, 370],
  [1317888060000, 370, 373, 372.01, 374],
  // [1317888120000, 372.16, 372.4, 371.39, 371.62],
  // [1317888180000, 371.62, 372.16, 371.55, 371.75],
  // [1317888240000, 371.75, 372.4, 371.57, 372],
];

export default function TradingView({
  locale,
  hide,
  index,
  selectedSymbol,
  theme,
}) {
  const chartRef = useRef();
  const symbol = useSelector((state) =>
    state.symbols.find((s) => s.symbol === selectedSymbol)
  );

  const options = useMemo(() => {
    return {
      // title: {
      //   text: selectedSymbol,
      // },
      chart: {
        // height: "100%",
        // width: "100%",
        // backgroundColor: "var(--bs-body-bg)",
        // backgroundColor: "#131722",
        // zoomType: "x",
        // zooming: {
        //   mouseWheel: false,
        // },
      },
      // container: {
      //   border: "thin solid blue",
      // },

      // loading: {
      //   hideDuration: 1000,
      //   showDuration: 1000,
      // },

      xAxis: {
        // overscroll: 20000,
        overscroll: "1%",
        // range: 4 * 200000,
        gridLineWidth: 1,
        // endOnTick: false,
        // gridLineColor: "green",
        // gridLineColor: " #e6e6e6" //default
        // gridLineDashStyle:
        // gridLineWidth
        // lineColor
        // lineWidth
        // panningEnabled: false,
        // minRange: 50000,
        // maxRange: 500,
        // softMax: 50,
        // startOnTick: true,
        // title: "Hello world",
        // height: '80%',
        // width: '100%',
        // top: '60%',
        // left: '50%',
        // offset: 0
        // uniqueNames: false,
        // visible: false,
        // zoomEnabled: false,
      },

      rangeSelector: {
        buttons: [
          {
            type: "minute",
            count: 30,
            text: "30m",
          },
          {
            type: "hour",
            count: 1,
            text: "1h",
          },
          {
            type: "hour",
            count: 2,
            text: "2h",
          },
          {
            type: "hour",
            count: 6,
            text: "6h",
          },
          // {
          //   type: "day",
          //   count: 1,
          //   text: "1d",
          // },
          // {
          //   type: "all",
          //   count: 1,
          //   text: "All",
          // },
        ],
        selected: 0,
        inputEnabled: false,
      },

      navigator: {
        // series: {
        //   color: "#000",
        // },
        // enabled: false,
      },

      // navigation: {
      //   buttonOptions: {
      //     enabled: true,
      //   },
      // },

      // plotOptions: {
      //   candlestick: {
      //     color: "pink",
      //     lineColor: "blue",
      //     upColor: "lightgreen",
      //     upLineColor: "green",
      //   },
      // },

      time: {
        useUTC: false,
      },

      series: [
        {
          type: "candlestick",
          color: "#dc3545",
          upColor: "var(--main-numbersc)",
          // pointInterval: 1000 * 60,
          lastPrice: {
            enabled: true,
            label: {
              enabled: true,
              // backgroundColor: "#FF7F7F",
            },
          },
          // data: [
          //   // ...require("../json/btcusdt/2024-03-15.json"),
          //   ...require("../json/btcusdt/2024-03-16.json"),
          //   ...require("../json/btcusdt/2024-03-17.json"),
          // ],
          // data: dummy_data,
          // dataGrouping: {
          //   enabled: true,
          //   units: [
          //     ["day", [1]], // Group by day, include only the open and close values
          //     ["week", [1]], // Group by week, include only the open and close values
          //     ["month", [1]], // Group by month, include only the open and close values
          //   ],
          // },
          // data: [
          //   [1710979260000, 3500, 3500, 3550, 3550],
          //   [1710979270000, 3600, 3600, 3630, 3630],
          //   [1710979280000, 3700, 3700, 3750, 3750],
          //   [1710979290000, 3400, 3400, 3450, 3450],
          // ],
          // data: chartData,
        },
      ],
    };
  }, []);

  // On load, start the interval that adds points

  // Apply the data to the options

  // options.chart = {
  //   events: {
  //     load() {
  //       const chart = this,
  //         series = chart.series[0];

  //       let i = 0;

  //       setInterval(() => {
  //         const data = series.options.data,
  //           newPoint = getNewPoint(i, data),
  //           lastPoint = data[data.length - 1];

  //         // Different x-value, we need to add a new point
  //         if (lastPoint[0] !== newPoint[0]) {
  //           series.addPoint(newPoint);
  //         } else {
  //           // Existing point, update it
  //           series.options.data[data.length - 1] = newPoint;

  //           series.setData(data);
  //         }
  //         i++;
  //       }, 1000);
  //     },
  //   },
  // };

  const processChartData = useCallback(async (data) => {
    if (!chartRef.current) return;
    const chart = chartRef.current.chart;
    const series = chart.series[0];

    const lastPoint = series.options?.data.at(-1);

    const allData = Object.values(data)
      // .slice(-1)
      .map((o) => Object.values(o))
      .flat(2)
      .map((d) => [d.time, d.open, d.high, d.low, d.close]);

    if (lastPoint) {
      // const newData = allData.filter((d) => d[0] > lastPoint[0]);
      // console.log("new Data => ", newData);
      // newData.forEach((d) => {
      //   series.addPoint(d, true, false, true);
      // });
    } else {
      series.setData(allData);
      chart.hideLoading();
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chart;
      chart.showLoading();
    }

    const unsub = getSymbolPriceHistory(symbol.id, processChartData);
    return () => unsub.then((unsub) => unsub());
  }, []);

  // useEffect(() => {
  // console.log("2nd useEffect Called");
  // if (!chartRef.current || !chartData.length) return;
  // const chart = chartRef.current.chart;
  // const series = chart.series[0];
  // chart.showLoading();
  // console.log("series.options?.data == ", series.options?.data);

  // const lastPoint = series.options?.data.at(-1);
  // console.log("lastpoint == ", lastPoint);

  // const allData = Object.values(chartData)
  //   .slice(-2)
  //   .map((o) => Object.values(o))
  //   .flat(2)
  //   .map((d) => [d.time, d.open, d.high, d.low, d.close]);

  // console.log("allData == ", allData);

  // if (lastPoint) {
  //   const newData = allData.filter((d) => d[0] > lastPoint[0]);
  //   console.log("new Data => ", newData);
  //   newData.forEach((d) => {
  //     series.addPoint(d, true, false, true);
  //   });
  // } else {
  //   series.setData(allData);
  // }

  // chart.hideLoading();

  // // Different x-value, we need to add a new point
  // if (lastPoint[0] !== newPoint[0]) {
  //   series.addPoint(newPoint, true, true, true);
  // } else {
  //   // Existing point, update it
  //   series.options.data[data.length - 1] = newPoint;
  // }

  // setTimeout(updateChart, 3000);
  // const id = setInterval(updateChart, 1000 * 60);
  // return () => clearInterval(id);
  // }, [chartData]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartRef}
      constructorType={"stockChart"}
      containerProps={{
        className: `${hide && "d-none"}`,
        style: {
          // flex: 1,
          // width: "99%",
          height: "90%",
          // border: "thin solid red",
        },
      }}
    />
  );
}
