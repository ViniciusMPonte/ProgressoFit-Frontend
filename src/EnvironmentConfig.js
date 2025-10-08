export default class EnvironmentConfig {
    static ENVIRONMENT = 'develop';
    //static ENVIRONMENT = 'production';

    static API_URL = this.ENVIRONMENT === 'production'
        ? 'https://progressofit-backend.onrender.com'
        : 'https://progressofit-backend.onrender.com';
        //: 'http://localhost:8090';

    static BASE_URL = this.ENVIRONMENT === 'production'
        ? '/ProgressoFit-Frontend'
        : '';
}