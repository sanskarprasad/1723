// Chakra imports
import { Flex, useColorModeValue, Button, Heading } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic imports for Gauge and Thermometer components
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });
import Thermometer from 'react-thermometer-component';

export default function PressureTemp({ parameterSet, ...rest }: { parameterSet: number }) {
	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'navy.700');

	// State to hold parameter values
	const [parameters, setParameters] = useState({
		emulsionTemp: 'N/A',
		emulsionPressure: 'N/A',
		gearOilTemp: 'N/A',
		gearOilPressure: 'N/A',
		standOilTemp: 'N/A',
		standOilPressure: 'N/A',
	});

	// Fetch data from CSV
	useEffect(() => {
		async function fetchData() {
			const response = await fetch('/data/oil_emulsion_data.csv'); // Adjust the path if needed
			const text = await response.text();
			const rows = text.split('\n').map((row) => row.split(','));
			// Assuming the CSV format: Timestamp,EmulsionTemp,EmulsionPressure,GearOilTemp,GearOilPressure,StandOilTemp,StandOilPressure
			const latest = rows[rows.length - 2]; // Skipping header row

			setParameters({
				emulsionTemp: parseFloat(latest[1]) || 'N/A',
				emulsionPressure: parseFloat(latest[2]) || 'N/A',
				gearOilTemp: parseFloat(latest[3]) || 'N/A',
				gearOilPressure: parseFloat(latest[4]) || 'N/A',
				standOilTemp: parseFloat(latest[5]) || 'N/A',
				standOilPressure: parseFloat(latest[6]) || 'N/A',
				coolingWaterTemp: parseFloat(latest[7]) || 'N/A',
				coolingWaterPressure: parseFloat(latest[8]) || 'N/A',
			});
		}
		fetchData();
	}, []);

	// Helper to get current parameter set
	const getCurrentParameterSet = () => {
		switch (parameterSet) {
			case 1:
				return {
					temp: parameters.emulsionTemp,
					pressure: parameters.emulsionPressure,
					label: 'Emulsion',
				};
			case 2:
				return {
					temp: parameters.gearOilTemp,
					pressure: parameters.gearOilPressure,
					label: 'Gear Oil',
				};
			case 3:
				return {
					temp: parameters.standOilTemp,
					pressure: parameters.standOilPressure,
					label: 'Stand Oil',
				};
			case 4:
				return {
					temp: parameters.coolingWaterTemp,
					pressure: parameters.coolingWaterPressure,
					label: 'CW',
				};
			default:
				return { temp: 'N/A', pressure: 'N/A', label: 'Unknown' };
		}
	};

	const currentParameters = getCurrentParameterSet();

	return (
		<Flex flexDirection="column" gap="20px" {...rest}>
			{/* Selected Parameter Display */}
			<Card p="20px" alignItems="start" flexDirection="column" w="100%">
				{/* Heading at top-left */}
				<Heading as="h2" size="lg" mb="10px" color={textColor}>
					{currentParameters.label} Parameters
				</Heading>
				<Flex justifyContent="space-around" w="100%">
					<Flex flexDirection="column" alignItems="center" textAlign="center" mx="10px">
						<Thermometer
							theme="light"
							value={currentParameters.temp === 'N/A' ? 0 : parseFloat(currentParameters.temp)}
							max={parameterSet === 1 ? 200 : parameterSet === 2 ? 100 : 120}
							steps="5"
							format="°C"
							size="large"
							height="300"
						/>
						<MiniStatistics name={`${currentParameters.label} Temperature`} value={`${currentParameters.temp} °C`} />
					</Flex>
					<Flex flexDirection="column" alignItems="center" textAlign="center" mx="10px">
						<GaugeComponent
							id={`${currentParameters.label.toLowerCase()}-pressure-gauge`}
							value={currentParameters.pressure === 'N/A' ? 0 : parseFloat(currentParameters.pressure)}
							minValue={0}
							maxValue={parameterSet === 1 ? 5 : 3}
							arc={{
								gradient: true,
								width: 0.15,
								subArcs: [
									{ limit: parameterSet === 1 ? 1.5 : 1, color: '#EA4228' },
									{ limit: parameterSet === 1 ? 3.5 : 2, color: '#F5CD19' },
									{ limit: parameterSet === 1 ? 5 : 3, color: '#5BE12C' },
								],
							}}
							pointer={{ type: 'arrow', elastic: true }}
						/>
						<MiniStatistics name={`${currentParameters.label} Pressure`} value={`${currentParameters.pressure} kPa`} />
					</Flex>
				</Flex>
			</Card>
		</Flex>
	);
}
