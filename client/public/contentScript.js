/*global chrome*/
const jq = require('jquery');

const port = chrome.runtime.connect({ name: "client_port" });
// jq("input:password").on('input', function(event) {
//     console.log(event.target.value);
// });

jq("input[type=email]").change(function(event) {
    console.log("email: " + event.target.value);
});

jq("input:text").change(function(event) {
    console.log("username: " + event.target.value);
});


jq("input:password").change(function(event) {
    console.log("password: " + event.target.value);
});

jq("form").submit(function(event) {
    alert("submit");
    event.preventDefault();
});



jq("input:password").css({
    background: "yellow",
    border: "3px red solid"
});
// jq("body").append(`
//     <style>
//     .testa {
//         color: white!important;
//         background: aqua;
//     }
//     </style>`);
