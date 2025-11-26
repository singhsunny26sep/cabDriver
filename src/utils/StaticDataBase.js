import images from "../assets/Icons";

export const GenderData = [
  { value: 'male', name: 'Male' },
  { value: 'female', name: 'Female' },
  { value: 'other', name: 'Other' },
];

export const CityData = [
  'Junagadh',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Ahmedabad',
];
export const vehicleTypeData = [
  { value: 'car', name: 'Car' },
  { value: 'bike', name: 'Bike' },
  { value: 'taxi', name: 'Taxi' },
  { value: 'cycle', name: 'Cycle' },
];
export const vehicleTransmissionTypeData = [
  { value: 'manual', name: 'Manual' },
  { value: 'automatic', name: 'Automatic' },
  { value: 'semi-automatic', name: 'Semi-Automatic' },
];
export const fuelTypes = [
  {name: 'Petrol', value: 'petrol'},
  {name: 'Diesel', value: 'diesel'},
  {name: 'Electric', value: 'electric'},
  {name: 'CNG', value: 'cng'},
  {name: 'Manual', value: 'manual'},
];
export const carTypes = [
  {label: 'Sedan', value: 'sedan'},
  {label: 'SUV', value: 'suv'},
  {label: 'Hatchback', value: 'hatchback'},
];
export const seatOptions = [
  {name: '2 Seats', value: '2'},
  {name: '4 Seats', value: '4'},
  {name: '5 Seats', value: '5'},
  {name: '7 Seats', value: '7'},
];
export const luggageOptions = [
  {name: '1 bags', value: '1'},
  {name: '2 bags', value: '2'},
  {name: '3 bags', value: '3'},
  {name: '4 bags', value: '4'},
  {name: '5 bags', value: '5'},
];

export const transportOptions = [
  {id: 1, name: 'Car', icon: images.Car},
  {id: 2, name: 'Taxi', icon: images.Taxi},
  {id: 3, name: 'Bike', icon: images.Bike},
  {id: 4, name: 'Parcel', icon: images.Cycle},
];

  export  const earningData = {
    totalHour: '01',
    totalMiles: '80',
    totalEarning: '100',
    rides: [
      {
        id: '1',
        name: 'Byron Barlow',
        miles: '4.5 Miles',
        duration: '10 Mins',
        earning: '58.00',
      },
      {
        id: '2',
        name: 'Carla Schoen',
        miles: '4.5 Miles',
        duration: '10 Mins',
        earning: '58.00',
      },
      {
        id: '3',
        name: 'Robert Fox',
        miles: '4.5 Miles',
        duration: '10 Mins',
        earning: '58.00',
      },
      {
        id: '4',
        name: 'Darlene Robertson',
        miles: '4.5 Miles',
        duration: '10 Mins',
        earning: '58.00',
      },
      {
        id: '5',
        name: 'Ralph Edwards',
        miles: '4.5 Miles',
        duration: '10 Mins',
        earning: '58.00',
      },
      {
        id: '6',
        name: 'Courtney Henry',
        miles: '4.5 Miles',
        duration: '10 Mins',
        earning: '58.00',
      },
    ],
  };

  export   const bookings = [
    {
      id: '1',
      rider: {
        name: 'Jenny Wilson',
        crn: '#854HGZ3',
        avatar: null,
      },
      ride: {
        distance: '4.5 Mile',
        duration: '4 mins',
        price: '$1.25',
        date: 'Oct 18, 2023',
        time: '08:00 AM',
        pickup: '6391 Elgin St. Celina, Delawa...',
        dropoff: '1901 Thornridge Cir. Sh...',
        carType: 'Sedan',
      },
      coordinates: {
        pickup: {
          latitude: 37.78825,
          longitude: -122.4324,
        },
        dropoff: {
          latitude: 37.79825,
          longitude: -122.4424,
        },
      },
    },
    {
        id: '2',
        rider: {
          name: 'Jenny Wilson',
          crn: '#854HGZ3',
          avatar: null,
        },
        ride: {
          distance: '4.5 Mile',
          duration: '4 mins',
          price: '$1.25',
          date: 'Oct 18, 2023',
          time: '08:00 AM',
          pickup: '6391 Elgin St. Celina, Delawa...',
          dropoff: '1901 Thornridge Cir. Sh...',
          carType: 'Sedan',
        },
        coordinates: {
          pickup: {
            latitude: 37.78825,
            longitude: -122.4324,
          },
          dropoff: {
            latitude: 37.79825,
            longitude: -122.4424,
          },
        },
      },
  ];


  export const notificationData = [
    {
      id: 1,
      title: 'Ride Request from Joshua',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '1h',
      type: 'user',
      date: 'TODAY'
    },
    {
      id: 2,
      title: 'Josh Cancel Pre-Book Ride',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '1h',
      type: 'user',
      date: 'TODAY'
    },
    {
      id: 3,
      title: 'Received Payment',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis',
      time: '1h',
      type: 'payment',
      date: 'TODAY'
    },
    {
      id: 4,
      title: 'Ride Cancel Successfully',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '1d',
      type: 'user',
      date: 'YESTERDAY'
    },
  ];
  export const driverCancelRideReasons = [
    { name: 'Customer not at pickup location', value: 'customer_not_at_pickup' },
    { name: 'Customer unreachable (call/chat)', value: 'customer_unreachable' },
    { name: 'Customer requested out-of-service area', value: 'out_of_service_area' },
    { name: 'Customer misbehaved/rude', value: 'customer_misbehavior' },
    { name: 'Customer requested vehicle overloading', value: 'vehicle_overload' },
    { name: 'Vehicle breakdown', value: 'vehicle_breakdown' },
    { name: 'Flat tire/puncture', value: 'flat_tire' },
    { name: 'Low fuel/emergency', value: 'low_fuel' },
    { name: 'Vehicle not starting', value: 'vehicle_not_starting' },
    { name: 'Driver unwell', value: 'driver_unwell' },
    { name: 'Personal emergency', value: 'personal_emergency' },
    { name: 'Shift ended', value: 'shift_ended' },
    { name: 'Heavy traffic at pickup', value: 'heavy_traffic' },
    { name: 'Police checkpoint', value: 'police_checkpoint' },
    { name: 'Unsafe weather conditions', value: 'bad_weather' }
  ]