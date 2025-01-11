import Papa from 'papaparse';

export const parseCSVData = (data) => {
  const lines = data.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());
  const jsonData = lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || null;
      return obj;
    }, {});
  });
  return jsonData.filter((item) => item.VIN); // Filter out any empty rows
};

export const getElectricVehicleTypes = (data) => {
  const types = data.map((vehicle) => vehicle['Electric Vehicle Type']);
  return [...new Set(types)]; // Return unique types
};

export const processCSVData = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const processedData = results.data.map(row => ({
          vin: row.VIN,
          county: row.County,
          city: row.City,
          state: row.State,
          zip: row.Zip,
          modelYear: parseInt(row.ModelYear),
          make: row.Make,
          model: row.Model,
          electricVehicleType: row['Electric Vehicle Type'],
          eligibility: row['Clean Alternative Fuel Vehicle (CAFV) Eligibility'],
          electricRange: parseInt(row['Electric Range']) || 0,
          // Add more fields as needed based on your CSV structure
        }));
        resolve(processedData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const calculateStats = (data) => {
  const totalVehicles = data.length;
  // Add more calculations as needed
  return { totalVehicles };
};