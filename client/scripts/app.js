var app = {
  server: 'https://api.parse.com/1/classes/messages',
  timeStamp: (new Date()).toISOString(),
  init: function() {
    //do stuff on load and consistently throughout
    // i.e. auto-update
    $('.roomname').val('lobby');
    $('.submit').on('click', function() {
      // app.send(app.getInfo());
      $('.textbox').val('');
      var newRoom = $('.roomname').val();
      var rooms = $('#roomSelect').children();
      var found = false;
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].innerHTML === newRoom) {
          found = true;
        }
      }
      if (!found) {
        app.renderRoom(newRoom);
      }
      found = false;
    });
    $('.retrieve').on('click', function() {
      app.fetch();
    });
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
        $gt: this.timeStamp
      },
      roomname: this.getInfo().roomname
    };
    var query = '?where=' + JSON.stringify(obj);
    this.server = 'https://api.parse.com/1/classes/messages' + query;
    var response = $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {

        var result = response.responseJSON.results;
        if (result.length !== 0) {
          app.timeStamp = result[0].createdAt;
          for (var i = result.length - 1; i >= 0; i--) {
            app.renderMessage(result[i]);
          }

          console.log(result);
          console.log('chatterbox: Message grabbed');
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to grab message', data);
      }
    });
    
    // console.log(result);
  },

  getInfo: function() {
    var info = {};
    info.username = window.location.search.slice(10);
    info.text = $('.textbox').val();
    info.roomname = $('.roomname').val();
    return info;
  },

  createPost: function(object) {
    //scrub here! DJ
    var strip = function(html) {
      var tmp = document.createElement('DIV');
      console.log('after doc create');
      tmp.innerHTML = html;
      tmp = tmp.textContent || tmp.innerText || '';
      return tmp.replace(/'/g, '\'');
    };

    object.username = strip(object.username);
    object.text = strip(object.text);

    // var userScrubRe = /^(?=[a-zA-Z0-9]*$)(?!.*[<>'"/;`%~@#$^*()_+=[\]{}|\\,.?: -])/;
    // var textScrubRe = /^(?=[a-zA-Z0-9,.?:;]*$)(?!.*[<>'"/`%~@#$^*()_+=[\]{}|\\ -])/;
    // var userClean = object.username.match(userScrubRe);
    // var textClean = object.text.match(textScrubRe);
    // if (!!userClean && !!textClean) {
    let userDiv = '<div class="userdiv">' + object.username + ':</div>';
    let textDiv = '<div class="textdiv">' + object.text + '</div>';
    object.$node = '<div class="post ' + object.username + '">' + userDiv + textDiv + '</div>';
    // }
  },

  renderMessage: function(message) {
    app.createPost(message);
    $('#chats').prepend(message.$node);
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  renderRoom: function(room) {
    $('#roomSelect').append('<div>' + room + '</div>');
  },

  showRooms: function() {
    $('#roomSelect').toggle();
  }
};


$('document').ready(function() {
  app.init();
});

//on mouse move rekd them
