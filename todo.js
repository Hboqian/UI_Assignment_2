// if (localStorage.getItem("sorted_teammate_names") === null){
//     localStorage.setItem("sorted_teammate_names", [])
// }
// if (localStorage.getItem("teammate_items") === null){
//     localStorage.setItem("teammate_items", JSON.stringify({}))
// }
// if (localStorage.getItem("item_dates") === null){
//     localStorage.setItem("item_dates", JSON.stringify({}))
// }
// if (localStorage.getItem("item_count") === null){
//     localStorage.setItem("item_count", 0)
// }

sorted_teammate_names = JSON.parse(localStorage.getItem("sorted_teammate_names")) || []
teammate_items = JSON.parse(localStorage.getItem("teammate_items")) || {}
item_dates = JSON.parse(localStorage.getItem("item_dates")) || {}
item_count = localStorage.getItem("item_count") || 0

function handleAddButtonClick(){
    let user_input = $('.text_input').val()
    let compact_user_input = user_input.replace(/\s+/g, '')

    // -----Error Checks-----
    if (compact_user_input === ""){
        alert("You cannot enter an empty name.")
        $(".text_input").val('')
        return
    }

    if ($("#select option[value='" + user_input + "']").length > 0){
        alert(user_input + " already exists!")
        $(".text_input").val('')
        return
    }
    // ----------------------

    // Get existing options
    let tempArr = new Array()
    for (let i = 0; i < $('#select option').length; i++){
        tempArr[i] = $('#select option')[i].value;
    }

    // Remove child and append back Assign To
    $('#select').empty()
    $('#select').append($('<option>').text("Assign to").val('default'))

    // Sort the option values
    tempArr = tempArr.slice(1)
    tempArr.push(user_input)
     
    let sorted_arr = tempArr.sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'base'}))
    sorted_teammate_names = sorted_arr
    
    localStorage.setItem("sorted_teammate_names", JSON.stringify(sorted_arr))

    teammate_items[user_input] = []
    localStorage.setItem("teammate_items", JSON.stringify(teammate_items))


    for (let i = 0; i < sorted_arr.length; i++){
        $('#select').append($('<option>').text(tempArr[i]).val(tempArr[i]))
    }

    $(".text_input").val('')
    $('#select').val(user_input)
    
    // Disable Assign To if a name is added
    if ($("#select option[value=default]").attr('disabled') || '' !== 'disabled'){
        $("#select option[value=default]").attr('disabled', 'disabled')
    }
}

function valid_date_string(date){
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;

    return date.match(regex) !== null
        
}

function valid_date(date){
    const js_date = new Date(date)

    return js_date instanceof Date && !isNaN(js_date)
}

function convert_to_JS_date(date){
    let year = date.slice(6)
    let month = date.slice(0, 2)
    let day = date.slice(3, 5)

    return year.concat("-", month, "-", day)
}

function handleAssignButtonClick(){
    let task_input = $('.task_input').val()
    let date_input = $('.date_input').val()
    let compact_task_input = task_input.replace(/\s+/g, '')
    let compact_date_input = date_input.replace(/\s+/g, '')
 
    // -----Error Checks-----
    if ($('#select').val() === 'default'){
        alert("You need to assign the task to someone. Add a teammate if you have not.")
        return
    }

    if (compact_task_input === ""){
        alert("You cannot enter an empty task.")
        $(".task_input").val('')
        return
    }

    if (compact_date_input === ""){
        alert("You cannot enter an empty date.")
        $(".date_input").val('')
        return
    }

    if (!valid_date_string(date_input)){
        alert("You have to enter date in MM/DD/YYYY format.")
        $(".date_input").val('')
        return
    }
    else{
        // Translate to the default format of JS Date
        let year_month_day = convert_to_JS_date(date_input)
        
        // Check if it is in the right format
        if (!valid_date(year_month_day)){
            alert("You have entered an invalid date.")
            $(".date_input").val('')
            return
        }
        // Check if its a valid date. NOTE: 86400000 is the number of miliseconds in a day 
        if ((new Date(year_month_day).getTime() + 86400000) < new Date().getTime()){
            alert("You cannot enter a date before today.")
            $(".date_input").val('')
            return
        }
    }
    // ----------------------

    // Delete the placeholder text if we have not.
    let teammate = $("#select").val()
    let teammate_pos = sorted_teammate_names.indexOf(teammate)
    let container;

    // Only create a div + heading if there isn't one already
    if (!$("#" + teammate.replace(/\s+/g, '_')).length){
        container = ($('<div>').attr({'id' : teammate.replace(/\s+/g, '_')}))
        container.append($('<div>').text(teammate).attr({
            'class' : 'second_heading'
        }))
        if ($('.placeholder_center').length){
            container.insertAfter($('.placeholder_center'))
            $(".placeholder_center").remove()
        }
        else{
            if (teammate_pos == 0){
                let id = sorted_teammate_names[1].replace(/\s+/g, '_')
                container.insertBefore($("#" + id))
            }
            else{
                let id = sorted_teammate_names[teammate_pos - 1].replace(/\s+/g, '_')
                container.insertAfter($("#" + id))
            }
        }
    }
    
    // If its our first creation then append after placeholder then delete it
    
    let task_content = $('<div>').text(task_input).attr({
        'class' : 'task',
        'id' : task_input.replace(/\s+/g, '_'),
    })
    
    let task_inner_content = $('<span>').text(date_input).attr({'class' : 'right'})
    task_inner_content.append($('<input>').attr({
        'type' : 'checkbox',
        'id' : item_count,
    }))

    task_content.append(task_inner_content)

    if (teammate_items[teammate].length === 0){
        container.append(task_content)
        teammate_items[teammate].push(task_input)
        item_dates[task_input] = date_input
        localStorage.setItem("teammate_items", JSON.stringify(teammate_items))
        localStorage.setItem("item_dates", JSON.stringify(item_dates))
    }
    else{

        teammate_items[teammate].push(task_input)
        item_dates[task_input] = date_input

        localStorage.setItem("teammate_items", JSON.stringify(teammate_items))
        localStorage.setItem("item_dates", JSON.stringify(item_dates))

        let tempArr = teammate_items[teammate].sort(function(a, b){
            console.log(a, b)
            console.log((new Date(convert_to_JS_date(item_dates[a])).getTime()) - (new Date(convert_to_JS_date(item_dates[b])).getTime()))
            return (new Date(convert_to_JS_date(item_dates[a])).getTime()) - (new Date(convert_to_JS_date(item_dates[b])).getTime())
        })

        item_pos = tempArr.indexOf(task_input)
        console.log(item_pos)

        teammate_items[teammate] = tempArr

        localStorage.setItem("teammate_items", JSON.stringify(teammate_items))

        if (item_pos === 0){
            task_content.insertBefore($("#" + teammate_items[teammate][1].replace(/\s+/g, '_')))
        }
        else{
            task_content.insertAfter($("#" + teammate_items[teammate][item_pos - 1].replace(/\s+/g, '_')))
        }
    }

    // Assigning onchange for checkbox
    $('#' + item_count).on('change', function () {
        if (this.checked){
            $('#' + task_input.replace(/\s+/g, '_')).attr({'class' : 'task_strike_through'})
        }
        else{
            $('#' + task_input.replace(/\s+/g, '_')).attr({'class' : 'task'})
        }
    })
    item_count += 1
    localStorage.setItem("item_count", item_count)

}

function handleClearButtonClick(){
    sorted_teammate_names.forEach(name => {
        $("#" + name + " .task_strike_through").each(function() {
            let tempArr = teammate_items[name]
            let index = tempArr.indexOf(this.id.replace('_', ' '))
            if (index >= 0){
                tempArr.splice(index, 1)
            }
            teammate_items[name] = tempArr

            localStorage.setItem("teammate_items", JSON.stringify(teammate_items))

            delete item_dates[this.id]

            localStorage.setItem("item_dates", JSON.stringify(item_dates))
            item_count -= 1
            localStorage.setItem("item_count", item_count)
            $(this).remove()
        })
    });


    sorted_teammate_names.forEach(name => {
        if (teammate_items[name].length === 0){
            if (item_count === 0 && !$('.placeholder_center').length){
                let placeholder = $('<div>').text('No Tasks right now. Please add a teammate and assign a task.').attr({
                    'class' : 'placeholder_center'
                })
                placeholder.insertAfter($("#" + name))
            }
            $("#" + name).remove()
        }
    })
}

function handleResetButtonClick(){
    if (window.confirm("Are you sure you want to reset?")){
        sorted_teammate_names.forEach(name => {
            if (!$('.placeholder_center').length){
                let placeholder = $('<div>').text('No Tasks right now. Please add a teammate and assign a task.').attr({
                    'class' : 'placeholder_center'
                })
                placeholder.insertAfter($("#" + name))
            }

            $("#" + name).remove()
            teammate_items[name] = []
            item_dates = {}
            item_count = 0

            localStorage.setItem("teammate_items", JSON.stringify(teammate_items))
            localStorage.setItem("item_dates", JSON.stringify(item_dates))
            localStorage.setItem("item_count", item_count)
        })
    }       
}

function updateOptions(){
    if (sorted_teammate_names.length > 0){
        for (let i = 0; i < sorted_teammate_names.length; i++){
            $('#select').append($('<option>').text(sorted_teammate_names[i]).val(sorted_teammate_names[i]))
        }

        $("#select option[value=default]").attr('disabled', 'disabled')
    }
}

function updateTasks(){
    let checkbox_index = 0
    sorted_teammate_names.forEach(name => {
        let items = teammate_items[name]

        if (items.length > 0){
            let container = ($('<div>').attr({'id' : name.replace(/\s+/g, '_')}))
            container.append($('<div>').text(name).attr({
                'class' : 'second_heading'
            }))

            if ($('.placeholder_center').length){
                container.insertAfter($('.placeholder_center'))
                $(".placeholder_center").remove()
            }
        
            items.forEach(item => {
                let task_content = $('<div>').text(item).attr({
                    'class' : 'task',
                    'id' : item.replace(/\s+/g, '_'),
                })
                
                let task_inner_content = $('<span>').text(item_dates[item]).attr({'class' : 'right'})
                task_inner_content.append($('<input>').attr({
                    'type' : 'checkbox',
                    'id' : checkbox_index,
                }))
                checkbox_index += 1
                task_content.append(task_inner_content)
                container.append(task_content)
            })
        }
    })

}

$(document).ready(function(){    
    $(".add").click(handleAddButtonClick)
    $(".assign").click(handleAssignButtonClick)
    $(".clear_completed").click(handleClearButtonClick)
    $(".reset").click(handleResetButtonClick)

    updateOptions()
    updateTasks()
})