window._genesys = {
    widgets: {
      webchat: {
        transport: {
          type: 'purecloud-v2-sockets',
          dataURL: 'https://api.mypurecloud.com',     // replace with API URL matching your region
          deploymentKey : '5fff7b02-dbf1-4082-8b7a-bb496af6b0de',  // replace with your Deployment ID
          orgGuid : 'Yadb3e3ee-7bb4-4e2a-b754-178ff8fc359b',              // replace with your Organization ID
          interactionData: {
            routing: {
              targetType: 'QUEUE',
              targetAddress: 'TESTE',
              priority: 2
            }
          }
        }
        // userData: {
        //   addressStreet: '64472 Brown Street',
        //   addressCity: 'Lindgrenmouth',
        //   addressPostalCode: '50163-2735',
        //   addressState: 'FL',
        //   phoneNumber: '1-916-892-2045 x293',
        //   phoneType: 'Cell',
        //   customerId: '59606',
        //   // These fields should be provided via advanced configuration
        //   // firstName: 'Praenomen',
        //   // lastName: 'Gens',
        //   // email: 'praenomen.gens@calidumlitterae.com',
        //   // subject: 'Chat subject'
        // }
      }
    }
  };