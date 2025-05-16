import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl:'https://projet-mean-backend.onrender.com/api'
};
