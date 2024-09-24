function handleAddButtonClick(){
    let user_input = $('.text_input').val()
    if (user_input === ""){
        alert("You cannot enter an empty name.")
        return
    }

    if ($("#select option[value=" + user_input + "]").length > 0){
        alert(user_input + " already exists!")
        return
    }

    $("#select").append($('<option>', {
        value: user_input, 
        text : user_input
    }))


}

$(document).ready(function(){    
    $(".add").click(handleAddButtonClick)
})