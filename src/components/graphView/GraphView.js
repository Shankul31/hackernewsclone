import React from "react";
import { LineChart } from "react-charts-d3";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function GraphView({ data }) {
  let newsIds = [];
  let upVotes = []
  let chartOptions = JSON.parse(JSON.stringify(data));
  chartOptions.forEach((element) => {
    newsIds.push(element.id);
    upVotes.push(element.upVoteCount)
  });

  //   let chartData = data.map((item) => {
  //     return item.id;
  //   });
  console.log("data", newsIds);

  //   const options = {
  //     series: [
  //       {
  //         name: "ID",
  //         data: chartData,
  //       },
  //       {

  //       }
  //     ],
  //   };
  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: newsIds,
    },
    yAxis: {
      title: {
        text: "Votes",
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },
    series: [
      {
        name: "ID",
        data: upVotes,
      },
    ],
  };
  return <HighchartsReact Highcharts={Highcharts} options={options} />;
}

export default GraphView;
