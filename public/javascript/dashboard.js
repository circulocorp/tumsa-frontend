

/*
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Jan 18", "Feb 18", "Mar 18", "April 18", "May 18", "Jun 18", "July 18", "Aug 18", "Sep 18", "Oct 18", "Nov 18", "Dic 18", "Jan 19"],
    datasets: [{
      label: "Memory Usage (MB)",
      lineTension: 0.3,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: [200, 300, 500, 100, 100, 200, 220, 1000, 1500, 1400, 1050, 1000, 800],
    },{
      label: "CPU Usage (MHz)",
      lineTension: 0.3,
      backgroundColor: "rgba(47, 244, 5,0.2)",
      borderColor: "rgba(47, 244, 5,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(47, 244, 5,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(47, 244, 5,1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: [100, 200, 100, 100, 100, 500, 500, 300, 350, 340, 350, 310, 500],
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 2000,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: true
    }
  }
});
*/

