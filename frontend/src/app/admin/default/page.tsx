'use client';

import {
  Box,
  Flex,
  FormLabel,
  Image,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Text,
} from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import Conversions from 'components/temperature/temperature';
import IconBox from 'components/icons/IconBox';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import SwitchField from 'components/fields/SwitchField';
import { useEffect, useState } from "react";
import tableDataComplex from 'views/admin/dataTables/variables/tableDataComplex';
import ConversionPressure from 'components/pressure/pressure'
import PressureTemp from 'components/pressuretemp/pressuretemp';
import LineAreaChart from 'components/charts/LineAreaChart';
import Speed from 'components/speed/speed';
import Histogram from 'views/admin/default/components/TemperatureChart';

export default function Default() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [utsValue, setUtsValue] = useState(null);
  const [elongationValue, setElongationValue] = useState(null);
  const [conductivityValue, setConductivityValue] = useState(null);
  const [tableDataCheck, setTableDataCheck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRealTimePredictionEnabled, setIsRealTimePredictionEnabled] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Function to fetch data
  /*!const fetchData = async () => {
    try {
      setError(null);

      const response = await fetch(`${apiUrl}/api/final_prediction`);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      setUtsValue(data.predictions.uts || 0);
      setElongationValue(data.predictions.elongation || 0);
      setConductivityValue(data.predictions.conductivity || 0);

      const updatedTableData = Object.keys(data.differences).map((key) => ({
        parameter: [key],
        original: data.original[key],
        difference: data.differences[key],
        lock: false,
      }));

      setTableDataCheck(updatedTableData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [apiUrl]);

 // Real-time prediction toggle effect
 useEffect(() => {
  let interval;
  if (isRealTimePredictionEnabled) {
    interval = setInterval(() => {
      fetchData();
    }, 10000); // Fetch every 10 seconds
  } else {
    clearInterval(interval);
  }
  return () => clearInterval(interval);
}, [isRealTimePredictionEnabled]);


  // if (loading) {
  //   return (
  //     <Flex justify="center" align="center" h="100vh">
  //       <Spinner size="xl" />
  //       <Text ml="4">Loading data...</Text>
  //     </Flex>
  //   );
  // }*/

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 3 }}
        gap="20px"
        mb="20px"
      >
        <TotalSpent parameter="UTS" />
        <TotalSpent parameter="Elongation" />
        <TotalSpent parameter="Conductivity" />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
        <PressureTemp parameterSet={1}/>
        <PressureTemp parameterSet={2}/>
        <PressureTemp parameterSet={3}/>
        <PressureTemp parameterSet={4}/>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <LineAreaChart/>
        <Speed />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} gap="20px">
          <PieCard />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} gap="20px">
          <WeeklyRevenue />
        </SimpleGrid>
        <SwitchField
        reversed={true}
        fontSize="sm"
        mb="20px"
        id="2"
        label="Real Time Monitoring"
        isChecked={isRealTimePredictionEnabled}
        onChange={() => setIsRealTimePredictionEnabled((prev) => !prev)}
      />
      </SimpleGrid>
    </Box>
  );
}
