import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../EditMenu';

import Chart from 'react-apexcharts';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';
import { api } from '../../server/api';
import { useAuth } from '../../context/AuthContext';

function DashboardCard01() {
  const [balance, setBalance] = useState(0)
  const [date, setDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useAuth()

  const [value, setValue] = useState([]);

  async function handleGetStatement() {
    const response = await api.get('/statement/month').finally(() => setIsLoading(false))
    const data = response.data.data

    const newDate = data.map((item) => {
      if (item.type === 'credit') {
        /* return Intl.DateTimeFormat('pt-BR').format(new Date(item.createdAt)) */
        return item.createdAt
      }
    })

    setDate(state => {
      const date = newDate.filter(i => i !== undefined)

      return date
    })

    const newValue = data.map((item) => {
      if (item.type === 'credit') {
        return item.amount
      }
    })

    setValue(state => {
      const value = newValue.filter(i => i !== undefined)

      return value
    })

    const responseBalance = await api.get('/balance')
    const dataBalance = responseBalance.data.data

    setBalance(dataBalance)
    //setListStatement(data)

  }

  const options = {
    chart: {
      toolbar: {
        show: false
      },

      zoom: {
        enabled: false
      },

      foreColor: '',

    },
    grid: {
      show: false
    },
    dataLabels: {
      enabled: false

    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        color: 'white',
        show: false
      },
      axisTicks: {
        color: 'white',
        show: false
      },
      crosshairs: { show: false },
      categories: date,
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    fill: {
      opacity: 0.3,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    },


  }

  const series = [
    { name: 'series1', data: value }
  ]

  console.log(date, value)

  useEffect(() => {
    handleGetStatement()
  }, [token])


  const chartData = {
    labels: /* date */[
      '12-01-2020', '01-01-2021', '02-01-2021',
      '03-01-2021', '04-01-2021', '05-01-2021',
      '06-01-2021', '07-01-2021', '08-01-2021',
      '09-01-2021', '10-01-2021', '11-01-2021',
      '12-01-2021', '01-01-2022', '02-01-2022',
      '03-01-2022', '04-01-2022', '05-01-2022',
      '06-01-2022', '07-01-2022', '08-01-2022',
      '09-01-2022', '10-01-2022', '11-01-2022',
      '12-01-2022', '01-01-2023',
    ],
    datasets: [
      // Indigo line
      {
        data: /* value */[
          732, 610, 610, 504, 504, 504, 349,
          349, 504, 342, 504, 610, 391, 192,
          154, 273, 191, 191, 126, 263, 349,
          252, 423, 622, 470, 532,
        ],
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        clip: 20,
      },
      // Gray line
      {
        data: /* value */[
          532, 532, 532, 404, 404, 314, 314,
          314, 314, 314, 234, 314, 234, 234,
          314, 314, 314, 388, 314, 202, 202,
          202, 202, 314, 720, 642,
        ],
        borderColor: tailwindConfig().theme.colors.slate[300],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.slate[300],
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
      <div className="px-5 pt-5">

        <h2 className="text-lg font-semibold text-slate-400 mb-2">Dinheiro em caixa</h2>
        {/* <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Sales</div> */}
        <div className="flex items-start">
          <div className="text-3xl font-bold text-green-500 mr-2">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}</div>
          {/* <div className="text-sm font-semibold text-white px-1.5 bg-green-500 rounded-full">+49%</div> */}
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow px-5">
        {/* Change the height attribute to adjust the chart height */}
        {/* <LineChart data={chartData} width={389} height={128} /> */}
        <Chart options={options} series={series} type="area" height={128} />
      </div>
    </div>
  );
}

export default DashboardCard01;
