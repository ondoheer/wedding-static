/*
1. GLOBALS
2. HELPER FUNCTIONS
3. RSVP
4. SUBMENUES EVENTS
5. MOBILE MENU
6. MESSAGE BOWL
7. MUSIC
7.1 MUSIC AJAX
8. COMMENTS
8.1 COMMENTS AJAX
9. REPLIES
10. COUNTDOWN
11. HEADER
12. INFO
13. USER OPTIONS
14. VER MAS STORY
15. INSTAGRAM LOGIC



*/

$(document).ready(function() {
  /******************************************************************************************
	1 . GLOBALS 
	*******************************************************************************************/

  var colors = [
    "rgba(255,255,255,0.4)",
    "rgba(202,249,126,0.4)",
    "rgba(247,188,106,0.4)",
    "rgba(138,190,149,0.4)",
    "rgba(250,176,206,0.4)",
    "rgba(136,243,242,0.4)",
    "rgba(249,245,154,0.4)"
  ];
  var fonts = [
    "Special Elite",
    "Gloria Hallelujah",
    "Coming Soon",
    "Satisfy",
    "Delius Swash Caps",
    "Leckerli One",
    "Shadows Into Light Two"
  ];

  /*********************************************************************************************************
	2. HELPER FUNCTIONS 
	******************************************************************************************/

  //Just hidding all for the first time and recolecting the heights:
  ourHeights = {
    story: new Array(),
    info: new Array(),
    talk: new Array()
  };

  var getHeights = function(sectionName, elements) {
    for (var j = 0; j < elements.length; j++) {
      switch (sectionName) {
        case "story":
          ourHeights.story.push(elements[j].offsetHeight);
          break;
        case "info":
          ourHeights.info.push(elements[j].offsetHeight);
          break;
        case "talk":
          ourHeights.talk.push(elements[j].offsetHeight);
          break;
      }
      $(elements[j]).css({
        paddingTop: 0,
        paddingBottom: 0
      });
      $(elements[j]).height(0);
    }
  };

  getHeights("story", $(".story-event"));
  getHeights("info", $(".info-article"));
  getHeights("talk", $(".post"));

  var selfHeight;
  var setHeightToAuto = function(element) {
    element.style.height = "auto";
  };

  // Helper Function for the our slow sliders
  var hideAndShow = function(
    target,
    activeTargets,
    eventNumber,
    elements,
    elementsData,
    ourHeightsSection
  ) {
    var selfHeightIndex = eventNumber - 1;
    for (var i = 0; i < elements.length; i++) {
      if ($(elements[i]).attr(elementsData) != eventNumber) {
        TweenLite.to(elements[i], 0.6, {
          css: { height: 0, paddingTop: 0, paddingBottom: 0 },
          ease: Power4.easeOut
        });
        $(elements[i]).attr("data-shown", "false");
        $(activeTargets[i]).attr("active", "false");
      } else if ($(elements[i]).attr(elementsData) == eventNumber) {
        if ($(elements[i]).attr("data-shown") == "true") {
          TweenLite.to(elements[i], 0.6, {
            css: { height: 0, paddingTop: 0, paddingBottom: 0 },
            ease: Power4.easeOut
          });
          $(elements[i]).attr("data-shown", "false");
          $(activeTargets[i]).attr("active", "false");
        } else {
          selfHeight = ourHeightsSection[selfHeightIndex];
          TweenLite.to(elements[i], 0.6, {
            css: {
              height: selfHeight,
              paddingTop: "10px",
              paddingBottom: "10px"
            },
            ease: Power4.easeIn,
            onComplete: setHeightToAuto,
            onCompleteParams: [elements[i]]
          });
          $(elements[i]).attr("data-shown", "true");
          $(activeTargets[i]).attr("active", "true");
        }
      }
    }
  };

  // mostramos loading en ajax enb todos los textos, por ahora no hay otra
  $(document)
    .ajaxStart(function() {
      $(".ver-mas-text").text("cargando ▼");
    })
    .ajaxStop(function() {
      $(".ver-mas-text").text("ver más ▼");
    });

  //Instantiate fast click
  $(function() {
    FastClick.attach(document.body);
  });

  // delete forms on 'esc' keyUp
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      $(".reply-form-wrapper").remove();
      $(".comment-form-wrapper").remove();
      $(document).trigger("click");
    } // esc
  });
  /*********************************************************************************************************
	3. RSVP
	******************************************************************************************/
  $(document).on("click", ".rsvp-button", function(e) {
    e.preventDefault;

    var clicked = $(this).attr("id");
    // basic json object to send
    var rsvp = {
      status: 2
    };

    switch (clicked) {
      case "rsvp-yes":
        rsvp.status = 1;
        break;
      case "rsvp-no":
        rsvp.status = 0;
        break;
    }

    // Send data to the flask endpoint
    $.getJSON("/rsvp", rsvp, function(rsvpReceived) {
      // change the displayed items FOREVER because this is how Carlos designed it!
      if (rsvpReceived.status) {
        $("#rsvp-right")
          .children()
          .remove();
        $("#rsvp-right").html(
          '<button class="rsvp-button rsvp-item rsvp-going-btn" id="rsvp-yes">Si</button>' +
            '<span class="rsvp-message rsvp-going-message" id="rsvp-message">Por supuesto que voy, comopodría perderme el acontecimiento del año!</span>'
        );
      } else if (!rsvpReceived.status) {
        $("#rsvp-right")
          .children()
          .remove();
        $("#rsvp-right").html(
          '<button class="rsvp-button rsvp-item rsvp-not-going-btn" id="rsvp-no">No</button>' +
            '<span class="rsvp-message rsvp-not-going-message" id="rsvp-message ">¡Que culpa que siento! Mejor les doy <br>un buen regalo!</span>'
        );
      }
    });
  });

  /*****************************************************************************************
	4. SUBMENUES EVENTS
	*****************************************************************************************/
  $(document).on("click", ".icon-menu-link", function(e) {
    e.preventDefault();
    hideAndShow(
      $(this),
      $(".desc-story-item"),
      $(this)
        .parent()
        .attr("data-event"),
      $(".story-event"),
      "data-event-body",
      ourHeights.story
    );
  });
  $(document).on("click", ".desc-story-item", function(e) {
    e.preventDefault();
    hideAndShow(
      $(this),
      $(".desc-story-item"),
      $(this).attr("data-event"),
      $(".story-event"),
      "data-event-body",
      ourHeights.story
    );
  });

  // Info menu icons
  $(document).on("click", ".info-menu-item", function(e) {
    e.preventDefault();
    hideAndShow(
      $(this),
      $(".desc-info-item"),
      $(this).attr("data-info"),
      $(".info-article"),
      "data-info-body",
      ourHeights.info
    );
  });
  $(document).on("click", ".desc-info-item", function(e) {
    e.preventDefault();
    hideAndShow(
      $(this),
      $(".desc-info-item"),
      $(this).attr("data-info"),
      $(".info-article"),
      "data-info-body",
      ourHeights.info
    );
  });

  // posts menu
  $(document).on("click", ".talk-menu-item", function(e) {
    e.preventDefault();
    hideAndShow(
      $(this),
      $(".desc-talk-item"),
      $(this).attr("data-post"),
      $(".post"),
      "data-post-body",
      ourHeights.talk
    );
  });
  $(document).on("click", ".desc-talk-item", function(e) {
    e.preventDefault();
    hideAndShow(
      $(this),
      $(".desc-talk-item"),
      $(this).attr("data-post"),
      $(".post"),
      "data-post-body",
      ourHeights.talk
    );
  });

  /*******************************************************************************
	5. MOBILE MENU
	*******************************************************************************/
  //Setting the globals for the animatingMenuLogic function
  var fullPageHeight,
    headerHeight,
    singleLiHeight,
    menuButton = $("#mobile-menu-icon"),
    mobileMenu = $("#mobile-menu"),
    mobileMenuLis = $(".mobile-menu-li"),
    mobileMenuInnerButton = $(".mobile-menu-icon-inner-button"),
    state = true,
    mobileMenuWidth = mobileMenu.width();
  landscapeMax = 320;

  //We create a simple function so we do not repeat code.
  var animatingMenuLogic = function(menu, menuItems, innerButton) {
    fullPageWidth = $(window).width();
    fullPageHeight = $(window).height();
    headerHeight = $("#header-top").innerHeight();
    singleLiHeight = "" + fullPageHeight / 6 + "";
    innerButtonMargin = "" + (singleLiHeight - 40) / 2 + "px";

    landscapeMax =
      fullPageWidth < fullPageHeight ? fullPageHeight : fullPageWidth;

    //Change the top attribute of the #mobile-menu
    menu.css("right", -landscapeMax);
    innerButton.css("margin-top", innerButtonMargin);
    // Menu Height logic
    menuItems.css({
      height: singleLiHeight,
      lineHeight: singleLiHeight + "px"
    });
  };

  // First we call the function so its values are set
  animatingMenuLogic(mobileMenu, mobileMenuLis, mobileMenuInnerButton);

  // Then we set an eventhandler to run the function again to check if the size of the menu should change
  $(window).on("resize", function() {
    animatingMenuLogic(mobileMenu, mobileMenuLis, mobileMenuInnerButton);

    $("#options-icon").on("click", function() {
      $("#options-ul").toggle();
    });
    if (window.innerWidth > 1024) {
      $(window).on("resize", function() {
        animatingMenuLogic(mobileMenu, mobileMenuLis, mobileMenuInnerButton);
        var userPadding = parseInt($(".inner-wrapper").css("margin-left"));

        $("#options-ul").css({
          left: userPadding
        });
      });
    }
  });

  //Opening the sidebar on menu-button click
  menuButton.on("click", function() {
    TweenLite.to(mobileMenu, 0.3, { css: { right: 0 }, ease: Power4.easeOut });
  });

  //Closing the mobileMenu on not(mobileMenu) click.
  $(document).on("click", function(e) {
    if (e.target != menuButton.get(0)) {
      TweenLite.to(mobileMenu, 0.3, {
        css: { right: -landscapeMax },
        ease: Power4.easeOut
      });
    } else {
      return;
    }
  });

  /*************************************************************************
	6. MESSAGE BOWL
	*****************************************************************************/
  $("#bowl-action").on("click", function(e) {
    e.preventDefault;
    $("#bowl-form").toggle();
  });

  $("#bowl-submit").on("click", document, function(e) {
    e.preventDefault;

    // basic json object to send
    var bowl_message = {
      message: $("#bowlTextArea").val()
    };
    $("#bowl-form").toggle();
    $("#bowlTextArea").val("");

    // Send data to the flask endpoint
    $.getJSON("/bowl", bowl_message, function(messageReceived) {
      var existingMessages = $(".bowl-message");
      /*for(var i = 0; i < existingMessages.length; i++){
				if($(existingMessages[i]).attr('data-bowl-user') == messageReceived.guest_id){
					$(existingMessages[i]).remove();
				}
			}*/

      var tempFont = fonts[Math.floor(Math.random() * fonts.length)];
      var tempColor = colors[Math.floor(Math.random() * colors.length)];

      $("#bowl-container").append(
        '<article class="bowl-message" id="message-' +
          messageReceived.guest_id +
          '" data-bowl-user="' +
          messageReceived.guest_id +
          '" style="font-family:' +
          tempFont +
          "; background-color:" +
          tempColor +
          '">' +
          '<img class="bowl-logo" src="/static_front/img/general/logo-bowl.png" alt="Pedro & Lucía se casan">' +
          '<p class="bowl-body">' +
          messageReceived.bowl_message +
          "</p>" +
          '<span class="bowl-guest">' +
          messageReceived.nickname +
          "</span>" +
          "</article>"
      );

      $(".bowl-message").wookmark({
        container: $("#bowl-container"),
        autoResize: true,
        offset: 10,
        fillEmptySpace: false,
        flexibleWidth: false,
        outerOffset: 10
      });
    });
  });

  // BOWL RANDOMIZER

  var messages = $("#bowl .bowl-message-inner");
  for (var i = 0; i < messages.length; i++) {
    //select random font
    var tempFont = fonts[Math.floor(Math.random() * fonts.length)];
    var tempColor = colors[Math.floor(Math.random() * colors.length)];
    $($(messages)[i]).css({
      "background-color": tempColor,
      "font-family": tempFont
    });
  }

  // bowl GRID

  $(window).load(function() {
    setTimeout(function() {
      $(".bowl-message").wookmark({
        container: $("#bowl-container"),
        autoResize: true,
        offset: 10,
        fillEmptySpace: false,
        flexibleWidth: false,
        outerOffset: 10
      });
    }, 500);
  });

  /*************************************************************************
	7. MUSIC
	****************************************************************************/
  var numberOfdisplayedSongs = 6;
  $("#music-action").on("click", function(e) {
    e.preventDefault;
    $("#music-form").toggle();
  });
  $("#music-submit").on("click", document, function(e) {
    e.preventDefault;

    //vasic JSON object to send
    var song = {
      title: $("#songTitle").val(),
      artist: $("#songArtist").val()
      /*'genre': $('#songGenre').val()*/
    };
    $("#music-form").toggle();
    $("#songTitle").val("");
    $("#songArtist").val("");
    /*$('#songGenre').val('');*/

    // Send data to the flask endpoint
    $.getJSON("/song", song, function(receivedSong) {
      $("#songs-container").append(
        '<li class="song">' +
          '<div class="song-number"></div>' +
          '<div class="song-data">' +
          '<h3 class="song-title">' +
          song.title +
          "</h3>" +
          '<h4 class="song-artist">' +
          song.artist +
          "</h4>" +
          "</div>" +
          "</li>"
      );
    });
  });
  /******************************************************************************************
	7.1 MUSIC AJAX
	*******************************************************************************************/

  $("#ver-mas-music").on("click", function() {
    var numberOfSongs = $(".song").length;
    var data = {
      number: numberOfSongs
    };

    // realizamos el ajax
    $.ajax({
      dataType: "json",
      url: "/getsongs",
      data: data,
      success: function(receivedSongs) {
        var songsToAppend = "";

        for (var key in receivedSongs) {
          if (key != "status") {
            var song = receivedSongs[key];
            var tempSong =
              '<li class="song">' +
              '<div class="song-number"></div>' +
              '<div class="song-data">' +
              '<h3 class="song-title">' +
              song.title +
              "</h3>" +
              '<h4 class="song-artist">' +
              song.artist +
              "</h4>" +
              "</div>" +
              "</li>";
            songsToAppend += tempSong;
          }
        }
        if (songsToAppend.length != 0) {
          $("#songs-container").append(songsToAppend);
        }
        // si status es False no quedan canciones en el server y hay que quitar el boton de ver más
        if (!receivedSongs.status) {
          $("#ver-mas-music").remove();
        }
      }
    });
  });

  /******************************************************************************************
	8. COMMENTS
	*******************************************************************************************/
  $(".comment-action").on("click", function(e) {
    e.preventDefault;

    var FormMarginTop = "10px";
    //remove the last comment-form just in case
    if ($("#talk-subjects-container #comment-form").length) {
      $(".comment-form-wrapper").remove();
    }

    // definimos los formularios
    var commentForm =
      '<div class="comment-form-wrapper">' +
      '<div class="comment-form" id="comment-form">' +
      '<input id="commentTitle" name="commentTitle" placeholder="Ponle un título a tu historia" type="text" value="">' +
      '<textarea id="commentBody" name="commentBody" placeholder="Escribe tu historia" value="" rows="4" cols="50">' +
      '</textarea><button class="input_submit comment-submit" id="comment-submit"></button>' +
      "</div>" +
      "</div>";

    //Prepends this templated form
    $("#talk-subjects-container").prepend(commentForm);
    $("#comment-form").css("margin-top", FormMarginTop);
    // defines the object to send
    var comment = {
      post_id: $(this).attr("data-post-id"),
      title: "",
      body: ""
    };

    // shows/hides comment form
    $("#comment-form").toggle();

    // Function that executes the logic for the click in the outer transparent borders of the modal
    $(".comment-form-wrapper").one("click", function(e) {
      e.preventDefault;

      if (e.target == this) {
        $(".comment-form-wrapper").remove();
      }
    });

    // we initialize beahvior inside the first click context
    $("#comment-submit").one("click", function(e) {
      e.preventDefault;
      comment.body = $(this)
        .prev()
        .val();
      comment.title = $(this)
        .prev()
        .prev()
        .val();

      $(".comment-form-wrapper").remove();

      // Starts the ajax JSOn call to save the comment in the
      // ddbb and attach it to the web
      $.getJSON("/comment", comment, function(receivedComment) {
        var postBody = "#post-body-" + receivedComment.post_id;

        $(postBody).prepend(
          '<div class="comment" id="comment-' +
            receivedComment.comment_id +
            '">' +
            '<div class="guest-img ' +
            receivedComment.color +
            '"></div>' +
            '<div class="comment-guest">' +
            '<h4 class="comment-nickname">' +
            receivedComment.guest +
            "</h4>" +
            '<span class="comment-time">' +
            receivedComment.timestamp +
            "</span>" +
            "</div>" +
            '<div class="comment-body">' +
            "<h4>" +
            receivedComment.title +
            "<h4>" +
            "<p>" +
            receivedComment.body +
            "</p>" +
            '<div class="reply-btns">' +
            '<div class="reply-action" data-comment-id="' +
            receivedComment.comment_id +
            '">responder</div>' +
            "</div>" +
            '<div class="replies-container"></div>' +
            "</div>" +
            "</div>"
        );
      });
    });
  });

  /******************************************************************************************
	8.1 COMMENTS AJAX
	*******************************************************************************************/
  $(".ver-mas-talk").on("click", function() {
    var attr = $(this)
      .closest(".post")
      .attr("data-post-body");

    numberOfComments = $("#post-" + attr).find(".comment").length;

    var data = {
      post_id: attr,
      number: numberOfComments
    };

    $.getJSON("/getcomments", data, function(receivedComments) {
      var postBody = $("#post-body-" + data.post_id);

      var commentsToAppend = "";

      for (var key in receivedComments) {
        if (key != "status") {
          // comentario recibido
          var comment = receivedComments[key].comment;

          // hay o no hay replies en ese comment?
          var repliesExist = comment.replies.length > 0 ? true : false;
          // botones a agregar al final del comment
          var buttons =
            '<div class="reply-btns"><div class="reply-action" data-comment-id="' +
            comment.id +
            '">responder</div>';
          if (repliesExist) {
            buttons += '<div class="reply-read" >ver respuestas</div></div>';
          } else {
            buttons += "</div>";
          }

          var tempReplies = '<div class="replies-container">';
          for (var key in comment.replies) {
            reply = comment.replies[key];
            tempReplies +=
              '<div class="reply">' +
              '<div class="guest-img ' +
              reply.color +
              '"></div>' +
              '<div class="comment-guest">' +
              '<h4 class="comment-nickname">' +
              reply.guest +
              "</h4>" +
              '<span class="comment-time">' +
              reply.time +
              "</span>" +
              "</div>" +
              '<div class="reply-body">' +
              "<p>" +
              reply.body +
              "</p>" +
              "</div>" +
              "</div>";
          }
          tempReplies += "</div>";

          var tempComment =
            '<div class="comment" id="comment-' +
            comment.id +
            '">' +
            '<div class="guest-img ' +
            comment.color +
            '"></div>' +
            '<div class="comment-guest">' +
            '<h4 class="comment-nickname">' +
            comment.guest +
            "</h4>" +
            '<span class="comment-time">' +
            comment.time +
            "</span>" +
            "</div>" +
            '<div class="comment-body">' +
            "<h4>" +
            comment.title +
            "</h4>" +
            "<p>" +
            comment.body +
            "</p>" +
            buttons +
            tempReplies +
            "</div>" +
            "</div>";
          commentsToAppend += tempComment;
        }
      }

      postBody.append(commentsToAppend);

      if (!receivedComments.status) {
        $("#ver-mas-talk").remove();
      }
    });
  });

  /******************************************************************************************
	9. REPLIES
	*******************************************************************************************/

  $(document).on("click", ".reply-read", function(e) {
    $(this)
      .parents(".comment-body")
      .find(".replies-container")
      .slideToggle();
  });
  $("#talk-subjects-container").on("click", ".reply-action", function(e) {
    e.preventDefault;

    var replyFormMarginTop = "20px";
    if ($(".reply-form-wrapper").length) {
      $(".reply-form-wrapper").remove();
    }

    var replyForm =
      '<div class="reply-form-wrapper">' +
      '<div class="reply-form" id="reply-form" >' +
      '<textarea id="replyBody" name="replyBody" value="" placeholder="Escribe tu respuesta"></textarea>' +
      '<button class="input_submit reply-submit" id="reply-submit"></button>' +
      "</div>" +
      "</div>";

    $("#talk-subjects-container").prepend(replyForm);
    $("#reply-form").css("margin-top", replyFormMarginTop);

    // Basic JSON object to send
    var reply = {
      comment_id: $(this).attr("data-comment-id"),
      body: ""
    };

    // shows/hides comment form
    $("#reply-form").toggle();

    // Function that executes the logic for the click in the outer transparent borders of the modal
    $(".reply-form-wrapper").one("click", function(e) {
      e.preventDefault;
      if (e.target == this) {
        $(".reply-form-wrapper").remove();
      }
    });

    $("#reply-submit").one("click", function(e) {
      e.preventDefault;

      reply.body = $(this)
        .prev()
        .val();
      $(".reply-form-wrapper").remove();

      $.getJSON("/reply", reply, function(receivedReply) {
        var comment = "#comment-" + receivedReply.comment_id;

        if ($(comment).find(".reply-read").length < 1) {
          // prepend ver respuestas button
          $(comment)
            .find(".reply-btns")
            .append('<div class="reply-read" >ver respuestas</div>');
        }

        // append the new reply
        $(comment)
          .find(".replies-container")
          .append(
            '<div class="reply" style="display: block">' +
              '<div class="guest-img ' +
              receivedReply.color +
              '"></div>' +
              '<div class="comment-guest">' +
              '<h3 class="comment-nickname">' +
              receivedReply.guest +
              "</h3>" +
              '<span class="comment-time">' +
              receivedReply.timestamp +
              "</span>" +
              "</div>" +
              '<div class="reply-body">' +
              "<p>" +
              receivedReply.body +
              "</p>" +
              "</div>" +
              "</div>"
          )
          .toggle();
      });
    });
  });

  /******************************************************************************************
	10. COUNTDOWN
	*******************************************************************************************/

  wedding = new Date("December 27, 2014, 15:00");
  $("#clock").countdown({
    until: wedding,
    compact: true,
    layout:
      '<span class="countdown-text">Faltan: </span><b class="countdown-text">{dn} d {hnn} h {mnn} m {snn} s</b>'
  });

  /******************************************************************************************
	11 . HEADER
	*******************************************************************************************/

  // grab an element
  var myElement = document.getElementById("header-top");
  //document.querySelector("header");
  // construct an instance of Headroom, passing the element
  var headroom = new Headroom(myElement, {
    offset: 150
  });
  // initialise

  headroom.init();

  /******************************************************************************************
12 . INFO
*******************************************************************************************/

  /*$(".lightbox").on('click', function(){
		var route = $(this).attr("src");
		var altText = $(this).attr("alt");
		var img = $(this).next(".lightbox-modal").find('img');
		var modal = $(this).next(".lightbox-modal");
		img.attr({
			"src": route,
			"alt": altText
		});
		modal.toggle();
		if ( window.height < window.length){
			modal.css('height', window.height);
		} else if( window.height > window.length){
			modal.css('width', '90%');
		}
	});


	$('.lightbox-modal').on('click', function(e) {
		if (e.target != $(this).next(".lightbox-modal").find('img') ) {
			$(this).toggle();
		}
	});*/

  /******************************************************************************************
13 . USER OPTIONS
*******************************************************************************************/

  if (window.innerWidth > 1024) {
    var userPadding = parseInt($(".inner-wrapper").css("margin-left"));

    $("#options-ul").css({
      left: userPadding
    });
  }

  $("#rsvp-left").on("click", function() {
    $("#options-ul").toggle();
  });

  /******************************************************************************************
14 . VER MAS STORY
*******************************************************************************************/

  /******************************************************************************************
15 . INSTAGRAM LOGIC
*******************************************************************************************/

  var xhr = new XMLHttpRequest();

  xhr.addEventListener("load", function() {
    var data = JSON.parse(xhr.responseText).data;
    var wrapper = document.getElementById("instagram-gallery");
    for (item in data) {
      var url = data[item].images.low_resolution.url;
      var div = document.createElement("div");
      div.innerHTML = '<img src="' + url + '" float:left>';
      wrapper.appendChild(div);
    }
  });

  xhr.open(
    "GET",
    "https://coffeemaker.herokuapp.com/instagram.json?q=pedroylucia",
    true
  );
  xhr.send();

  /******************************************************************************************
16 . Boncing icons & Distance-call-Hover-logic
*******************************************************************************************/

  $(".icon-menu-link").on("mouseenter", function() {
    TweenMax.to(this, 0.4, { scale: 0.9, ease: Bounce.easeOut });
    TweenMax.to(this, 0.2, { scale: 1, delay: 0.4 });
  });

  // Lo que uno debe hacer por salvar un html especialito.
  var parseAtributeNumber = function(index, attributeName) {
    var string = "div[" + attributeName + "='" + index + "']";
    return string;
  };

  // Story Hover Logic
  $(document).on("mouseenter", ".story-menu-link", function(e) {
    var index = $(e.target)
      .parent()
      .attr("data-event");
    var string = parseAtributeNumber(index, "data-event");
    $(string).addClass("hovered");
  });

  $(document).on("mouseleave", ".story-menu-link", function(e) {
    var index = $(e.target)
      .parent()
      .attr("data-event");
    var string = parseAtributeNumber(index, "data-event");
    $(string).removeClass("hovered");
  });

  //Info Hover Logic
  $(document).on("mouseenter", ".info-menu-link", function(e) {
    var index = $(e.target)
      .parent()
      .attr("data-info");
    var string = parseAtributeNumber(index, "data-info");
    $(string).addClass("hovered");
  });

  $(document).on("mouseleave", ".info-menu-link", function(e) {
    var index = $(e.target)
      .parent()
      .attr("data-info");
    var string = parseAtributeNumber(index, "data-info");
    $(string).removeClass("hovered");
  });

  // Talk Hover Logic
  $(document).on("mouseenter", ".talk-menu-link", function(e) {
    var index = $(e.target)
      .parent()
      .attr("data-post");
    var string = parseAtributeNumber(index, "data-post");
    $(string).addClass("hovered");
  });

  $(document).on("mouseleave", ".talk-menu-link", function(e) {
    var index = $(e.target)
      .parent()
      .attr("data-post");
    var string = parseAtributeNumber(index, "data-post");
    $(string).removeClass("hovered");
  });
}); //End of Jquery
