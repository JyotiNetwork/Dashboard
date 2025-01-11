import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import Table from './Table';
import { parseCSVData, getElectricVehicleTypes } from '../utils/dataProcessing';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  useEffect(() => {
    fetch('/data/Electric_Vehicle_Population_Data.csv')
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData = parseCSVData(csvData);
        setData(parsedData);

        const vehicleTypes = getElectricVehicleTypes(parsedData);
        const typeCounts = vehicleTypes.map(
          (type) => parsedData.filter((vehicle) => vehicle['Electric Vehicle Type'] === type).length
        );

        setChartData({ labels: vehicleTypes, values: typeCounts });
      });
  }, []);

  return (
    <div className="container">
      <h1>Electric Vehicle Dashboard</h1>
      <Chart data={chartData} />
      <Table data={data} />
    </div>
  );
};

export default Dashboard;