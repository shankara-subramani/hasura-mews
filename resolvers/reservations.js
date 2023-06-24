const { GraphQLError } = require("graphql");
const axios = require("axios");

// access environment variables
const ENDPOINT = process.env.MEWS_BASE_URL;
const ACCESS_TOKEN = process.env.MEWS_ACCESS_TOKEN;
const CLIENT_TOKEN = process.env.MEWS_CLIENT_TOKEN;
const CLIENT = process.env.MEWS_CLIENT;

const getReservations = async (start, end) => {
  if (!start || !end) {
    throw new GraphQLError("no start or end date provided");
  }

  try {
    const data = JSON.stringify({
      ClientToken: CLIENT_TOKEN,
      AccessToken: ACCESS_TOKEN,
      Client: CLIENT,
      StartUtc: start,
      EndUtc: end,
      Extent: {
        Reservations: true,
        Resources: true,
        Customers: true,
        ReservationGroups: false,
      },
    });
    const config = {
      method: "post",
      url: `${ENDPOINT}/reservations/getAll`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    return axios(config)
      .then(function (response) {
        const {
          Services,
          Products,
          Resources,
          ResourceCategories,
          ResourceCategoryAssignments,
          BusinessSegments,
          Rates,
          RateGroups,
          Items,
          OrderItems,
          Notes,
          QrCodeData,
          Companies,
          ResourceAccessTokens,
          AgeCategories,
          ChannelManagerReservations,
          Cursor,
          Customers,
          ReservationGroups,
          Reservations,
        } = response.data;

        const findCustomer = (customer_id) => {
          let customer = Customers.find(
            (customer) => customer.Id === customer_id
          );
          return {
            Customer: {...customer},
          };
        };
        const findRoom = (resource_id) => {
          let resource = Resources.find(
            (resource) => resource.Id === resource_id
          );
          return {
            Room: {...resource},
          };
        };
        const result = {
          Services,
          Products,
          Resources,
          ResourceCategories,
          ResourceCategoryAssignments,
          BusinessSegments,
          Rates,
          RateGroups,
          Items,
          OrderItems,
          Notes,
          QrCodeData,
          Companies,
          ResourceAccessTokens,
          AgeCategories,
          ChannelManagerReservations,
          Cursor,
          Customers,
          ReservationGroups,
          Reservations: Reservations.map((reservation) => ({
            ...reservation,
            ...findCustomer(reservation.CustomerId),
            ...findRoom(reservation.AssignedResourceId),
          })),
        };
        return result;
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (e) {
    throw new GraphQLError(e);
  }
};

const resolvers = {
  Query: {
    getReservations: async (_, args) => {
      let response;
      try {
        response = await getReservations(args.startUTC, args.endUTC);
        return response;
      } catch (e) {
        throw e;
      }
    },
  },
};
module.exports = resolvers;
