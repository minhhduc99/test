export const environment = {
  production: true,
  base_url: 'http://107.113.53.220:3000',
  keycloak: {
    realm: "sysops-svmc-services",
    //auth_server_url: "https://107.113.53.220:18443/auth/",
    auth_server_url: "http://107.113.53.220:18094/auth/",
    resource: "fem"
  }
};