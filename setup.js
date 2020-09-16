const { setupIntgration } = require('./src/helpers/setupIntegration');
const { config } = require('./config');
const { shouldConfigureIntegrations } = config;
module.exports = async () => {
    if (shouldConfigureIntegrations) {
        console.log('Runnig Setup Integration');
        await setupIntgration();
    }
};
