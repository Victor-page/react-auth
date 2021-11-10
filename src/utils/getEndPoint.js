const url = 'https://identitytoolkit.googleapis.com/v1/accounts:';

const parameters = '?key=AIzaSyDueCdt9k7KiGNsVEgE2hBJO7yFgTopItQ';

const getEndpoint = (endPointSpecifier) =>
  `${url}${endPointSpecifier}${parameters}`;

export default getEndpoint;
