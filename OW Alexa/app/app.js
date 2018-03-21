'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
var request = require('request');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
       let speech = "Bienvenue dans l'outil statistique Overwatch en cours de développement par Axel Masson."
       
       this.ask(speech);
},

    'SpecificPlayerIntent': function(specificStats, specificPlayer, number) {

        console.log(specificStats.value);
        console.log(specificPlayer.value);
        console.log(number.value);

        let speech = "";
        let reprompt = "";
        let user = specificPlayer.value + "-" + number.value;
        let newNumber = 2975;
        let aaver = "ELOAssassin-" + newNumber;
        let API = "https://ow-api.com/v1/stats/pc/eu/"+aaver +"/profile";
        let alexa = this.alexaSkill();
        console.log(user);
        console.log(API);

        request(API, function(error, response, body){
            
            var playerProfile = JSON.parse(body);
            console.log(playerProfile);
            var totalCompetitiveGames = playerProfile["competitiveStats"]["games"]["played"];
            console.log(totalCompetitiveGames);
            var wonGames = playerProfile["competitiveStats"]["games"]["won"];
            console.log(wonGames);
            var loosedGames = (totalCompetitiveGames - wonGames);
            var ratio = (wonGames / loosedGames);

            speech = "Le joueur" + aaver + "totalise " +wonGames + "de partie gagnées"
            + "et " + loosedGames +  "de parties perdues, soit un ratio de victoire égale à"
            + ratio;

            alexa.tell(speech);
        });
        

    }
});

module.exports.app = app;
