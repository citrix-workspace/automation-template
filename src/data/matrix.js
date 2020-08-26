module.exports = {
    integrations: {
        integration: {
            settings: {
                name: '',
                pathToFile: '../data/**.mapp',
                configuration: {},
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
