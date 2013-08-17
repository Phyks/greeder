$(document).ready(function() {
	// Page settings
	if($('.settingsBloc').length) {
		var hash = window.location.hash;
		if(hash.length) {
			toggleBlocks(hash);
		}
	}
});

// Fonctions liées aux boutons de navigation (lire / favori / etc.)
function toggleFolder(element, folder) {
	feedBloc = $('ul', $(element).parent());

	open = 0;
	if(feedBloc.css('display') == 'none') {
		open = 1;
	}

	feedBloc.slideToggle(200);
	$(element).html((!open ? '+' : '-'));
	$.ajax({
		url:"./action.php?action=changeFolderState",
		data:{id:folder, isopen:open}
	});
}

function addFavorite(element, id) {
	$(element).attr('onclick','removeFavorite(this,'+id+');').addClass('favorised');
	$.ajax({
		url: "./action.php?action=addFavorite",
		data:{id:id}
	});
}

function removeFavorite(element, id) {
	$(element).attr('onclick','addFavorite(this,'+id+');').removeClass('favorised');
	$.ajax({
		url: "./action.php?action=removeFavorite",
		data:{id:id}
	});
}

function renameFolder(element, folder) {
	var folderLine = $(element).parent().parent();
	var folderNameCase = $('span:first',folderLine);
	var value = folderNameCase.html();

	$(element).html('Enregistrer');
	$(element).attr('onclick','saveRenameFolder(this,'+folder+')');
	folderNameCase.replaceWith('<td><input type="text" name="folderName" value="'+value+'"/></td>');
}


function saveRenameFolder(element, folder) {
	var folderLine = $(element).parent().parent();
	var folderNameCase = $('td:first',folderLine);
	var value = $('input',folderNameCase).val();

	$(element).html('Renommer');
	$(element).attr('onclick','renameFolder(this,'+folder+')');
	folderNameCase.replaceWith('<h1>'+value+'</h1>');

	$.ajax({
		url: "./action.php?action=renameFolder",
		data:{id:folder,name:value}
	});
}

function renameFeed(element, feed) {
	var feedLine = $(element).parent().parent();
	var feedNameCase = $('td:first a',feedLine);
	var feedNameValue = feedNameCase.html();
	var feedUrlCase = $('td:first span',feedLine);
	var feedUrlValue = feedUrlCase.html();
	var url = feedNameCase.attr('href');

	$(element).html('Enregistrer');
	$(element).attr('onclick','saveRenameFeed(this,'+feed+',"'+url+'")');
	feedNameCase.replaceWith('<input type="text" name="feedName" value="'+feedNameValue+'" size="25" />');
	feedUrlCase.replaceWith('<input type="text" name="feedUrl" value="'+feedUrlValue+'" size="25" />');
}

function saveRenameFeed(element, feed, url) {
	var feedLine = $(element).parent().parent();
	var feedNameCase = $('td:first input[name="feedName"]',feedLine);
	var feedNameValue = feedNameCase.val();
	var feedUrlCase = $('td:first input[name="feedUrl"]',feedLine);
	var feedUrlValue = feedUrlCase.val();

	$(element).html('Renommer');
	$(element).attr('onclick','renameFeed(this,'+feed+')');
	feedNameCase.replaceWith('<a href="'+url+'">'+feedNameValue+'</a>');
	feedUrlCase.replaceWith('<span class="underlink">'+feedUrlValue+'</span>');

	$.ajax({
		url: "./action.php?action=renameFeed",
		data:{id:feed,name:feedNameValue,url:feedUrlValue}
	});
}

function changeFeedFolder(element, id) {
	var value = $(element).val();
	window.location = "./action.php?action=changeFeedFolder&feed="+id+"&folder="+value;
}

function readThis(element, id, from, callback = false) {
	var hide = ($('#pageTop').html() == '' ? true : false);
	var parent = $(element).parent().parent();
	var nextEvent = $('#'+id).next();

	if(!parent.hasClass('eventRead')) {
		if(hide) { 
			parent.addClass('eventRead');
			parent.fadeOut(200, function() {
				if(callback) {
					callback();
				}
			});
			parent.fadeOut(200); 
		}
		else { 
			parent.addClass('eventRead');
		}

		$.ajax({
			url: "./action.php?action=readContent",
			data:{id:id},
			success:function(msg) {
				if(msg != "") {
					alert('Erreur de lecture : '+msg);
				}
			}
		});
	}
	else {
		if(from != 'title'){
			parent.removeClass('eventRead');
			$.ajax({
				url: "./action.php?action=unreadContent",
				data:{id:id},
				success:function(msg) {
					if(msg != "") {
						alert('Erreur de lecture :'+msg);
					}
				}
			});
		}
	}
}

// Synchronisation manuelle lancée depuis le bouton du menu
function synchronize(code) {
	if(code != '') {
		$('.content').html('<article class="article">'+
				'<iframe class="importFrame" src="action.php?action=synchronize&amp;format=html&amp;code='+code+'" name="idFrameSynchro" id="idFrameSynchro" height="400"></iframe>'+
				'</article>');
	}
	else {
		alert('Vous devez être connecté pour synchroniser vos flux');
	}
}

// Disparition block et affichage block clique
function toggleBlocks(target) {
	if($(target).length) {
		$('#main section, #main article').hide();
		$('#main '+target+', #main '+target+' article').fadeToggle(200, function() {
			window.location.hash = target;
		});
	}
	else {
		window.location.hash = "";
	}
}
