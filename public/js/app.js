

$(document).ready(function() {
    $('.parallax').parallax();
    //save an article
    $(document).on("click", "#save", function() {
        alert("Article saved.  Visit saved articles to comment on it");
        $.ajax({
            method: "POST",
            url: "/save",
            data: {
                title: $(this).data("title"),
                link: $(this).data("link"),
                teaser: $(this).data("teaser"),
                imgLink: $(this).data("imglink")
            }
        });
    });
    //delete an article
    $(document).on("click", "#delete", function() {
       
        var id = $(this).data("id");
        console.log(id);
        alert("Article and notes deleted");
        $.ajax({
            method: "DELETE",
            url: "/delete/" + id
        });
        location.href = "/articles";
    });
    
    //save note for specific article
    //TO DO make collapsible header not active so it closes after saving note
    $(document).on("click", "#saveNote", function() {
        event.preventDefault();
        var id = $(this).data("id");
         var baseURL = window.location.origin;
        var note = $(".materialize-textarea").val().trim();
        var title = $("#noteTitle").val().trim();

        $.ajax({
            method: "POST",
            url: baseURL + "/articles/" + id,
            data: {
            	title: title,
                body: note
            }
        })
        .done(function() {
        $(".materialize-textarea").val("");
        $("#noteTitle").val(""); 
        });
       
    });

    //delete note from article
    $(document).on("click", "#deleteNote", function() {
    	event.preventDefault();
    	var id = $(this).data("id");
    	console.log(id);
    	$.ajax({
    		method: "DELETE",
    		url: "/delete/notes/" + id
    	});
        location.href = "/articles";
    });


});
