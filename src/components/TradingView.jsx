import React, { useEffect, useState, useRef, useCallback } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import stockTools from "highcharts/modules/stock-tools";
import Hollowcandlestick from "highcharts/modules/hollowcandlestick";
// import Heikinashi from "highcharts/modules/heikinashi";
import dragPanes from "highcharts/modules/drag-panes";
import brokenAxis from "highcharts/modules/broken-axis";
import accessibility from "highcharts/modules/accessibility";
import indicatorsAll from "highcharts/indicators/indicators-all";
import annotationsAdvanced from "highcharts/modules/annotations-advanced";
import priceIndicator from "highcharts/modules/price-indicator";
import fullScreen from "highcharts/modules/full-screen";
import { useSelector } from "react-redux";
import {
  getSymbolPriceHistory,
  getSymbolPriceHistoryInAir,
} from "../helper/firebaseHelpers";
// import exporting from "highcharts/modules/exporting";
import { timezoneList } from "../helper/helpers";

stockTools(Highcharts);
dragPanes(Highcharts);
brokenAxis(Highcharts);
indicatorsAll(Highcharts);
annotationsAdvanced(Highcharts);
priceIndicator(Highcharts);
fullScreen(Highcharts);
accessibility(Highcharts);
HighchartsMore(Highcharts);
Hollowcandlestick(Highcharts);
// Heikinashi(Highcharts);
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

const TIMEFRAMES = [
  {
    label: "1m",
    value: ["minute", [1]],
  },
  {
    label: "15m",
    value: ["minute", [15]],
  },
  {
    label: "1h",
    value: ["hour", [1]],
  },
  {
    label: "4h",
    value: ["hour", [4]],
  },
  {
    label: "1d",
    value: ["day", [1]],
  },
  {
    label: "1w",
    value: ["week", [1]],
  },
  // {
  //   label: "1M",
  //   value: ["month", [1]],
  // },
  // {
  //   label: "1y",
  //   value: ["year", [1]],
  // },
];

export default function TradingView({
  locale,
  hide,
  index,
  selectedSymbol,
  theme,
  plotLine = 0,
}) {
  const chartRef = useRef();
  const [timezone, setTimeZone] = useState(timezoneList[0]);
  const [dataGroup, setDataGroup] = useState(TIMEFRAMES[0].value);
  const [symbolName] = useState(selectedSymbol);
  const [loading, setLoading] = useState(true);

  const symbol = useSelector((state) =>
    state.symbols.find((s) => s.symbol === symbolName)
  );

  const options = {
    // title: {
    //   text: symbolName,
    // },
    chart: {
      type: "candlestick",
      // height: "100%",
      // width: "100%",
      // backgroundColor: "var(--bs-body-bg)",
      // backgroundColor: "#131722",
      // zoomType: "x",
      // zooming: {
      //   mouseWheel: false,
      // },
      // marginRight: 50
    },
    time: {
      timezone,
    },
    // container: {
    //   border: "thin solid blue",
    // },

    // loading: {
    //   hideDuration: 1000,
    //   showDuration: 1000,
    // },

    scrollbar: {
      liveRedraw: false,
    },
    xAxis: {
      // overscroll: 20000,
      overscroll: ["EURUSD", "EURUSDT"].includes(symbolName) ? "4%" : "1%",
      minRange: 3600 * 1000, // one hour
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

      events: {
        // load(e) {
        //   alert("Chart has loaded");
        // },
        // redraw(e) {
        //   alert("The chart is being redrawn");
        // },
        // render(e) {
        //   alert("The chart is being redered");
        // },
        // setExtremes(e, rest) {
        //   console.log("extremes => ", e, rest);
        // },
        afterSetExtremes(e) {
          console.log("l => ", loading);
          if (!e.dataMin || loading) return;
          const diff = (e.min - e.dataMin) / (1000 * 60);
          console.log("diff = ", diff);
          if (diff && diff > 30) return;
          // if (!loading) setLoading(true);
          this.chart.showLoading();
          const loadingCallback = () => {
            this.chart.hideLoading();
            setLoading(false);
          };
          setLoading((p) => {
            if (p === false)
              getSymbolPriceHistoryInAir(
                symbol.id,
                new Date(e.dataMin).toISOString().slice(0, 10),
                processChartData,
                dataGroup,
                loadingCallback
              );
            return true;
          });
        },
      },
    },

    rangeSelector: {
      buttons: [
        // {
        //   type: "minute",
        //   count: 30,
        //   text: "30m",
        // },
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
        {
          type: "day",
          count: 1,
          text: "1d",
        },
        {
          type: "week",
          count: 1,
          text: "1w",
        },
        // {
        //   type: "all",
        //   count: 1,
        //   text: "All",
        // },
      ],
      // selected: 1,
      inputEnabled: false,
    },

    navigator: {
      adaptToUpdatedData: false,

      // series: {
      //   color: "#000",
      // },
      // enabled: false,
    },

    // navigation: {
    // iconsURL: "stock-icons/",
    // buttonOptions: {
    //   enabled: true,
    // },
    // },

    stockTools: {
      gui: {
        buttons: [
          "indicators",
          "lines",
          // "separator",
          "measure",
          "typeChange",
          "currentPriceIndicator",
          "zoomChange",
          "simpleShapes",
          "crookedLines",
          "toggleAnnotations",
          "flags",
          "fullScreen",
          "advanced",
          // "separator",
          // "verticalLabels",
          // "separator",
          // "separator",
          // "saveChart",
        ],

        definitions: {
          // indicators: {
          // className: "highcharts-menu-item-indicators",
          // text: "Indicators",
          // symbol: "url(https://www.highcharts.com/samples/graphics/sun.png)",
          // },
          typeChange: {
            items: [
              "typeOHLC",
              "typeLine",
              "typeCandlestick",
              "typeHollowCandlestick",
            ],
            // events: {
            //   typeChange: function (e) {
            //     console.log("Chart type changed to: " + e.newType);
            //     // Perform actions when the chart type changes
            //   },
            // },
          },
          // typeLine: {
          //   symbol: "series-line.svg",
          // symbol: "series-ohlc.svg",
          // symbol: "https://flagsapi.com/BE/flat/64.png",
          // symbol:
          //   "url(https://code.highcharts.com/11.4.0/gfx/stock-icons/series-heikin-ashi.svg)",
          // },
        },
      },
    },

    plotOptions: {
      candlestick: {
        color: "#dc3545",
        lineColor: "#dc3545",
        upColor: "var(--main-numbersc)",
        upLineColor: "var(--main-numbersc)",
        // pointWidth: 5, // Set the width of the candlestick
        // lineWidth: 1,
        // pointInterval: 3600000, // one hour
      },
    },

    // time: {
    //   useUTC: false,
    // },

    yAxis: [
      {
        height: "80%",
        // title: {
        //   text: "Value",
        // },
        // labels: {
        //   align: "left",
        // },
        // resize: {
        //   enabled: true,
        // },
        plotLines: [
          {
            value: plotLine, // Dynamic value for the indicator line
            color: "var(--main-numbersc)",
            // width: 2,
            // zIndex: 5,
            // dashStyle: "dash",
            // labels: {
            //   clip: true,
            // },
            label: {
              text: plotLine,
              align: "right",
              style: {
                color: "gray",
              },
              // y: 12,
              x: -50,
            },
          },
        ],
      },
      {
        top: "80%",
        height: "20%",
        offset: 0,
      },
    ],

    // legend: {
    //   enabled: true,
    //   layout: "vertical",
    //   align: "right",
    //   verticalAlign: "top",
    //   y: 100,
    // },

    series: [
      {
        id: symbol.id,
        name: symbolName,
        // type: "candlestick", // ohlc
        color: "#dc3545",
        lineColor: "#dc3545",
        upColor: "var(--main-numbersc)",
        upLineColor: "var(--main-numbersc)",
        // pointInterval: 1000 * 60,
        // gapSize: 0,
        lastPrice: {
          enabled: true,
          label: {
            enabled: true,
            // backgroundColor: "#FF7F7F",
          },
        },
        // tooltip: {
        //   valueDecimals: 2,
        // },
        dataGrouping: {
          enabled: true,
          // units: [
          //   [
          //     "millisecond", // unit name
          //     [1, 2, 5, 10, 20, 25, 50, 100, 200, 500], // allowed multiples
          //   ],
          //   ["second", [1, 2, 5, 10, 15, 30]],
          //   ["minute", [10, 20, 30]],
          // ["hour", [1]],
          // ["hour", [1, 2, 3, 4, 6, 8, 12]],
          //   ["day", [1]],
          //   ["week", [1]],
          //   ["month", [1, 3, 6]],
          //   ["year", null],
          // ],
          // approximation: "average",
          // forced: true,
          units: [dataGroup],
          // lastAnchor: "lastPoint",
        },
        // data: [
        //   [1710979260000, 3500, 3500, 3550, 3550],
        //   [1710979270000, 3600, 3600, 3630, 3630],
        //   [1710979280000, 3700, 3700, 3750, 3750],
        //   [1710979290000, 3400, 3400, 3450, 3450],
        // ],
      },
      {
        id: `volume-${symbol.id}`,
        type: "column",
        name: "Volume",
        yAxis: 1,
        // data: [
        //   194.1,
        //   95.6,
        //   {
        //     dataLabels: {
        //       enabled: true,
        //       align: "left",
        //       style: {
        //         fontWeight: "bold",
        //       },
        //       x: 3,
        //       verticalAlign: "middle",
        //       overflow: true,
        //       crop: false,
        //     },
        //     y: 54.4,
        //   },
        // ],
        // visible: false,
      },
    ],
  };

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

  const processChartData = (
    data,
    addPrevDayData,
    timeframe,
    isTimeframeClick
  ) => {
    if (!chartRef.current) return;
    const chart = chartRef.current.chart;
    const series = chart.series[0];
    const volumeSeries = chart.series[1];

    const lastPoint = series.options?.data.at(-1);
    const lastVolumePoint = volumeSeries.options?.data.at(-1);

    const volumeData = [];
    const allData = [];

    data.forEach((d) => {
      allData.push([d.time, d.open, d.high, d.low, d.close]);
      if (d.volume) volumeData.push([d.time, d.volume]);
    });

    if (lastPoint) {
      const xAxis = series.xAxis;
      const dataMin = xAxis.dataMin;
      const dataMax = xAxis.dataMax;
      if (addPrevDayData) {
        // series.update({
        //   data: allData,
        // });
        if (allData.length)
          series.setData(
            allData.concat(series.options.data),
            false,
            false,
            false
          );
        if (volumeData.length)
          volumeSeries.setData(
            volumeData.concat(volumeSeries.options.data),
            false,
            false,
            false
          );
        // allData.forEach((d) => series.addPoint(d, false, false, false));
        // volumeData.forEach((d) =>
        //   volumeSeries.addPoint(d, false, false, false)
        // );
        // if (timeframe !== "1minute") xAxis.setExtremes(dataMin, xAxis.dataMax);
        if (allData.length) chart.redraw();
        if (isTimeframeClick && timeframe !== "1minute")
          xAxis.setExtremes(dataMin, xAxis.dataMax);
        // if (loading) setLoading(false);
      } else {
        const newData = allData.filter((d) => d[0] > lastPoint[0]);
        const newVolume = volumeData.filter((d) => d[0] > lastVolumePoint[0]);
        const newLastPoint = allData.at(-1);
        if (
          !newData.length &&
          lastPoint[0] === newLastPoint[0] &&
          lastPoint[4] !== newLastPoint[4]
        ) {
          series.removePoint(series.data.length - 1, false, false);
          series.addPoint(newLastPoint, true, false, false);
          // chart.redraw();
          // series.setData(newData, true, false, true);
        } else {
          newData.forEach((d) => series.addPoint(d, true, false, false));
          newVolume.forEach((d) =>
            volumeSeries.addPoint(d, true, false, false)
          );
          if (loading) setLoading(false);
        }
      }
    } else {
      if (allData.length) series.setData(allData, false, false, false);
      if (volumeData.length)
        volumeSeries.setData(volumeData, false, false, false);
      chart.hideLoading();
      chart.redraw();
      window.document.getElementById("sidebar").style.pointerEvents = "unset";
      window.document.getElementById("nav-buttons").style.pointerEvents =
        "unset";
      const xAxis = series.xAxis;
      // xAxis.setExtremes(series.xData.at(-100), xAxis.dataMax);
      xAxis.setExtremes(
        xAxis.dataMax - (xAxis.dataMax - xAxis.dataMin) / 15,
        xAxis.dataMax
      );
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chart;
      window.document.getElementById("sidebar").style.pointerEvents = "none";
      window.document.getElementById("nav-buttons").style.pointerEvents =
        "none";
      chart.showLoading();
    }

    const unsub = getSymbolPriceHistory(symbol.id, processChartData);
    return () =>
      unsub.then((unsub) => {
        if (unsub) unsub();
      });
  }, []);

  const handleTimeFrame = (timeframe) => {
    const timeFrameLabel = timeframe.value.flat().reverse().join("");
    if (dataGroup.flat().reverse().join("") === timeFrameLabel) return;
    if (!chartRef.current) return;
    setDataGroup(timeframe.value);
    if (timeFrameLabel === "1minute") return;
    const chart = chartRef.current.chart;
    chart.showLoading();
    const xAxis = chart.xAxis[0];
    const loadingCallback = () => {
      chart.hideLoading();
    };
    getSymbolPriceHistoryInAir(
      symbol.id,
      new Date(xAxis.dataMin).toISOString().slice(0, 10),
      processChartData,
      timeframe.value,
      loadingCallback,
      true
    );
  };

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
    <div className={hide ? "d-none" : "h-100"}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        constructorType={"stockChart"}
        containerProps={{
          style: {
            // flex: 1,
            // width: "99%",
            height: "89%",
            // border: "thin solid red",
          },
        }}
      />
      <div id="timeframe" className="float-start flex align-items-center gap-2">
        <label>Timeframe</label>
        {TIMEFRAMES.map((timeframe, i) => (
          <button
            key={i}
            className={timeframe.value === dataGroup ? "selected" : ""}
            onClick={() => handleTimeFrame(timeframe)}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
      <select
        id="timezone"
        value={timezone}
        onChange={(e) => setTimeZone(e.target.value)}
        className="float-end border-0 text-end"
      >
        {timezoneList.map((timezone, i) => (
          <option key={i} value={timezone}>
            {timezone}
          </option>
        ))}
      </select>
    </div>
  );
}
