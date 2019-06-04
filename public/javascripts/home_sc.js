
$(function(){

    $("#logout_btn").click(function () {
        $.post("/logout",
            {
                user_id: "1231"
            },
            function (data, status) {
                alert("Data: " + data + "\nStatus: " + status);
            });
    });

});

