$(document).ready(function(){
  // create a pubnub instance, passing in publish and subcription keys
  var pubnub = PUBNUB.init({
    publish_key: 'demo',
    subscribe_key: 'demo'
  });

  var $users = $('#users'); // user element (div)
  var $messageList = $('#messageList'); // message table element (ul)
  var $messageContent = $('<li id="messageContent"></li>'); //message content to be appended to the message table
  
  var $sendMessageButton = $('#sendMessageButton'); // message submit button
  var $channelList = $('#channelList'); // channel list table (ul)
  var subscriptions = ['initChan1', 'our_channel']; // storage for list of channels 
  var $roomName = $('#roomName');  // room/channel name element (span)
  var channelEl= ""; //channel to be appended to the channel table (defined renderChannelList function)
  var currChan = "initChan1"; // channel currently being viewed
  


  // when the channel is clicked, give it a "selected" class (remove selected class from all elements currently selected)
  //click handler for selected channels


    // get channel history and return as an array
  function getChanHist(chan){
    console.log(chan)
    pubnub.history({
      channel: chan,
      callback: function(m){
        console.log(m[0])
        renderMsgHist(m[0]);
      }
    });
  }

  function viewSelectedChan(selectedChan){
    // remove selected class from priveously selected channels
    $('.channel').removeClass('selected')
    // add selected class
    selectedChan.addClass('selected');

    // set current channel
    currChan = selectedChan.data('channel');
    // get message history for selected channel (returns an array of objects)
    getChanHist(currChan);
    // display channel history on message table (each object in the hist array contain relavent data)
    // renderMsgHist();
  }

  // *********** Redering funcitons ************* //

  //write a set channel function that sets "myChannel" to the channel clicked in the "channelList"
  function handleMessage(message){
  	var $messageEl = $("<li class='message'>"
  		+ "<span class='username'>" + message.username + ": </span>"
  			+ message.text + "</li>");
  	// console.log("message", $messageEl)
  	$messageList.append($messageEl);
  }

  // render message history
  function renderMsgHist(objArray){
    /* expecting objects in objArray to contain all relavent message data
      example:
    {
       text: 'Messages to be displayed',
       username: 'Mr. Foo Bar',
       createdAt: "timeStamp",
       ...
    }
    */
    
    //iterate through array
    for(var i = 0; i<objArray.length; i++){
      //create a message element and append to the message table
      handleMessage(objArray[i]);
    }
  }

  // render channel list
  function renderChanList(){
    for(var i = 0; i<subscriptions.length; i++){
      // how will the channel names be displayed? Carrier-Name/Shipper-Name
      var chanName = subscriptions[i]; 
      channelEl = $('<li><a href="" class="channel" data-channel='+chanName+'>'+ chanName +'</a></li>');
      $channelList.append(channelEl);
    }
  }

  
  // render the message history for that channel

  $sendMessageButton.on('click', function(event){
    var $message = $messageContent.val();
    if ($message != '') {
    pubnub.publish({
      channel: currChan,
      message: {
        username: 'Admin',
        text: $message
      }
    });
    $messageContent.val("");
  }
  });

  $messageContent.bind('keydown', function (event) {
    if((event.keyCode || event.charCode) !== 13) return true;
      $sendMessageButton.click();
      return false;
  });

  // pubnub.subscribe({
  //   channel: currChan,
  //   message: handleMessage
  // });

  // **************** Tester Helpers **************************//
  // publish 20 messages
  function pub(channel) {
    i = 0 ;
    while (i<=20)  {
       // publish 500 messages...
       pubnub.publish({
         channel: channel,
         message: {text: "message: " + i,
                   username: "User" + i   
                  }
       });
       i++;
    };
  };

  // **************** Tester Helpers **************************//
  // *********** Event handler funcitons ************* //


  // event listener for the channel table items
  $('#channelList').on('click', '.channel', function(e){
    e.preventDefault();
    console.log(this)
    $('#messageList').html("");
    viewSelectedChan($(this));
  })
  function init(){
    // only for testing
    // pub(currChan);
    
    renderChanList();
    getChanHist(subscriptions[0]);
  }

  init();

});