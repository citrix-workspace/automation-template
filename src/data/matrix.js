const path = require('path');
module.exports = {
    integrations: {
        integration: {
            settings: {
                name: '',
                pathToFile: path.resolve(__dirname, '../data/**.mapp'),
                configuration: {},
                secrets:{},
            },
            microapps: {
                microapp1: {
                    subscribers: ['user1@citrix.com', 'user1@citrix.com'],
                },
                microapp2: {
                    subscribers: ['user2@citrix.com', 'user3@citrix.com'],
                },
            },
        },
    },
};
