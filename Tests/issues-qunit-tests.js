﻿/// <reference path="FromTo-Mapping-qunit-tests.js" />
var model, viewmodel, updatedModel, modelResult;
module("Issue Tests", {
    setup: function () {
        //ko.viewmodel.logging = true;

    },
    teardown: function () {
        //ko.viewmodel.logging = false;
        model = undefined;
        updatedModel = undefined;
        modelResult = undefined;
        viewmodel = undefined
    }
});


test("Issue 19 - empty array throws an exception on update", function () {

    model = { items: [] };

    updatedModel = {
        items: [{
            id: 5,
            text: "test"
        }]
    };

    viewmodel = ko.viewmodel.fromModel(model);

    ko.viewmodel.updateFromModel(viewmodel, updatedModel);

    deepEqual(viewmodel.items().length, 1);

});

test("Issue 18 - toModel call fails to completely strip extended functions and internal properties", function () {

    model = {
        items: [{
            id: 5,
            text: "test"
        }],
        obj: {
            text: "test"
        }
    };

    viewmodel = ko.viewmodel.fromModel(model, {
        id: ["{root}.items[i].id"],
        extend: {
            "{root}.obj": function (obj) {
                obj.getTextLength = function () {
                    return obj.text().length;
                }
            }
        }
    });

    modelResult = ko.viewmodel.toModel(viewmodel);

    deepEqual(modelResult.items[0].hasOwnProperty("..idName"), false);
    deepEqual(typeof modelResult.obj.getTextLength, "undefined");
    deepEqual(modelResult.obj.hasOwnProperty("getTextLength"), false);

});


test("Issue 17 - toModel call fails to correctly unwrap fromModel with nested observableArray of strings", function () {

    model = { items: [["a", "b", "c", "d"]] };

    viewmodel = ko.viewmodel.fromModel(model);

    modelResult = ko.viewmodel.toModel(viewmodel);

    deepEqual(model, modelResult);

});
