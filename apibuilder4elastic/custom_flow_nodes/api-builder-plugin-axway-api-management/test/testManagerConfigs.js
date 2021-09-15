const { expect } = require('chai');
const { parseAPIManagerConfig, checkAPIManagers, getManagerConfig } = require('../src/utils');
const simple = require('simple-mock');
const nock = require('nock');

describe('Test API-Manager configuration variations', () => {
    var options = { logger: {
        info: simple.mock(),
        trace: simple.mock(),
        error: simple.mock(), 
        debug: simple.mock()
    } };

    describe('Test API-Manager parsing', () => {
        it('should succeed with a single API-Manager configured', async () => {
            const pluginConfig = { 
                apimanager: {
				    url: "http://my.api-manager.com:8075", 
				    username: "user", password: "password" 
                }
			};
            var expectedManagers = {
                url: "http://my.api-manager.com:8075", username: "user", password: "password",
                "configs": {
                    "default": {
                        url: "http://my.api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            await parseAPIManagerConfig(pluginConfig, options);
            expect(pluginConfig.apimanager).to.deep.equal(expectedManagers);
        });

        it('should succeed without giving an API-Manager', async () => {
            const pluginConfig = { 
                apigateway: { url: "http://my.api-gateway.com:8090" },
                apimanager: {
				    username: "user", password: "password" 
                }
			};
            var expectedManagers = {
                username: "user", password: "password",
                "configs": {
                    "default": {
                        url: "http://my.api-gateway.com:8075/",
                        username: "user", password: "password"
                    }
                }
            }
            await parseAPIManagerConfig(pluginConfig, options);
            expect(pluginConfig.apimanager).to.deep.equal(expectedManagers);
        });

        it('should succeed with a default plus group based API-Manager', async () => {
            const pluginConfig = { 
                apimanager: {
                    url: "http://my.api-manager.com:8075, group-a|http://my.group-a-api-manager.com:8075", 
				    username: "user", password: "password" 
                }
			};
            var expectedManagers = {
                url: "http://my.api-manager.com:8075, group-a|http://my.group-a-api-manager.com:8075", 
                username: "user", password: "password",
                "perGroupAndRegion": true,
                "configs": {
                    "default": {
                        url: "http://my.api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-a": {
                        url: "http://my.group-a-api-manager.com:8075",
                        username: "user", password: "password",
                        group: "group-a"
                    }
                }
            }
            await parseAPIManagerConfig(pluginConfig, options);
            expect(pluginConfig.apimanager).to.deep.equal(expectedManagers);
        });

        it('should succeed with a default plus group plus region based API-Manager', async () => {
            const pluginConfig = { 
                apimanager: {
                    url: "http://my.api-manager.com:8075, group-a|http://my.group-a-api-manager.com:8075, group-b|US|http://my.group-b-us-api-manager.com:8075", 
				    username: "user", password: "password" 
                }
			};
            var expectedManagers = {
                url: "http://my.api-manager.com:8075, group-a|http://my.group-a-api-manager.com:8075, group-b|US|http://my.group-b-us-api-manager.com:8075", 
                username: "user", password: "password",
                "perGroupAndRegion": true,
                "configs": {
                    "default": {
                        url: "http://my.api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-a": {
                        url: "http://my.group-a-api-manager.com:8075",
                        username: "user", password: "password",
                        group: "group-a"
                    },
                    "group-b###us": {
                        url: "http://my.group-b-us-api-manager.com:8075",
                        username: "user", password: "password",
                        group: "group-b",
                        region: "us"
                    }
                }
            }
            await parseAPIManagerConfig(pluginConfig, options);
            expect(pluginConfig.apimanager).to.deep.equal(expectedManagers);
        });

        it('should succeed without a default API-Manager only group based', async () => {
            const pluginConfig = { 
                apimanager: {
                    url: "group-a|http://my.group-a-api-manager.com:8075, group-b|US|http://my.group-b-us-api-manager.com:8075", 
				    username: "user", password: "password" 
                }
			};
            var expectedManagers = {
                url: "group-a|http://my.group-a-api-manager.com:8075, group-b|US|http://my.group-b-us-api-manager.com:8075", 
				username: "user", password: "password",
                "perGroupAndRegion": true,
                "configs": {
                    "group-a": {
                        url: "http://my.group-a-api-manager.com:8075",
                        username: "user", password: "password",
                        group: "group-a"
                    },
                    "group-b###us": {
                        url: "http://my.group-b-us-api-manager.com:8075",
                        username: "user", password: "password",
                        group: "group-b",
                        region: "us"
                    }
                }
            }
            await parseAPIManagerConfig(pluginConfig, options);
            expect(pluginConfig.apimanager).to.deep.equal(expectedManagers);
        });
    });

    describe('Test API-Manager validation', () => {
        
        it('should succeed with a single API-Manager configured using an admin user', async () => {
            
            nock('https://my.api-manager.com:8075').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentAdminUser.json');
            nock('https://my.api-manager.com:8075').post('/api/portal/v1.3/login').reply(303).defaultReplyHeaders({
                'Location': '/home',
                'Set-Cookie': 'APIMANAGERSESSION=8d79fe0a-36c5-4089-ae66-e3e0160baed5;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly'
            });
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var result = await checkAPIManagers(configuredManagers, options);
            expect(result.isValid).to.equal(true);
            expect(configuredManagers.configs.default.isValid).to.equal(true);
        });

        it('should fail with a single API-Manager configured using a normal user', async () => {
            
            nock('https://my.api-manager.com:8075').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentNonAdminUser.json');
            nock('https://my.api-manager.com:8075').post('/api/portal/v1.3/login').reply(303).defaultReplyHeaders({
                'Location': '/home',
                'Set-Cookie': 'APIMANAGERSESSION=8d79fe0a-36c5-4089-ae66-e3e0160baed5;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly'
            });
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var result = await checkAPIManagers(configuredManagers, options);
            expect(result.isValid).to.equal(false);
            expect(configuredManagers.configs.default.isValid).to.equal(false);
        });

        it('should succeed with a multiple API-Managers configured using an admin user', async () => {
            nock('https://my.api-manager.com:8075').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentAdminUser.json');
            nock('https://my.api-manager-group-a.com:8075').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentAdminUser.json');
            nock('https://my.api-manager.com:8075').post('/api/portal/v1.3/login').reply(303).defaultReplyHeaders({
                'Location': '/home',
                'Set-Cookie': 'APIMANAGERSESSION=8d79fe0a-36c5-4089-ae66-e3e0160baed5;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly'
            });
            nock('https://my.api-manager-group-a.com:8075').post('/api/portal/v1.3/login').reply(303).defaultReplyHeaders({
                'Location': '/home',
                'Set-Cookie': 'APIMANAGERSESSION=8d79fe0a-36c5-4089-ae66-e3e0160baed6;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly'
            });
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-a": {
                        url: "https://my.api-manager-group-a.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var result = await checkAPIManagers(configuredManagers, options);
            expect(result.isValid).to.equal(true);
            expect(configuredManagers.configs.default.isValid).to.equal(true);
            expect(configuredManagers.configs.default.isValid).to.equal(true);
        });

        it('should fail with a multiple API-Managers configured one not using an Admin', async () => {
            nock('https://my.api-manager.com:8075').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentAdminUser.json');
            nock('https://my.api-manager-group-a.com:8075').get(`/api/portal/v1.3/currentuser`).replyWithFile(200, './test/testReplies/apimanager/currentNonAdminUser.json');
            nock('https://my.api-manager.com:8075').post('/api/portal/v1.3/login').reply(303).defaultReplyHeaders({
                'Location': '/home',
                'Set-Cookie': 'APIMANAGERSESSION=8d79fe0a-36c5-4089-ae66-e3e0160baed5;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly'
            });
            nock('https://my.api-manager-group-a.com:8075').post('/api/portal/v1.3/login').reply(303).defaultReplyHeaders({
                'Location': '/home',
                'Set-Cookie': 'APIMANAGERSESSION=8d79fe0a-36c5-4089-ae66-e3e0160baed6;Version=1;Comment="Session for API Management";Path=/api/portal/v1.3/;Secure;HttpOnly'
            });
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-a": {
                        url: "https://my.api-manager-group-a.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var result = await checkAPIManagers(configuredManagers, options);
            expect(result.isValid).to.equal(false);
            expect(configuredManagers.configs.default.isValid).to.equal(true);
            expect(configuredManagers.configs['group-a'].isValid).to.equal(false);
        });
    });

    describe('Test Get API-Manager config', () => {
        it('should fail to return an API-Manager without giving region/group and no default configured', async () => {
            var configuredManagers = {
                "configs": {
                    "group-a": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            try {
				await getManagerConfig(configuredManagers);
			} catch(e) {
				expect(e).to.be.an('Error')
				.and.to.have.property('message', 'Cannot return API-Manager config without groupId and region as no default API-Manager is configured.');
			}
        });

        it('should succeed with a default API-Manager without groupId and region', async () => {
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var managerConfig = await getManagerConfig(configuredManagers);
            expect(managerConfig).to.deep.equal({ username: "user", password: "password", url: "https://my.api-manager.com:8075"});
        });

        it('should return default API-Manager if requested groupId is not configured', async () => {
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var managerConfig = await getManagerConfig(configuredManagers, "group-XXX");
            expect(managerConfig).to.deep.equal({ username: "user", password: "password", url: "https://my.api-manager.com:8075"});
        });

        it('should return group based API-Manager for requested group', async () => {
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-a": {
                        url: "https://my.group-a-api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var managerConfig = await getManagerConfig(configuredManagers, "group-a");
            expect(managerConfig).to.deep.equal({ username: "user", password: "password", url: "https://my.group-a-api-manager.com:8075"});
        });

        it('should return group and region based API-Manager', async () => {
            var configuredManagers = {
                "configs": {
                    "default": {
                        url: "https://my.api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-a": {
                        url: "https://my.group-a-api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-b###us": {
                        url: "https://my.group-b-us-api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var managerConfig = await getManagerConfig(configuredManagers, "group-b", "US");
            expect(managerConfig).to.deep.equal({ username: "user", password: "password", url: "https://my.group-b-us-api-manager.com:8075"});
        });

        it('should return group based API-Manager is region is set to N/A', async () => {
            var configuredManagers = {
                "configs": {
                    "group-a": {
                        url: "https://my.group-a-api-manager.com:8075",
                        username: "user", password: "password"
                    },
                    "group-b###us": {
                        url: "https://my.group-b-us-api-manager.com:8075",
                        username: "user", password: "password"
                    }
                }
            }
            var managerConfig = await getManagerConfig(configuredManagers, "group-a", "N/A");
            expect(managerConfig).to.deep.equal({ username: "user", password: "password", url: "https://my.group-a-api-manager.com:8075"});
        });
    });
});