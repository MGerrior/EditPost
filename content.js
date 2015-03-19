$.ajaxSetup({
  dataType: "json",
  headers: {
    "X-EditPost": true,
    "X-CSRF-Token": $('meta[name="csrf-token"]').attr('content')
  }
});

function EditableTextField() {
  return this;
}

EditableTextField.prototype.onDoubleClick = function() {
  this.originalElement.hide();
  this.editableElement.show();
  this.editableElement.focus();
  this.editableElement.select();
};

EditableTextField.prototype.onKeyDown = function(event) {
  if (event.which != 13) {
    return;
  }

  $.ajax({
    type: "PATCH",
    url: window.location.pathname,
    data: {
      software: {
        name: this.editableElement.val()
      }
    }
  })
  .done($.proxy(this.onSuccessfulUpdate, this))
  .fail($.proxy(this.onUpdateFailed, this));

  this.showOriginalElement();
}

EditableTextField.prototype.showOriginalElement = function() {
  this.editableElement.hide();
  this.originalElement.text(this.editableElement.val());
  this.originalElement.show();
}

EditableTextField.prototype.onSuccessfulUpdate = function() {
  console.log("Changes were successful");
}

EditableTextField.prototype.onUpdateFailed = function() {
  console.log("Changes were not successful");
  this.originalElement.effect("shake");
}

EditableTextField.prototype.initialize = function(idSelector) {
  this.originalElement = $(idSelector);
  this.originalElementText = this.originalElement.text().trim();
  this.editableElement = $("<input />", {
    id: idSelector + "-input",
    type: "text",
    value: this.originalElementText,
    css: {
      "display": "none",
      "background": "none",
      "color": "white",
      "border": "none",
      "margin": "0 0 0.2em 0",
      "line-height": "1.4",
      "padding": "0",
      "font-weight": "bold",
      "height": "auto",
      "font-size": "2.375em"
    }
  });

  this.editableElement.insertBefore(this.originalElement);

  this.originalElement.dblclick($.proxy(this.onDoubleClick, this));
  this.editableElement.keydown($.proxy(this.onKeyDown, this));
};

var getElementByXpath = function(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

var stylesToCssString = function(styles) {
  return $.map(styles, function(value, attribute) {
    return attribute + ": " + value;
  }).join("; ");
}

var editButton = getElementByXpath("//a[contains(text(), 'Edit project')]");

if (editButton != null) {
  var editableTitle = new EditableTextField();

  editableTitle.initialize("#app-title");
}

/*
if (editButton != null) {
  var projectTitle = document.getElementById("app-title");
  var titleInput = document.createElement("input");

  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("value", projectTitle.innerText);
  titleInput.style.cssText = stylesToCssString({
    "display": "none",
    "background": "none",
    "color": "white",
    "border": "none",
    "margin": "0 0 0.2em 0",
    "line-height": "1.4",
    "padding": "0",
    "font-weight": "bold",
    "height": "auto",
    "font-size": "2.375em"
  });

  titleInput.addEventListener("keydown", function(event) {
    if (event.which == 13 || event.keyCode == 13) {
      $.ajax({
        type: "PATCH",
        url: window.location.pathname,
        data: JSON.stringify({
          software: {
            name: this.value
          }
        })
      }).done(function() {
        console.log("Changes were successful");
      }).fail(function() {
        console.log("Changes were not successful");
        $(titleInput).effect("shake");
      }).always(function() {
        console.log("Finished request");
      });
    }
  });

  projectTitle.parentNode.insertBefore(titleInput, projectTitle);

  projectTitle.addEventListener("dblclick", function() {
    this.style.display = "none";
    titleInput.style.display = "block";

    titleInput.focus();
    titleInput.select();
  });
}
*/
