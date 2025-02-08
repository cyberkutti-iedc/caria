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
      data: [0, 12, 19, 3, 5, 2, 3, 9, 13, 4, 9, 18, 9],
      borderColor: "#FF4DCA",
      tension: 0.3,
      pointStyle: "line",
    },
    {
      label: "FL5 Emissions",
      data: [0, 13, 4, 9, 18, 9, 7, 11, 12, 19, 3, 5, 2],
      borderColor: "#3EB7E5",
      tension: 0.3,
      pointStyle: "line",
    },
    {
      label: "Methane Emissions",
      data: [0, 10, 15, 8, 12, 6, 4, 10, 14, 7, 10, 15, 8],
      borderColor: "#F68D7D",
      tension: 0.3,
      pointStyle: "line",
    },
  ],
};