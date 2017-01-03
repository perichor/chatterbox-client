var app = {
  server: 'https://api.parse.com/1/classes/messages',
  init: function() {
    //do stuff on load and consistently throughout
    // i.e. auto-update
  },

  send: function(message) {
    
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    var obj = {
      createdAt: {
        $gte: '2017-01-01T00:00:00.000Z'
      },
      roomname: this.getInfo().roomname
    };
    var query = '?where=' + JSON.stringify(obj);
    this.server = 'https://api.parse.com/1/classes/messages' + query;
    var result = $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
    console.log(result);
  },

  getInfo: function() {
    var info = {};
    info.username = window.location.search.slice(10);
    info.text = $('.textbox').val();
    info.roomname = $('.roomname').val();
    return info;
  }
};
$('document').ready(function() {
  app.init();
  $('.submit').on('click', function() {
    app.send(app.getInfo());
    $('.textbox').val('');
  });
  $('.retrieve').on('click', function() {
    app.fetch();
  });
});

  
