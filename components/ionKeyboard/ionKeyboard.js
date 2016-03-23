Meteor.startup(function () {
  if (Meteor.isCordova) {
    IonKeyboard.disableScroll();
  }
});

IonKeyboard = {
  close: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  },

  show: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.show();
    }
  },

  hideKeyboardAccessoryBar: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
  },

  showKeyboardAccessoryBar: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
  },

  disableScroll: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.disableScroll(true);
    }
  },

  enableScroll: function () {
    if (Meteor.isCordova) {
      cordova.plugins.Keyboard.disableScroll(false);
    }
  }
};

window.addEventListener('native.keyboardshow', function (event) {
  // TODO: Android is having problems
  if (Platform.isAndroid()) {
    return;
  }

  // Verify if the keyboard is not already open.
  // When keyboard's arrows are used to move between fields in iOS 9 then
  // 'native.keyboardshow' is fired without a previous 'native.keyboardhide'
  // causing this issue: https://github.com/meteoric/meteor-ionic/issues/321.
  if ($('body').hasClass('keyboard-open')) {
    return;
  }

  $('body').addClass('keyboard-open');
  var keyboardHeight = event.keyboardHeight;

  // Attach any elements that want to be attached
  $('[data-keyboard-attach]').each(function (index, el) {
    $(el).data('ionkeyboard.bottom', $(el).css('bottom'));
    $(el).css({bottom: keyboardHeight});
  });

  // Move the bottom of the content area(s) above the top of the keyboard
  $('.content.overflow-scroll').each(function (index, el) {
    $(el).data('ionkeyboard.bottom', $(el).css('bottom'));
    $(el).css({bottom: keyboardHeight});
  });

  $('.content.overflow-scroll').on('focus', 'input,textarea', function(event) {
    var contentOffset = $(event.delegateTarget).offset().top;
    var padding = 10;
    var scrollTo = $(event.delegateTarget).scrollTop() + $(this).offset().top - (contentOffset + padding);
    $(event.delegateTarget).scrollTop(scrollTo);
  });
});

window.addEventListener('native.keyboardhide', function (event) {
  // TODO: Android is having problems
  if (Platform.isAndroid()) {
    return;
  }
  
  $('body').removeClass('keyboard-open');

  // Detach any elements that were attached
  $('[data-keyboard-attach]').each(function (index, el) {
    $(el).css({bottom: $(el).data('ionkeyboard.bottom')});
  });

  // Reset the content area(s)
  $('.content.overflow-scroll').each(function (index, el) {
    $(el).css({bottom: $(el).data('ionkeyboard.bottom')});
  });
});
