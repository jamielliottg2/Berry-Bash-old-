'use strict';

const Alexa = require('alexa-sdk');

//////////Helper shorthands for multi modal compatability//////////////////////////////////////////////////////////////////////////
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage = Alexa.utils.ImageUtils.makeImage;
const makeRichText = Alexa.utils.TextUtils.makeRichText;

/////////Code data (fruit info, random text, etc)//////////////////////////////////////////////////////////////////////////
var skillName = 'Berry Bash';
var skillGameName = 'Berry Buzz';
var skillDictionaryName = 'Berry Book';

var adjectives = ['craziest', 'hippest', 'tastiest', 'sweetest', 'greatest', 'cheekiest', 'spiciest', 'greatest', 'smartest', 'best'];

var positiveSpeechconArray = ['bang', 'boing', 'kaboom', 'mazel tov', 'oh snap', 'well done'];
var negativeSpeechconArray = ['wah wah', 'uh oh', 'tosh', 'quack', 'oof', 'oh dear'];

var correctResponses = ['That is correct.', 'You got it!', 'Nice one.', 'There you go.', 'Awesome', 'Congratulations.'];
var wrongResponses = ['Oh no.', 'That is wrong.', 'Incorrect.', 'Unlucky.', 'Maybe next time.', 'Nearly.'];

var fruitsMainImage = 'http://i.telegraph.co.uk/multimedia/archive/03418/Berries-Jacqueline_3418530b.jpg';
var secondPlaceImage = 'http://www.sticker.com/picture_library/product_images/award-ribbons/72435_2nd-second-place-award-ribbon-stickers-and-labels.png';
var firstPlaceImage = 'http://www.sticker.com/picture_library/product_images/award-ribbons/72430_1st-first-place-award-ribbon-stickers-and-labels.png';

var berryNames = ['raspberries',
    'blackberries',
    'strawberries',
    'blueberries',
    'elderberries',
    'gooseberries',
    'cranberries',
    'huckleberries',
    'bilberries',
    'gojiberries'];
    
var berryImgURLs = ['http://www.publicdomainpictures.net/pictures/10000/velka/1-1248158051Ix2h.jpg',
'https://www.organicfacts.net/wp-content/uploads/2013/06/blackberry.jpg',
'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/220px-PerfectStrawberry.jpg',
'https://wishfarms.com/wp-content/uploads/2015/09/berries_main_image2.jpg',
'https://www.organicfacts.net/wp-content/uploads/elderberry.jpg',
'https://ripeme.com/wp-content/uploads/Gooseberry.jpg',
'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/CrangameBerries0101210.jpg/220px-CrangameBerries0101210.jpg',
'https://hartmannsplantcompany.com/wholesale/wp-content/uploads/sites/3/2015/04/michigan-huckleberry.jpg',
'https://www.organicfacts.net/wp-content/uploads/2013/06/billberries.jpg',
'https://www.healthline.com/hlcmsresource/images/topic_centers/Food-Nutrition/1296x728_8-Healthy-Facts-About-Goji-Berries_IMAGE_1.jpg'];

var berryInfo = ['The Raspberry or Red Raspberry is the plant that produces a tart, sweet, red composite fruit in the late summer and early autumn. In proper botanical language, it is not a berry at all, but instead an aggregate fruit of numerous drupelets around the central core.',
'The blackberry is an edible fruit produced by many species in the Rubus genus in the Rosaceae family, hybrids among these species within the Rubus subgenus, and hybrids between the Rubus and Idaeobatus subgenera.',
'Strawberries are short-lived herbaceous perennials, producing for 2 to 3 years. Plant in an open, sunny position in raised beds; a good airflow will reduce fungal diseases. Strawberries prefer a well-drained soil, rich in humus. Dig in lots of organic matter, compost, animal manure or blood and bone, about a month before planting.',
'Blueberry is one of the highest antioxidant capacities among all fruits, vegetables, spices and seasonings. Antioxidants are necessary to optimizing fitness by helping to combat the free radicals that can damage cellular structures as well as DNA. Blueberries are small blue to black colored fruits with a green flesh. They should be rich and bright in color with a natural bloom.',
'Elderberry also known as Sambucus is from the family of Adoxaceae, which is a genus of flowering plant. Formerly placed in the honeysuckle family, the fruits when ripe are blackish purple in color and globose in shape. With seeds just about 3mm long, they are globular in shape and about 4 mm diameter, calyx persistent at the apex.',
'Indian gooseberry fruits are of small size and light green in color. They have 6 vertical grooves on them. The taste of the fruit can be described as strong, harsh, and rough. This fruit is round shaped with vertical stripes and has a hard seed inside.',
'Cranberries are low, creeping shrubs or vines up to 2 metres long and 5 to 20 centimetres in height; they have slender, wiry stems that are not thickly woody and have small evergreen leaves. The flowers are dark pink, with very distinct reflexed petals, leaving the style and stamens fully exposed and pointing forward. They are pollinated by bees. The fruit is a berry that is larger than the leaves of the plant; it is initially light green, turning red when ripe. It is edible, but with an acidic taste that usually overwhelms its sweetness.',
'Huckleberry otherwise called hurtleberry is the native fruit of North America. The fruit appear in various dark colors such as red, blue and black and each berry measures 5-10mm in diameter. The fruit is completely edible and possesses a unique sweet taste. These berries are used as a major flavoring agent in juice, tea, soup, pudding, pie, pancakes and jam. It is also used for treating pain and healing heart disease and infections.',
'Bilberry is a name given to species of low-growing shrubs of the genus Vaccinium that bear tasty fruits. This species also known as blaeberry, whortleberry, whinberry, myrtle blueberry, and other names regionally. Bilberries are rarely cultivated but fruits are sometimes collected from wild plants growing on public lands, especially in Scandinavia and Poland.',
'Goji, goji berry, or wolfberry is the fruit of either the Lycium barbarum or Lycium chinense, two closely related species of boxthorn in the nightshade family, Solanaceae. The family also includes the potato, tomato, eggplant, belladonna, chili pepper, and tobacco. The two species are native to Asia.'];
 /////Sourced from fruitsinfo.com
 
 const GAMELENGTH = 5;
 var testingOnSim = false; //flip to experience voice only skill on display device/simulator

/////////Intent handlers//////////////////////////////////////////////////////////////////////////
const handlers = {
    'LaunchRequest': function () {
        newSessionHandler.call(this);
        
        var speechOutput = 'Welcome to ' + skillName + ', the ' + adjectives[getRandomVal(0, adjectives.length - 1)] + ' stop for knowledge about berries around. ';
        showHome.call(this, speechOutput);
    },
    'InformationIntent': function () {
        newSessionHandler.call(this);
        
        resetAttributes.call(this);
        
        var speechOutput;
        
        if (this.attributes['skillState'] == 'gamePlaying')
        {
            speechOutput = 'You are currently in the middle of a game. Would you like to carry on playing?';
            speakOnly.call(this, speechOutput, speechOutput);
        }
        else
            showMainList.call(this);
    },
    'AMAZON.YesIntent': function () {
        newSessionHandler.call(this);
        
        if (this.attributes['skillState'] == 'quizMainMenu') //User has confirmed they want to play
        {
            var speechOutput;
            var questionNo = 0;
            
            speechOutput = '<say-as interpret-as="interjection">Good luck.</say-as> ';
            
            setUpQuizBerries.call(this);
            
            this.attributes['skillState'] = 'gamePlaying';
            
            generateNewQuestion.call(this, speechOutput, questionNo);
        }
        else if (this.attributes['skillState'] == 'gamePlaying')
        {
            speechOutput = 'You are currently in the middle of a game. Would you like to carry on playing?';
            speakOnly.call(this, speechOutput, speechOutput);
        }
        else if (this.attributes['skillState'] == 'quitting') //Confirmation for leaving skill
            endSkill.call(this);
        else
            handleUnknown.call(this);
    },
    'AMAZON.NoIntent': function () {
        if (this.attributes['skillState'] == 'gamePlaying') //User wants to stop playing game
            showHome.call(this, null);
        else if (this.attributes['skillState'] == 'quitting') //User decided to stay in skill after nearly quitting
            speakOnly.call(this, 'Good choice. Now, where were we?', 'What would you like to do?');
        else
            confirmExit.call(this);
    },
    'AMAZON.PreviousIntent': function () {
        var speechOutput;
        
        if (this.attributes['selectedFruitIndex']) //If we are showing a fruit, go back to the main list
            showMainList.call(this, null);
        else if (this.attributes['skillState'] == 'gamePlaying')
        {
            speechOutput = 'You are currently in the middle of a game. Would you like to carry on playing?';
            speakOnly.call(this, speechOutput, speechOutput);
        }
        else
            showHome.call(this, null);
    },
    'QuizIntent': function () {
        newSessionHandler.call(this);
        var speechOutput;
        var reprompt;
        
        resetAttributes.call(this);
        
        if (this.attributes['skillState'] != 'gamePlaying') //Initiation of game
        {
            if (supportsDisplay.call(this) && !testingOnSim)
            {
                speechOutput = '<say-as interpret-as="interjection">dun dun dun.</say-as> Check out the big brains over here. Are you ready to begin?';
                reprompt = "Are you ready to begin?";
                
                this.attributes['gameBerries'] = this.attributes['berries'];
                this.attributes['skillState'] = 'quizMainMenu';
            
                bodyTemplateMaker.call(this, 7, fruitsMainImage, 'Time to play ' + skillGameName + '!', null, null, speechOutput, reprompt); 
            }
            else
                speakOnly.call(this, 'Unfortunately, Berry Bash is not supported on this device, but you can still learn about the wonder of berries which in my opinion is far more fun. What would you like to do?');
        }
        else
            speakOnly.call(this, 'You are already in the middle of a game. Please answer the question: ' + this.attributes['storedQuestion']);
    },
    'AMAZON.RepeatIntent': function () {
        speakOnly.call(this, this.attributes['lastOutputResponse']);
    },
    'AMAZON.StopIntent': function () {
        if (this.attributes['skillState'] == 'quitting') //Confirmation for leaving skill
            endSkill.call(this);
        else
            confirmExit.call(this);
    },
    'AMAZON.CancelIntent': function () {
        confirmExit.call(this);
    },
    'AMAZON.HelpIntent': function () {//Provide instructions based on skill state
        newSessionHandler.call(this);
        
        if (this.attributes['skillState'] == 'gamePlaying')
            speakOnly.call(this, 'In ' + skillGameName + ', you simply need to select the option that most resembles the berry being asked for in the question; either say 1 - 4, or touch the screen!');
        else
            showHome.call(this, null);
    },
    'ElementSelected': function () {//To handle events when the screen is touched
        newSessionHandler.call(this);
        
        if (this.attributes['skillState'] == 'gamePlaying')
        {
            var optionsArray = this.attributes['onScreenOptions'];
            var correctQIndex = this.attributes['correctIndex'];
            var quizBerries = this.attributes['QuizBerries'];
            var currentQNo = this.attributes['questionNumber'];
            var speechOutput;
            
            if (this.event.request.token) //User touched the screen
            {
                if (currentQNo < quizBerries.length-1)
                    handleAnswer.call(this, optionsArray[correctQIndex].token, this.event.request.token, quizBerries, false);
                else
                    handleAnswer.call(this, optionsArray[correctQIndex].token, this.event.request.token, quizBerries, true);
            }
            else if (parseInt(this.event.request.intent.slots.numberValue.value)) //User said their choice
            {
                var userChoiceNumber = parseInt(this.event.request.intent.slots.numberValue.value);
                
                if (currentQNo < quizBerries.length-1) //If still less than the amount of questions left
                {
                    if (userChoiceNumber > 0 && userChoiceNumber < optionsArray.length+1) //If their answer is between the amount of options..
                        handleAnswer.call(this, correctQIndex+1, userChoiceNumber, quizBerries, false);
                    else
                    {
                        speechOutput = 'Please say a number between 1 and ' + optionsArray.length;
                        speakOnly.call(this, speechOutput);
                    }
                }
                else //Game has ended
                    handleAnswer.call(this, correctQIndex+1, userChoiceNumber, quizBerries, true);
            }
            else
                handleUnknown.call(this);
        }
        else //User is not playing game
        {
            var berryArray = this.attributes['berries'];
            
            if (this.event.request.token) //Screen touched
            {
                if (this.event.request.token == "berry_book_token") //Open berry book
                    showMainList.call(this);
                else if (this.event.request.token == 'berry_buzz_token') //Start the game
                    this.emit('QuizIntent');
                else if (this.event.request.token == "read_fruit_info") //read out information
                {
                    var selectedIndex = this.attributes['selectedFruitIndex'];
                    speakOnly.call(this, berryArray[selectedIndex].info);
                }
    
                if (this.event.request.token == 'berry_list_token') //'Go back' action link selectex
                {
                    resetAttributes.call(this);
                    showMainList.call(this);
                }
                else //Something else selected, most likely from our main list (only list available outside of game)
                {
                    var valueToken = this.event.request.token;
                    var result = matchChecker(berryArray, valueToken);
                    
                    showSpecificFruitInfo.call(this, result, berryArray);
                }
            }
            else if (this.event.request.intent.slots.fruitValue.value) //If the user chooses their berry via voice
            {
                resetAttributes.call(this);
                
                var userFruit = this.event.request.intent.slots.fruitValue.value;
                
                var iresult = matchChecker(berryArray, userFruit);
                
                if (iresult)
                    showSpecificFruitInfo.call(this, iresult, berryArray);
                else
                    handleUnknown.call(this);
            }
            else if (this.event.request.intent.slots.numberValue.value) //If the user chooses their berry via voice
            {
                resetAttributes.call(this);
                
                var userChoiceNumber1 = parseInt(this.event.request.intent.slots.numberValue.value);
                
                if (userChoiceNumber1 > 0 && userChoiceNumber1 < berryArray.length + 1) //If within the range of options offered
                    showSpecificFruitInfo.call(this, userChoiceNumber1-1, berryArray);
                else
                {
                    speechOutput = 'Please say a number between 1 and ' + berryArray.length;
                    speakOnly.call(this, speechOutput);
                }
            }
            else //If this intent is hit without the needed data 
                handleUnknown.call(this);
        }
    },
    'SessionEndedRequest': function () { //User has outright quit the skill
        endSkill.call(this);
    },
};

/////////Alexa Setup//////////////////////////////////////////////////////////////////////////
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/////////Template makers//////////////////////////////////////////////////////////////////////////
function bodyTemplateMaker(pBodyTemplateType, pImg, pTitle, pText1, pText2, pOutputSpeech, pReprompt, pHint)
{
    var bodyTemplate;
    
    if (pBodyTemplateType == 7)
        bodyTemplate = new Alexa.templateBuilders.BodyTemplate7Builder();
    
    if (pBodyTemplateType == 3)
        bodyTemplate = new Alexa.templateBuilders.BodyTemplate3Builder();
        
    if (pBodyTemplateType == 2)
        bodyTemplate = new Alexa.templateBuilders.BodyTemplate2Builder();
    
    let template = bodyTemplate.setTitle(pTitle)
                          .build();
    
    if (pBodyTemplateType != 7) //Text not supported in BodyTemplate7
        bodyTemplate.setTextContent(makeRichText(pText1) || null, makeRichText(pText2) || null) //Add text or null
    
    if (pImg)
        bodyTemplate.setImage(makeImage(pImg));

    this.response.speak(pOutputSpeech)
                 .renderTemplate(template)
                 .shouldEndSession(null); //Keeps session open without pinging user..
                 
    this.response.hint(pHint || null, "PlainText");
    
    this.attributes['lastOutputResponse'] = pOutputSpeech;
    
    if (pReprompt)
        this.response.listen(pReprompt);// .. but we will ping them if we add a reprompt
    
    this.emit(':responseReady');
}

function listTemplateMaker(pArray, pType, pTitle, pOutputSpeech, pQuiz)
{
    const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
    var listTemplateBuilder;
    
    if (pType == 1)
        listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
    else if (pType == 2)
        listTemplateBuilder = new Alexa.templateBuilders.ListTemplate2Builder();

    if (!pQuiz)
    {
        for (var i = 0; i < pArray.length; i++)
            listItemBuilder.addItem(makeImage(pArray[i].imageURL), pArray[i].token, makePlainText(capitalizeFirstLetter(pArray[i].name)));
    }
    else //Dont insert option name if playing the quiz ()
    {
        for (var i = 0; i < pArray.length; i++)
            listItemBuilder.addItem(makeImage(pArray[i].imageURL), pArray[i].token);
    }
    
    const listItems = listItemBuilder.build();
    const listTemplate = listTemplateBuilder.setTitle(pTitle)
    										.setListItems(listItems)
    										.build();
    										
    this.attributes['lastOutputResponse'] = pOutputSpeech;
    
    this.response.speak(pOutputSpeech)
    			.renderTemplate(listTemplate)
    			.shouldEndSession(null);
    this.emit(':responseReady');
}

/////////Helper functions//////////////////////////////////////////////////////////////////////////
function speakOnly(pSpeechOutput, pReprompt) 
{
    this.response.speak(pSpeechOutput);
    
    if (supportsDisplay.call(this) && !testingOnSim)
    {
        this.response.listen(pReprompt || null); //Add reprompt if one has been passed in
        
        if (!pReprompt)
            this.response.shouldEndSession(null); //No need for this if a reprompt has been used
    }
    else
        this.response.listen(pReprompt || 'What would you like to do?');
        
    this.attributes['lastOutputResponse'] = pSpeechOutput;
        
    this.emit(':responseReady');
}

function confirmExit()
{
    var speechOutput = 'Are you sure you would like to quit ' + skillName + '?';
    this.attributes['skillState'] = 'quitting';
    speakOnly.call(this, speechOutput, speechOutput);
}

function matchChecker(pArray, pCompare1)
{
    for (var i = 0 ; i < pArray.length; i++) //Find out which berry
    {
        if (pCompare1.toLowerCase() == pArray[i].name.toLowerCase() || pCompare1.toLowerCase() == pArray[i].token.toLowerCase())
            return i; //Returns index of match for later use
    }
}

function setUpQuizBerries() //Shuffles our berries, and takes some for the quiz
{
    var berryArray = this.attributes['gameBerries'];
    
    berryArray = shuffle(berryArray);
    
    var randomBerries = [];
    
    for (var i = 0; i < GAMELENGTH; i++)
        randomBerries[i] = berryArray[i];
    
    this.attributes['QuizBerries'] = shuffle(randomBerries);
}

function handleAnswer(pCorrectAnswer, pUserAnswer, pArray, pGameFinished)
{
    var speechOutput;
    
    if (pCorrectAnswer == pUserAnswer) //User answer is correct
    {
        speechOutput = generateRandResponse(positiveSpeechconArray, true) + ' ' + generateRandResponse(correctResponses, false) + ' ';
        
        if (this.attributes['correctAnswersNo'])
            this.attributes['correctAnswersNo']++;
        else
            this.attributes['correctAnswersNo'] = 1;
    }
    else //They are wrong
        speechOutput = generateRandResponse(negativeSpeechconArray, true) + ' ' + generateRandResponse(wrongResponses, false) + ' ';
    
    if (!pGameFinished) //Ask a new Q
    {
        this.attributes['questionNumber']++;
        generateNewQuestion.call(this, speechOutput, this.attributes['questionNumber']);
    }
    else //Game over
    {
        var answerSP = 'answers';
        var cardTitle = 'Game Over!';
        var gameoverImage;
        
        if (this.attributes['correctAnswersNo'] && this.attributes['correctAnswersNo'] == 1)
            answerSP = 'answer'; //handle plural/singular
            
        var correctAnswersVal = this.attributes['correctAnswersNo'] || 0;
        
        speechOutput += ' Out of ' + pArray.length + ', you got ' + correctAnswersVal + ' ' + answerSP + ' correct. ';
        var speechOutput2 = 'Ask to play again; otherwise, I can teach you about some of the berries you have just seen if you would prefer. Just let me know.';
        speechOutput += speechOutput2;
        
        this.attributes['skillState'] = null;
        
        if (this.attributes['correctAnswersNo'] && this.attributes['correctAnswersNo'] > 4) //Provide image based on score
            gameoverImage = firstPlaceImage;
        else
            gameoverImage = secondPlaceImage;
        
        resetAttributes.call(this);
            
        if (supportsDisplay.call(this) && !testingOnSim)
            bodyTemplateMaker.call(this, 2, gameoverImage, cardTitle, '<b><font size="7">' + correctAnswersVal + ' / ' + pArray.length + ' correct.</font></b>', '<br/>' + speechOutput2, speechOutput, null, "tell me about berries"); 
        else
            speakOnly.call(this, speechOutput);
    }
}

function resetAttributes()
{
    this.attributes['skillState'] = null;
    this.attributes['selectedFruitIndex'] = null;
    this.attributes['questionNumber'] = null;
    this.attributes['correctIndex'] = null;
    this.attributes['onScreenOptions'] = null;
    this.attributes['gameBerries'] = null;
    this.attributes['QuizBerries'] = null;
    this.attributes['correctAnswersNo'] = null;
    this.attributes['storedQuestion'] = null;
}

function showHome(pSpeechOutput) 
 {
     resetAttributes.call(this);
     
     var speechOutput = pSpeechOutput || '';
     var cardTitle = skillName;
     
     var actionText1 = '<action value="berry_book_token"><i>' + skillDictionaryName + '</i></action>'; //Selectable text
     var actionText2 = '<action value="berry_buzz_token"><i>' + skillGameName + '</i></action>';
     
     speechOutput += 'Simply ask me to provide information about berries from the Berry Book.'; 

     if (supportsDisplay.call(this) && !testingOnSim)
     {
        speechOutput += ' However, if you are feeling lucky, ask for a quick game of Berry Buzz.';
        var text = '<u><font size="7">' + skillName + '</font></u><br/><br/>Simply ask me to provide information about berries from the ' + actionText1 + '. However, if you are feeling lucky, ask for a quick game of ' + actionText2 + '.'; 
        bodyTemplateMaker.call(this, 3, fruitsMainImage, cardTitle, null, text, speechOutput, null); 
     }
    else
        speakOnly.call(this, speechOutput + ' What would you like to do?');
 }

function createBerry(pName, pImageURL, pInfo, pOrigin) //Berry object
{
    var berry = {
        name        : pName,
        imageURL     : pImageURL,
        info : pInfo,
        token : pName + 'Token',
        origin : pOrigin
    };
    
    return berry;
}

function supportsDisplay() {
    var hasDisplay =
    this.event.context &&
    this.event.context.System &&
    this.event.context.System.device &&
    this.event.context.System.device.supportedInterfaces &&
    this.event.context.System.device.supportedInterfaces.Display

    return hasDisplay;
}

function handleUnknown() //For when Alexa doesn't understand the user
{
    var speechOutput = 'I am sorry. I did not quite get that one. Could you try again?';
    var reprompt = 'Would you like to hear about another berry?';
    
    speakOnly.call(this, speechOutput, reprompt);
}

function generateNewQuestion(pSpeechOutput, pQuestionNo)
{
    var berryArray = this.attributes['gameBerries'];
    var quizBerries = this.attributes['QuizBerries'];
    var questionAskType = ['Which of these looks like ', 'Please select the image that represents ', 'Do you know which of these look like '];
            
    var question;
    question = 'Question ' + (pQuestionNo+1) + ': ' + questionAskType[getRandomVal(0, 3)] + quizBerries[pQuestionNo].name + '?';
    this.attributes['storedQuestion'] = question;
    
    pSpeechOutput += question;
    var index;
    
    for (var i = 0; i < berryArray.length; i++) //Find the new correcy berry index for the next question
    {
        if (berryArray[i].name == quizBerries[pQuestionNo].name)
        {
            index = i;
            break;
        }
    }
    
    berryArray.splice(index, 1); //Take it out of the main array
    berryArray = shuffle(berryArray);
    
    var optionsArray = [quizBerries[pQuestionNo]]; //Add correct answer to new array
    
    for (var i = 1; i < 4; i++)
        optionsArray[i] = berryArray[i]; //Add other random options to confuse user
    
    optionsArray = shuffle(optionsArray);
    
    for (var i = 0; i < optionsArray.length; i++)
    {
        if (optionsArray[i].name == quizBerries[pQuestionNo].name)
        {
            this.attributes['correctIndex'] = i; //Find the correct answer index and save for later
            break;
        }
    }
    
    this.attributes['onScreenOptions'] = optionsArray;
    this.attributes['questionNumber'] = pQuestionNo;

    listTemplateMaker.call(this, optionsArray, 2, question, pSpeechOutput, true);
}

function showMainList() //For main list of fruit in berry book
{
    var speechOutput;
    
    resetAttributes.call(this);

    if (supportsDisplay.call(this) && !testingOnSim)
    {
        speechOutput = 'Select or ask for a berry below for more information.';
        listTemplateMaker.call(this, this.attributes['berries'], 1, speechOutput, speechOutput);
    }
    else
    {
        var berryArray = this.attributes['berries'];
            
        speechOutput = "I have a range of berries I can tell you about including: ";
        
        for (var i = 0; i < berryArray.length; i++)
            speechOutput += berryArray[i].name + ', ';
            
        speechOutput += "which would you like to hear about?";
        
        speakOnly.call(this, speechOutput);
    }
}

function newSessionHandler() //Called every intent to handle modal/one shot utterances
{
    if (this.event.session.new)
    {
        var berriesArray = [];
        
        for (var i = 0 ; i < berryNames.length; i++) //We create a new set of berries here
            berriesArray[i] = createBerry(berryNames[i], berryImgURLs[i], berryInfo[i]);
        
        this.attributes['berries'] = shuffle(berriesArray); //And then randomise them each time the skill starts
    }
}

function showSpecificFruitInfo(pIndex, pArray) //User has selected a single fruit to get more info
{
    this.attributes['selectedFruitIndex'] = pIndex;
    
    if (supportsDisplay.call(this) && !testingOnSim)
        bodyTemplateMaker.call(this, 3, pArray[pIndex].imageURL, capitalizeFirstLetter(pArray[pIndex].name), '<action value="read_fruit_info"><b>Read</b></action> | <action value="berry_list_token"><b>Back</b></action><br/>', pArray[pIndex].info, 'Here is some information about ' + pArray[pIndex].name + '.', null, 'test me on berries');
    else
        speakOnly.call(this, pArray[pIndex].info + ' Which fruit would you like to hear about now?');
}

function endSkill()
{
    var speechOutput = "Thanks for checking out " + skillName + ". Learn more about berries another time. Goodbye!"
    this.response.speak(speechOutput);
    this.emit(':responseReady');
}

//////////Code support functions//////////////////////////////////////////////////////////////////////////
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomVal(pMin, pMax)
{
    return Math.floor((Math.random() * pMax) + pMin);
}

function generateRandResponse(pArray, pSpeechCon)
{
    var r = getRandomVal(0, pArray.length);

    if (pSpeechCon)
        return '<say-as interpret-as="interjection">' + pArray[r] + '</say-as>. ';
    else
        return pArray[r];
    
}
