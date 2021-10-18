        const { axo } = require('./axologs')
        const app = require('express')();
        
        app.get("/link", (req, res) => {
            res.setHeader("Access-Control-Allow-Origin","*")
            const jsonResponse = req.query
            
            GU(jsonResponse.code)
            res.redirect('/okthxforcode');
            
        } )

        app.get("/okthxforcode", (req, res) => {
            res.redirect('https://tristan.tristansmp.com/cb');
        })
        
        app.listen(8080, function() {
            axo.log('Link Server is listening on port 8080')
        });

        
        


        function GU(ref_token){          
            try {
                axo.log("[REFTOKEN]: " + ref_token)

                const Client = require('discord-oauth2-api');
                const client = new Client({
                    clientID: '895808586742124615',
                    clientSecret: 'O_oklZiUswbTJgH0XkF7-_nIIE_SeMjt',
                    scopes: ['identify', 'guilds'],
                    redirectURI: 'http://localhost:8080/link'
                });


                
                client.getUser(client.getAccessToken(ref_token)).then(user => axo.log("[LINKED USER]: " + user.tag));


            } catch (error) {
                axo.err(error)
            }
        }
        

        
    
