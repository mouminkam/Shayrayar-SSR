import axiosInstance from './config/axios';

export const getDeliveryQuote = async (dropoff) => {
  const response = await axiosInstance.post('/delivery/quote', {
    dropoff: {
      lat: dropoff.lat,
      lng: dropoff.lng,
      address: dropoff.address,
    },
  });
  return response;
};

const deliveryAPI = {
  getDeliveryQuote,
};

export default deliveryAPI;

