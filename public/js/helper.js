function custom_alert(type, message) {
    let newAlert = $("#message");
    newAlert.html(`
    <div class="fade-in text-center m-0 alert alert-${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="close" data-dismiss="alert" onclick="close()" aria-label="Close">
       <span aria-hidden="true">&times;</span>
    </button>
    <br>
    </div>`);
    setTimeout(() => {
        newAlert.html("");
    }, 3000);
}