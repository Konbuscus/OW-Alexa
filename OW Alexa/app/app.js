'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
var request = require('request');
var EventEmitter = require("events").EventEmitter;
var playerProfile = new EventEmitter(); 

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
        
        let API = "https://ow-api.com/v1/stats/pc/eu/"+ user +"/profile";
        let alexa = this.alexaSkill();
        console.log(user);
        console.log(API);
        

        //Getting all infos
        request(API, function(error, response, body){
            playerProfile.data  = JSON.parse(body);
            playerProfile.emit("retrieve");
        });

        playerProfile.on('retrieve', function () {

            console.log(playerProfile.data);

            if(specificStats.value == "le ratio de victoire"){
                console.log("Ratio choisis");
                speech = GetVictoryRatio(playerProfile.data);
                alexa.tell(speech);
            }
            
            if (specificStats.value == "le niveau"){
                console.log("Niveau choisi");
                speech = GetLevel(playerProfile.data);
                alexa.tell(speech);
            }

        });
    }
});


//Getting victory ratio 
function GetVictoryRatio(playerInfos){

    console.log(playerInfos);
    var totalCompetitiveGames = playerInfos["competitiveStats"]["games"]["played"];
    var wonGames = playerInfos["competitiveStats"]["games"]["won"];
    var loosedGames = (totalCompetitiveGames - wonGames);
    var finalRatio = (wonGames / loosedGames);
    var playerName = playerInfos["name"];

    let speech = "Le joueur " + playerName + " totalise " + wonGames + " parties gagnées"
    + " et " + loosedGames + " parties perdues, soit un ratio de victoire égale à "
    + finalRatio;
    console.log(speech);
    return speech; 
}

//Retrieing player lvl and prestige
function GetLevel(playerInfos){

    var prestigePlayer = playerInfos["prestige"];
    var lvlPlayer = playerInfos["level"];
    var playerName = playerInfos["name"];

    let speech = "Le joueur " + playerName + " est actuellement prestige  " + prestigePlayer + " et est de niveau " + lvlPlayer;
    console.log(speech);
    return speech;
}

module.exports.app = app;
