import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { processEVData, calculateStatistics } from './dataProcessing';

const EVDashboard = ({ csvData }) => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    county: 'all',
    make: 'all',
    year: 'all'
  });

  useEffect(() => {
    const processedData = processEVData(csvData);
    setData(processedData);
    setFilteredData(processedData);
    setStats(calculateStatistics(processedData));
  }, [csvData]);

  useEffect(() => {
    let result = data;
    
    if (filters.county !== 'all') {
      result = result.filter(item => item.county === filters.county);
    }
    if (filters.make !== 'all') {
      result = result.filter(item => item.make === filters.make);
    }
    if (filters.year !== 'all') {
      result = result.filter(item => item.year === parseInt(filters.year));
    }

    setFilteredData(result);
    setStats(calculateStatistics(result));
  }, [filters, data]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const prepareChartData = (distribution) => {
    return Object.entries(distribution || {})
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  if (!stats) return <div>Loading...</div>;

  const makeData = prepareChartData(stats.makeDistribution).slice(0, 6);
  const typeData = prepareChartData(stats.typeDistribution);
  const countyData = prepareChartData(stats.countyDistribution).slice(0, 8);
  const yearData = prepareChartData(stats.yearDistribution)
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  return (
    <div className="w-full space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Electric Vehicle Dashboard</h1>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <select 
            className="p-2 border rounded"
            value={filters.county}
            onChange={(e) => setFilters({...filters, county: e.target.value})}
          >
            <option value="all">All Counties</option>
            {Object.keys(stats.countyDistribution).sort().map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
          <select 
            className="p-2 border rounded"
            value={filters.make}
            onChange={(e) => setFilters({...filters, make: e.target.value})}
          >
            <option value="all">All Makes</option>
            {Object.keys(stats.makeDistribution).sort().map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
          <select 
            className="p-2 border rounded"
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
          >
            <option value="all">All Years</option>
            {Object.keys(stats.yearDistribution).sort().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalVehicles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Makes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.uniqueMakes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Range</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgRange} miles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Counties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.uniqueCounties}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Manufacturers</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart width={400} height={300}>
              <Pie
                data={makeData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {makeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Types</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart width={400} height={300} data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration by Year</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart width={400} height={300} data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Counties</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart width={400} height={300} data={countyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details ({filteredData.length} vehicles)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Year</th>
                  <th className="p-2 text-left">Make</th>
                  <th className="p-2 text-left">Model</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Range</th>
                  <th className="p-2 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 10).map((vehicle) => (
                  <tr key={vehicle.vin} className="border-b">
                    <td className="p-2">{vehicle.year}</td>
                    <td className="p-2">{vehicle.make}</td>
                    <td className="p-2">{vehicle.model}</td>
                    <td className="p-2">{vehicle.type}</td>
                    <td className="p-2">{vehicle.range} mi</td>
                    <td className="p-2">{`${vehicle.city}, ${vehicle.county}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 10 && (
              <p className="text-sm text-gray-500 mt-2">Showing first 10 of {filteredData.length} vehicles</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EVDashboard;