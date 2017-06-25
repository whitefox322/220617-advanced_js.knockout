var viewModel = {
    info: ko.observableArray([]),
    selectedUser: ko.observable(null),
    page: ko.observable(1),
    pagesNumber: ko.pureComputed(function () {
        var pages = [];

        for (var i = 1; i <= viewModel.totalPages(); i++) {
            pages.push(i);
        }

        return pages;
    }),
    totalPages: ko.observable(0),
    countries: ko.observableArray([]),
    forRemove: ko.pureComputed(function () {
        return viewModel.selectedUser() && viewModel.selectedUser().id();
    }),
    getInfo: function () {
        $.getJSON("/api/users/" + viewModel.page() + "/10/preview")
            .done(function (object) {
                viewModel.totalPages(object.totalPages);
                viewModel.info(object.data);
            });
    },
    getCountries: function () {
        $.getJSON("/api/countries/")
            .done(function (object) {
                viewModel.countries(object);
            });
    },
    selectUser: function (user) {
        $.getJSON("/api/users/" + user.id)
            .done(function (user) {
                viewModel.selectedUser(new User(user));
            });
    },
    goToPage: function (number) {
        viewModel.page(number);
        viewModel.getInfo();
    },
    goToPrevPage: function () {
        if (viewModel.page() <= 1) {
            return;
        }

        viewModel.goToPage(viewModel.page() - 1);
    },
    goToNextPage: function () {
        if (viewModel.page() >= viewModel.totalPages()) {
            return;
        }

        viewModel.goToPage(viewModel.page() + 1);
    },
    saveUser: function () {
        var type = viewModel.selectedUser().id() ? "put" : "post";

        $.ajax({
            url: "/api/users",
            type: type,
            data: ko.toJSON(viewModel.selectedUser()),
            contentType: "application/json"
        }).done(function (data) {
            viewModel.getInfo();
            viewModel.selectUser(data);
        });
    },
    removeUser: function () {
        $.ajax({
            url: "/api/users/" + viewModel.selectedUser().id(),
            type: "delete"
        }).done(function () {
            viewModel.getInfo();
            viewModel.selectedUser(null);
        });
    },
    addUser: function () {
        viewModel.selectedUser(new User({}));
    },
    cancel: function () {
        viewModel.selectedUser(null);
    },
    openFileDialog: function () {
        document.getElementById("openFileDialogElement").click();
    },
    uploadImage: function (context, e) {
        var files = e.target.files;

        if (!files.length) {
            return;
        }

        var ourImage = files[0];

        var fileReader = new FileReader();
        fileReader.readAsDataURL(ourImage);
        fileReader.onloadend = function () {
            var dataURI = fileReader.result;
            viewModel.selectedUser().photo(dataURI);
        };
    }
};

ko.applyBindings(viewModel);

viewModel.getInfo();
viewModel.getCountries();

function User(json) {
    this.id = ko.observable(json.id);
    this.fullName = ko.observable(json.fullName);
    this.birthday = ko.observable(json.birthday);
    this.profession = ko.observable(json.profession);
    this.email = ko.observable(json.email);
    this.address = ko.observable(json.address);
    this.country = ko.observable(json.country);
    this.shortInfo = ko.observable(json.shortInfo);
    this.fullInfo = ko.observable(json.fullInfo);
    this.photo = ko.observable(json.photo);
}

ko.bindingHandlers.dateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().dateTimePickerOptions || {};
        $(element).datetimepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "dp.change", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (event.date != null && !(event.date instanceof Date)) {
                    value(event.date.toDate());
                } else {
                    value(event.date);
                }
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = $(element).data("DateTimePicker");
            if (picker) {
                picker.destroy();
            }
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var picker = $(element).data("DateTimePicker");
        //when the view model is updated, update the widget
        if (picker) {
            var koDate = ko.utils.unwrapObservable(valueAccessor());

            //in case return from server datetime i am get in this form for example /Date(93989393)/ then fomat this
            koDate = (typeof (koDate) !== 'object') ? new Date(parseFloat(koDate.replace(/[^0-9]/g, ''))) : koDate;

            picker.date(koDate);
        }
    }
};
