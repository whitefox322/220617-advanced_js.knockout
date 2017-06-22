getCountries();
getInfo(1);

var newUser = {
    id: "",
    fullName: "",
    birthday: "",
    profession: "",
    email: "",
    address: "",
    country: "",
    shortInfo: "",
    fullInfo: "",
    photo: "/images/300x300.jpg"
};

var pagination = [];
var cashe = null;

var viewModel = {
    fullObject: ko.observable(null),
    usersInfo: ko.observableArray(),
    countries: ko.observableArray(),
    pages: ko.observableArray(pagination),
    selectedPag: ko.observable(null),
    selectedUser: ko.observable(null),
    selectUser: function (user) {
        viewModel.tryRestore();
        cashe = JSON.parse(JSON.stringify(user));
        viewModel.selectedUser(user);
    },
    tryRestore: function () {
        if (cashe && viewModel.selectedUser()) {
            viewModel.updateUser(viewModel.selectedUser(), cashe);
        }
    },
    selectPag: function (pag) {
        viewModel.selectedPag(pag);
        console.log(pag);
    },
    addUser: function () {
        viewModel.selectedUser(newUser);
    },
    cancelAll: function () {
        viewModel.tryRestore();
        viewModel.selectedUser(null);
    },
    removeUser: function () {
        deleteUser(viewModel.selectedUser().id);
        viewModel.usersInfo.remove(viewModel.selectedUser());
        viewModel.selectedUser(null);
    },
    saveUser: function () {
        if (!viewModel.selectedUser().id) {
            viewModel.selectedUser().photo = "";
            createUser();
        } else {
            editUser();
        }

        var old = viewModel.selectedUser();
        cashe = null;
        viewModel.updateUser(old, old);
    },
    updateUser: function (oldUser, newU) {
        var index = viewModel.usersInfo.indexOf(oldUser);
        var update = {
            id: newU.id,
            fullName: newU.fullName,
            birthday: newU.birthday,
            profession: newU.profession,
            email: newU.email,
            address: newU.address,
            country: newU.country,
            shortInfo: newU.shortInfo,
            fullInfo: newU.fullInfo,
            photo: newU.photo
        };

        viewModel.usersInfo.splice(index, 1, update);
        viewModel.selectedUser(update);
    }
};

ko.applyBindings(viewModel);

function getCountries() {
    $.getJSON("/api/countries", function (data) {
        viewModel.countries(data);
    });
}

function getInfo(page) {
    $.getJSON("/api/users/" + page + "/10/", function (object) {
        viewModel.usersInfo(object.data);
        viewModel.fullObject(object);

        for (var i = 1; i <= viewModel.fullObject().totalPages; i++) {
            var element = {
                index: i
            };
            pagination.push(element);
        }
    });
}

function createUser() {
    var $options = {
        url: "/api/users",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(viewModel.selectedUser())
    };

    $.ajax($options).done(function () {
        getInfo(0);
        getInfo(1);
    });
}

function deleteUser(id) {
    $.ajax({
        url: "/api/users/" + id,
        type: "delete"
    });
}

function editUser() {
    var $options = {
        url: "/api/users",
        type: "put",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(viewModel.selectedUser())
    };

    $.ajax($options).done(function () {
        getInfo(0);
        getInfo(1);
    });
}

function clearForm() {
    var old = {
        id: "",
        fullName: "",
        birthday: "",
        profession: "",
        email: "",
        address: "",
        country: "",
        shortInfo: "",
        fullInfo: "",
        photo: "/images/300x300.jpg"
    };
    viewModel.selectedUser(old);
    viewModel.selectedUser(null);
}

