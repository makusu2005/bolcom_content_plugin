    $(document).ready(function() {
     $("#loginForm").submit(function(e) {
      e.preventDefault();
      if ($("#userEmail").val() != '' && $("#userPassword").val() != '') {

        var form = new FormData();
        form.append("username", $("#userEmail").val());
        form.append("password", $("#userPassword").val());
        var settings = {
          "url": "https://attalosagency.com/wp-json/jwt-auth/v1/token",
          "method": "POST",
          "timeout": 0,
          "processData": false,
          "mimeType": "multipart/form-data",
          "contentType": false,
          "data": form
        };

        $.ajax(settings).done(function (response) {
          response = JSON.parse(response);
          alert ("Welkom " + response['user_display_name'])
          console.log(response);
        });
        $.ajax(settings).fail(function (response) {
          alert ("incorrect")
          //alert (response['user_display_name'])
          //console.log(response);
        });

      } else {
        alert('username or password can\'t be blank');  
      }
    });
   });
