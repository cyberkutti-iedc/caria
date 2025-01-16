export const CHART_DATA = {
  labels: [
    "0",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Carbon Emissions",
      data: [0,12, 19, 3, 5, 2, 3, 9, 13, 4, 9, 18, 9],
      borderColor: ["#FF0000"],
      tension: 0.1,
      pointStyle: false,
    },
    {
      label: "FL2 Emissions",
      data: [0,13, 4, 9, 18, 9, 7, 11, 12, 19, 3, 5, 2],
      borderColor: ["#0000FF"],
      tension: 0.1,
      pointStyle: false,
    },
  ],
};
