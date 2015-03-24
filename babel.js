$.ajaxSetup({
  dataType: "json",
  headers: {
    "X-EditPost": true,
    "X-CSRF-Token": $('meta[name="csrf-token"]').attr('content')
  }
});

class EditableSoftwarePage {
  constructor() {
    $.ajax(
      {
        url: window.location.href + "/edit",
        dataType: "html"
      }
    )
    .done((data) => {
      this.onEditLoaded(data);
    })
    .fail((error) => {
      this.onEditLoadFailed(error);
    });
  }
  onEditLoaded(data) {
    this.initializeSoftware(data);
    this.initializeEditableFields();
  }
  onEditLoadFailed(error) {
    console.log("Failed to load data from edit page.");
    console.log(error);
  }
  initializeSoftware(data) {
    var editPage = $(data);

    this.software = {
      name: editPage.find("#software_name").val(),
      tagline: editPage.find("#software_tagline").val(),
      description: editPage.find("#software_description").val()
    }
  }
  initializeEditableFields() {
    this.editableSoftware = {
      name: new EditableTitle($("#app-title"), this.getSoftwareName()),
      tagline: new EditableTagline($("#app-tagline"), this.getSoftwareTagline())
    }

    var gallery = $("#app-details-left #gallery");
    var descriptionElement;

    if (gallery.length > 0) {
      descriptionElement = gallery.next();
    } else {
      descriptionElement = $("#app-details-left").children().first();
    }

    this.editableSoftware.description = new EditableDescription(
      descriptionElement,
      this.getSoftwareDescription()
    );
  }
  getSoftwareName() {
    return this.software.name;
  }
  getSoftwareTagline() {
    return this.software.tagline;
  }
  getSoftwareDescription() {
    return this.software.description;
  }
}

class EditableTextField {
  constructor(displayElement, currentValue) {
    this.displayElement = displayElement;
    this.currentValue = currentValue;

    this.initialize();
  }
  initialize() {
    this.editableElement = this.getInputElement();
    this.editableElement.insertBefore(this.displayElement);

    this.displayElement.dblclick((event) => {
      this.onDoubleClick(event);
    });
    this.editableElement.keydown((event) => {
      this.onKeyDown(event);
    });
  }
  getInputElement() {
    return $("<input />");
  }
  onDoubleClick(event) {
    this.displayElement.hide();
    this.editableElement.show().focus().select();
  }
  onKeyDown(event) {
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
    })
    .done($.proxy(this.onSuccessfulUpdate, this))
    .fail($.proxy(this.onUpdateFailed, this));

    this.showDisplayElement();
  }
  getDataToSave() {
    return {}
  }
  showDisplayElement() {
    this.editableElement.hide();
    this.displayElement.text(this.editableElement.val());
    this.displayElement.show();
  }
  onSuccessfulUpdate() {
    console.log("Changes were successful");
    this.currentValue = this.editableElement.val();
  }
  onUpdateFailed() {
    console.log("Changes were not successful");
    this.displayElement.effect("shake", () => {
      this.revertChanges();
    });
  }
  revertChanges() {
    this.displayElement.text(this.currentValue);
  }
}

class EditableTitle extends EditableTextField {
  constructor(displayElement, currentValue) {
    super(displayElement, currentValue);
  }
  getInputElement() {
    return $("<input />", {
      type: "text",
      value: this.currentValue,
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
  }
  getDataToSave() {
    return { name: this.editableElement.val() };
  }
}

class EditableTagline extends EditableTextField {
  constructor(displayElement, currentValue) {
    super(displayElement, currentValue);
  }
  getInputElement() {
    return $("<input />", {
      type: "text",
      value: this.currentValue,
      css: {
        "display": "none",
        "background": "none",
        "color": "#bfbeba",
        "border": "none",
        "margin": "0.2em 0 0.5em 0",
        "line-height": "1.4",
        "padding": "0",
        "font-weight": "normal",
        "font-style": "italic",
        "height": "auto",
        "font-size": "1.625em"
      }
    });
  }
  getDataToSave() {
    return { tagline: this.editableElement.val() };
  }
}

class EditableDescription extends EditableTextField {
  constructor(displayElement, currentValue) {
    super(displayElement, currentValue);
  }
  getInputElement() {
    return $("<textarea />", {
      text: this.currentValue,
      css: {
        "display": "none",
        "background": "none",
        "color": "#615f5a",
        "font-weight": "normal",
        "width": "100%",
        "margin": "0 0 1.25em 0",
        "line-height": "1.4"
      }
    });
  }
  onDoubleClick(event) {
    this.displayElement.hide();
    this.editableElement.show();
    this.editableElement.focus();
  }
  showDisplayElement() {
    this.editableElement.hide();

    this.displayElement.html(marked(this.editableElement.val()));
    this.displayElement.show();
    Prism.highlightAll();
  }
  getDataToSave() {
    return { description: this.editableElement.val() };
  }
  revertChanges() {
    this.displayElement.html(marked(this.currentValue));
  }
}

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
  var app = new EditableSoftwarePage();
}
