// once document is ready
$(document).ready(function() {

    // this will start the autosize script to allow automatic growth of the textbox for tweeting
    autosize(document.querySelectorAll('#textboxPost'));

    // this will make all the divs that have  .div-link class a link while keeping everything else clickable as needed 
    divLinkMaker();

    //this will add all events
    addEvents();



});




/** 
 * This function will link all .div-link to be a link while keeping everything else clickable as needed.
 * Should have a .div-link and inside of that div will have a .div-link-a class 
 * All clickable elements should have a .c class. 
 * 
 * Credit for this idea goes to:
 * https://css-tricks.com/block-links-the-search-for-a-perfect-solution
 */
function divLinkMaker() {

    // loop through all ements that have the class of div-link
    $('.div-link').each(function() {

        // use $(this) to reference the current div 
        div = $(this);
        // save the .div-link-a that is inside of the div 
        divLink = $(this).find($('.div-link-a')).get(0);


        // save the array of clickable elements that the div has  (any object with a .c class)
        clickableElements = div.find($('.c'));
        // append the div-link-a to clickableElements since we need to be able to "click it"
        clickableElements.push(divLink);


        //make sure all the clickable elements are able to work as needed
        clickableElements.each(function() {
            clickableElement = $(this);
            clickableElement.on("click", (e) => e.stopPropagation());
        });


        // this function will let a user select text inside of a .div-link element otherwise it will activate the div link
        function handleClick(event) {
            const noTextSelected = !window.getSelection().toString();

            if (noTextSelected) {
                //divLink.click();
                $(this).find($('.div-link-a')).get(0).click();

            }
        }

        // add an event listener to handle text selection when div is a link
        div.on("click", handleClick);
    });
}

/**
 * This function will activate when a user presses the like button on a post 
 * It will pass in the current div col that the button is embeded within
 */
function commentPressed(event) {
    el = $(this);
    span = el.find("span");
    // check if the user has already  commented
    alreadyPressed = el.hasClass("commented");


    // they have already pressed we need to change it back  
    if (alreadyPressed) {
        el.removeClass("commented");
        el.children().find(".bi-chat-fill").removeClass("bi-chat-fill").addClass("bi-chat");
        addValue(span, -1);

    }
    /// if it has not been pressed add the class 
    else {
        el.addClass("commented");
        el.children().find(".bi-chat").removeClass("bi-chat").addClass("bi-chat-fill");
        addValue(span, 1);

    }
}

/**
 * This function will activate when a user presses the like button on a post 
 * It will pass in the current div col that the button is embeded within
 */
function likePressed(event) {
    el = $(this);
    span = el.find("span");
    // check if the user has already liked this comment
    alreadyPressed = el.hasClass("liked");


    // they have already pressed we need to change it back  
    if (alreadyPressed) {
        el.removeClass("liked");
        el.children().find(".bi-heart-fill").removeClass("bi-heart-fill").addClass("bi-heart");
        addValue(span, -1);

    }
    /// if it has not been pressed add the class 
    else {
        el.addClass("liked");
        el.children().find(".bi-heart").removeClass("bi-heart").addClass("bi-heart-fill");
        addValue(span, 1);

    }
}



/**
 * This function will activate when a user presses the retweet button on a post 
 * It will pass in the current div col that the button is embeded within
 */
function retweetPressed(event) {
    el = $(this);
    span = el.find("span");

    // check if the user has already liked this comment
    alreadyPressed = el.hasClass("retweeted");


    // they have already pressed we need to change it back  
    if (alreadyPressed) {
        el.removeClass("retweeted");
        addValue(span, -1);

    }
    /// if it has not been pressed add the class 
    else {
        el.addClass("retweeted");
        addValue(span, 1);
    }
}

/**
 * This function will activate when a user presses the save button on a post 
 * It will pass in the current div col that the button is embeded within
 */
function savePressed(event) {
    el = $(this);
    span = el.find("span");
    // check if the user has already liked this comment
    alreadyPressed = el.hasClass("saved");


    // they have already pressed we need to change it back  
    if (alreadyPressed) {
        el.removeClass("saved");
        el.children().find(".bi-bookmark-fill").removeClass("bi-bookmark-fill").addClass("bi-bookmark");
        addValue(span, -1);

    }
    /// if it has not been pressed add the class 
    else {
        el.addClass("saved");
        el.children().find(".bi-bookmark").removeClass("bi-bookmark").addClass("bi-bookmark-fill");
        addValue(span, 1);

    }
}

function followPressed(event) {
    el = $(this);
    alreadyFollowed = el.hasClass('btn-primary');
    console.log(alreadyFollowed)
    if (alreadyFollowed) {
        el.removeClass('btn-primary').addClass('btn-outline-primary')
        el.text("Follow")
    } else {
        el.removeClass('btn-outline-primary').addClass('btn-primary')
        el.text("Following")
    }
}

function textboxPostInputChanged(event) {
    sLength = ($(this).val()).length;
    tweetButton = $(this).closest('.d-flex').find('.tweetText');

    if (sLength > 0) {

        tweetButton.removeClass("btn-outline-primary").addClass("btn-primary");
    } else {
        tweetButton.removeClass("btn-primary").addClass("btn-outline-primary")
    }
}

function checkEmail(event) {
    email = ($(this).val());
    // currently using this as the "check since we cant validate the username or email yet"
    if (!validateEmail(email)) {
        $(this).addClass('is-invalid');
        $(this).off('focusout').off('input').on("input", checkEmail);
        $('#email-label').text("Invalid email address")

    } else {
        $(this).removeClass('is-invalid').addClass("is-valid");
        $('#email-label').text("Email address")
    }

}

function checkName(event) {
    fullName = ($(this).val());
    // currently using this as the "check since we cant validate the username or email yet"
    if (!validateName(fullName)) {
        $(this).addClass('is-invalid');
        $(this).off('focusout').off('input').on("input", checkName);
        $('#name-label').text("Invalid full name")

    } else {
        $(this).removeClass('is-invalid').addClass("is-valid");
        $('#name-label').text("Full Name")
    }

}


function checkPassword(event) {
    password = ($(this).val());
    // currently using this as the "check since we cant validate the username or email yet"
    if (!validatePassword(password)) {
        $(this).addClass('is-invalid');
        $(this).off('focusout').off('input').on("input", checkPassword);
        $('#pasword-label').text("Password must be at least 3 characters")

    } else {
        $(this).removeClass('is-invalid').addClass("is-valid");
        $('#password-label').text("Password")
    }

}


function checkRepeatPassword(event) {
    passwordRepeat = ($(this).val());
    password = $('#password').val();
    // currently using this as the "check since we cant validate the username or email yet"
    if (!(password === passwordRepeat)) {
        $(this).addClass('is-invalid');
        $(this).off('focusout').off('input').on("input", checkRepeatPassword);
        $('#password-repeat-label').text("Passwords must match")

    } else {
        $(this).removeClass('is-invalid').addClass("is-valid");
        $('#password-label').text("Password")
    }

}

function checkUsername(event) {
    username = ($(this).val());
    // currently using this as the "check since we cant validate the username or email yet"
    if (!validateUsername(username)) {
        $(this).addClass('is-invalid');
        $(this).off('focusout').off('input').on("input", checkUsername);
        // check if its because the first char is a number 
        if (/^\d/.test(username)) {
            $('#username-label').text("Invalid username: cant start with a number")
        } else {
            $('#username-label').text("Invalid username: only letters and numbers")
        }

    } else {
        $(this).removeClass('is-invalid').addClass("is-valid");
        $('#username-label').text("Username")
    }

}

/**
 * This function will loop through all the buttons and create click event for all of them
 * 
 */
function addEvents() {
    // for each comment element
    $('.comment-hover').each(function() {
        $(this).on("click", commentPressed);
    });

    // for each .repeat-hover (reteet element)
    $('.repeat-hover').each(function() {
        $(this).on("click", retweetPressed);
    });

    // for each .like-hover (like element)
    $('.like-hover').each(function() {
        $(this).on("click", likePressed);
    });

    // for each .save-hover (save element)
    $('.save-hover').each(function() {
        $(this).on("click", savePressed);
    });

    $('.followButton').each(function() {
        $(this).on("click", followPressed);
    })

    $('.textboxPost').each(function() {
        $(this).on("input", textboxPostInputChanged);
    });

    $('#email').each(function() {
        $(this).on("focusout", checkEmail);
    });

    $('#name').each(function() {
        $(this).on("focusout", checkName);
    });

    $('#username').each(function() {
        $(this).on("focusout", checkUsername);
    });


    $('#password').each(function() {
        $(this).on("focusout", checkPassword);
    });

    $('#password-repeat').each(function() {
        $(this).on("focusout", checkRepeatPassword);
    });

    // when you want to delete your image upload 
    $(document).on("click", "#delete-result", function(ev) {
        $('.upload-result').html("")
            // change imagedata if needed here

    });


}

/**
 * Function will numerically add a value to the target element. If target element has whitespace it will 
 * just set the targetelement text to value.
 * 
 * @targetElement  - element that either is whitespace or has a pre-exisiting number inside 
 * @value - value you want to add to the target
 * 
 */
function addValue(targetElement, value) {


    // get the text of the targetElement
    text = targetElement.text();
    //  if text is not whitespace
    if (text.trim()) {
        // add the value to the current int inside of text
        targetElement.text(parseInt(text) + value);
    } else {
        console.log(targetElement.text())
            // if whitespace just set text to value 
        targetElement.text(value.toString());
        console.log(targetElement.text())
    }

    if (targetElement.text() < 1) {
        targetElement.text("");
    }


}

function validateEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
}

function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name);
}

function validateUsername(username) {
    return /[a-zA-Z][a-zA-Z0-9]*$/.test(username);
}

function validatePassword(password) {
    return (password.length > 2);
}

// will add the image blog preview into the post box
function addPostImage(imgdata) {

    result = `
        <hr>
        <div class="position-relative container-fluid px-0 py-0">
            <div class="position-absolute top-0 end-0 px-2 py-2"><button id="delete-result" class="btn btn-light rounded-3 postDiv"><i class="bi bi-x-circle px-0 py-0 mx-0 my-0"></i></button></div>
            <img class=" border border-1 rounded-3" img-fluid  style='width:100%;' src=" ` + imgdata + ` ">
        </div>
    `;
    // select the upload-result class
    $('.upload-result').html(result);
    $('#ImageCropModal').modal('hide');
}

var $uploadCrop;

function readFile(input) {
    if (!$uploadCrop) {
        $uploadCrop = $('#upload-demo').croppie({
            viewport: {
                width: 600,
                height: 300,
            },
            enableExif: true
        });
    }

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#upload-demo').addClass('ready');
            $uploadCrop.croppie('bind', {
                url: e.target.result
            }).then(function() {
                console.log('jQuery bind complete');
            });

        }

        reader.readAsDataURL(input.files[0]);
    } else {
        console.log("Sorry - you're browser doesn't support the FileReader API");
    }
};


$('#upload').on('change', function() {
    $('#ImageCropModal').modal('show');

    readFile(this);
    $('#upload').val("")

});



$(document).on("click", ".result-show", function(ev) {

    $uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport'
    }).then(function(resp) {

        addPostImage(resp)

    });
});


$(document).on("click", ".hide-modal", function(e) {
    $('#ImageCropModal').modal('hide');
})

$("#upload_replacement").on('click', function(e) {
    e.preventDefault();
    $("#upload:hidden").trigger('click');
});


$(document).on("click", ".deleteImage", function(e) {
    console.log("delete")
    $('.result').html("");
});