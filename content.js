"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

$.ajaxSetup({
  dataType: "json",
  headers: {
    "X-EditPost": true,
    "X-CSRF-Token": $("meta[name=\"csrf-token\"]").attr("content")
  }
});

var EditableTextField = (function () {
  function EditableTextField(originalElement) {
    var _this = this;

    _classCallCheck(this, EditableTextField);

    this.originalElement = originalElement;
    this.originalElementText = this.originalElement.text().trim();
    this.editableElement = this.getInputElement();

    this.editableElement.insertBefore(this.originalElement);

    this.originalElement.dblclick(function (event) {
      _this.onDoubleClick(event);
    });
    this.editableElement.keydown(function (event) {
      _this.onKeyDown(event);
    });
  }

  _createClass(EditableTextField, {
    getInputElement: {
      value: function getInputElement() {
        return $("<input />");
      }
    },
    onDoubleClick: {
      value: function onDoubleClick(event) {
        this.originalElement.hide();
        this.editableElement.show();
        this.editableElement.focus();
        this.editableElement.select();
      }
    },
    onKeyDown: {
      value: function onKeyDown(event) {
        if (event.which != 13) {
          return;
        }

        if (event.which == 13 && event.shiftKey) {
          return;
        }

        $.ajax({
          type: "PATCH",
          url: window.location.pathname,
          data: {
            software: this.getDataToSave()
          }
        }).done($.proxy(this.onSuccessfulUpdate, this)).fail($.proxy(this.onUpdateFailed, this));

        this.showOriginalElement();
      }
    },
    getDataToSave: {
      value: function getDataToSave() {
        return {};
      }
    },
    showOriginalElement: {
      value: function showOriginalElement() {
        this.editableElement.hide();
        this.originalElement.text(this.editableElement.val());
        this.originalElement.show();
      }
    },
    onSuccessfulUpdate: {
      value: function onSuccessfulUpdate() {
        console.log("Changes were successful");
      }
    },
    onUpdateFailed: {
      value: function onUpdateFailed() {
        var _this = this;

        console.log("Changes were not successful");
        this.originalElement.effect("shake", function () {
          _this.originalElement.text(_this.originalElementText);
        });
      }
    }
  });

  return EditableTextField;
})();

var EditableTitle = (function (_EditableTextField) {
  function EditableTitle(originalElement) {
    _classCallCheck(this, EditableTitle);

    _get(Object.getPrototypeOf(EditableTitle.prototype), "constructor", this).call(this, originalElement);
  }

  _inherits(EditableTitle, _EditableTextField);

  _createClass(EditableTitle, {
    getInputElement: {
      value: function getInputElement() {
        return $("<input />", {
          type: "text",
          value: this.originalElementText,
          css: {
            display: "none",
            background: "none",
            color: "white",
            border: "none",
            margin: "0 0 0.2em 0",
            "line-height": "1.4",
            padding: "0",
            "font-weight": "bold",
            height: "auto",
            "font-size": "2.375em"
          }
        });
      }
    },
    getDataToSave: {
      value: function getDataToSave() {
        return { name: this.editableElement.val() };
      }
    }
  });

  return EditableTitle;
})(EditableTextField);

var EditableTagline = (function (_EditableTextField2) {
  function EditableTagline(originalElement) {
    _classCallCheck(this, EditableTagline);

    _get(Object.getPrototypeOf(EditableTagline.prototype), "constructor", this).call(this, originalElement);
  }

  _inherits(EditableTagline, _EditableTextField2);

  _createClass(EditableTagline, {
    getInputElement: {
      value: function getInputElement() {
        return $("<input />", {
          type: "text",
          value: this.originalElementText,
          css: {
            display: "none",
            background: "none",
            color: "#bfbeba",
            border: "none",
            margin: "0.2em 0 0.5em 0",
            "line-height": "1.4",
            padding: "0",
            "font-weight": "normal",
            "font-style": "italic",
            height: "auto",
            "font-size": "1.625em"
          }
        });
      }
    },
    getDataToSave: {
      value: function getDataToSave() {
        return { tagline: this.editableElement.val() };
      }
    }
  });

  return EditableTagline;
})(EditableTextField);

var EditableDescription = (function (_EditableTextField3) {
  function EditableDescription(originalElement) {
    _classCallCheck(this, EditableDescription);

    _get(Object.getPrototypeOf(EditableDescription.prototype), "constructor", this).call(this, originalElement);
  }

  _inherits(EditableDescription, _EditableTextField3);

  _createClass(EditableDescription, {
    getInputElement: {
      value: function getInputElement() {
        return $("<textarea />", {
          text: toMarkdown(this.originalElement.html().trim()),
          css: {
            display: "none",
            background: "none",
            color: "#615f5a",
            "font-weight": "normal",
            width: "100%",
            margin: "0 0 1.25em 0",
            "line-height": "1.4"
          }
        });
      }
    },
    onDoubleClick: {
      value: function onDoubleClick(event) {
        this.originalElement.hide();
        this.editableElement.show();
        this.editableElement.focus();
      }
    },
    showOriginalElement: {
      value: function showOriginalElement() {
        this.editableElement.hide();

        this.originalElement.html(markdown.toHTML(this.editableElement.val()));
        this.originalElement.show();
      }
    },
    getDataToSave: {
      value: function getDataToSave() {
        return { description: this.editableElement.val() };
      }
    }
  });

  return EditableDescription;
})(EditableTextField);

var getElementByXpath = function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};

var stylesToCssString = function stylesToCssString(styles) {
  return $.map(styles, function (value, attribute) {
    return attribute + ": " + value;
  }).join("; ");
};

var editButton = getElementByXpath("//a[contains(text(), 'Edit project')]");

if (editButton != null) {
  var editableTitle = new EditableTitle($("#app-title"));
  var editableTagline = new EditableTagline($("#app-tagline"));
  var editableDescription;

  var gallery = $("#app-details-left #gallery");

  if (gallery.length > 0) {
    editableDescription = new EditableDescription(gallery.next());
  } else {
    editableDescription = new EditableDescription($("#app-details-left").children().first());
  }
}
