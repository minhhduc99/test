import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
    return (): Promise<any> => {
        return new Promise(async (resolve, reject) => {
          try {
            let authenticated = await keycloak.init({
                config: {
                    url: environment.keycloak.auth_server_url,
                    realm: environment.keycloak.realm,
                    clientId: environment.keycloak.resource
                },
              loadUserProfileAtStartUp: false,

              initOptions: {
                onLoad: 'check-sso',
                checkLoginIframe: false,
                silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
              },

              bearerExcludedUrls: []
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
}
