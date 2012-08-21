(function ($, Backbone, u) {
  'use strict';

  window.app = {};
  var app = window.app;

  // Backbone Classes
  app.InputView = Backbone.View.extend({
    el: '#input',
    initialize: function () {
      this.history = [];
    },
    send: function (e) {
      e.preventDefault();
      var input = this.$('#sms-input');
      var msg = input.val();
      if (msg !== '') {
        app.messages.add({
          type: 'outbound',
          message: msg
        });
        this.history.push(msg);

        $.ajax({
          url: '/sms',
          type: 'POST',
          data: {
            Body: msg,
            From: '4155551234'
          }
        }).then(function (data) {
          input.val('');

          var $xml = $(data);
          $xml.find('Sms').each(function (index, item) {
            var text = $(item).text().split('\n');
            app.messages.add({
              type: 'inbound',
              message: text
            });
          });
        }).fail(function (err) {
        });
      }
    },
    usePrev: function (e) {
      if (e.keyCode === 38) {
        if (this.history.length > 0) {
          var input = this.$('#sms-input');
          input.val(this.history[this.history.length - 1]);
        }
      }
    },

    events: {
      'submit': 'send',
      'keyup': 'usePrev'
    }
  });

  app.MessageView = Backbone.View.extend({
    render: function () {
      var templateID;
      if (this.model.get('type') === 'inbound') {
        templateID = '#t-inbound';
      } else {
        templateID = '#t-outbound';
      }
      var context = {
        message: this.model.attributes.message
      };
      this.$el.html(u.template($(templateID).html(), context));
      return this;
    }
  });

  app.Message = Backbone.Model.extend({
  });

  app.MessageCollection = Backbone.Collection.extend({
    model: app.Message
  });

  app.inputView = new app.InputView({
    el: '#input'
  });

  app.messages = new app.MessageCollection();
  app.messages.on('add', function (msg) {
    var view = new app.MessageView({
      model: msg
    });
    view.render();
    view.$el.appendTo($('#display'));
    $('#display').scrollTop(0);
    $('#display').scrollTop(view.$el.position().top + view.$el.height());
  });

}(window.$, window.Backbone, window._));
