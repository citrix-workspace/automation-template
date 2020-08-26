const { setupIntgration } = require('./src/helpers/setupIntegration');
const { config } = require('./config');
const { shouldConfigureIntegrations } = config;
module.exports = async () => {
    console.log('Runnig Setup Integration');
    if (shouldConfigureIntegrations) {
        await setupIntgration();
    }
};
