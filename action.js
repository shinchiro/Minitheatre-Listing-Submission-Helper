var Information = {
    mainTitle: '',
    altTitles: '',
    typePage: '',
    typeCate: '',
    episodes: '',
    chapters: '',
    volumes: '',
    authors: '',
    serialization: '',
    airDate: '',
    producers: new Array(),
    producersL: new Array(),
    genres: new Array(),
    duration: 0,
    rating: 0,
	relatedAnime: '',
    openingSong: '',
    endingSong: '',
    link: '',
    summary: ''
};

chrome.extension.onMessage.addListener(function(signal, sender, sendResponse) {
    var respone = {
        result: false,
        data: {}
    };
    switch (signal.action) {
    case 'copy':
        if (copyMALInfo()) {
            respone.result = true;
            respone.data = Information
        } else {
            respone.result = false;
            respone.data = {}
        }
        break;
    case 'paste':
        Information = signal.data;
        if (pasteInfo()) {
            respone.result = true;
            respone.data = {};
        } else {
            respone.result = false;
            respone.data = {};
        }
        break;
    }
    sendResponse(respone);
});

function copyMALInfo() {
    var mainTitle = '';
    var typePage = '';
    var typeCate = '';
    var altTitles = '';
    var episodes = '';
    var duration = '';
    var rating = '';
    var producers = new Array();
    var producersL = new Array();
    var genres = new Array();
    var airDate = '';
    var chapters = '';
    var volumes = '';
    var authors = '';
    var serialization = '';
    var synopsis = '';
	var relatedAnimeString = '';
    var openingSong = '';
    var endingSong = '';

    if (document.location.hostname != 'myanimelist.net') {
        alert('This page is not from myanimelist.net !');
        return false;
    }

	//	if (document.location.pathname.search(/^\/(anime|manga)\/\d+\/.+$/)) {
    if (document.location.pathname.search(/^\/(anime|manga)\/\d+/)) {
        alert('This page does not contain detail information of an anime or a manga!');
        return false;
    }

    var contentWrapper = document.getElementById('contentWrapper');
    if (contentWrapper == null) {
        alert('This page does not contain detail information of an anime or a manga!');
        return false;
    }

    var _horiznavNav = document.getElementById('horiznav_nav');
    if (_horiznavNav == null) {
        alert('This page does not contain detail information of an anime or a manga!');
        return false;
    }

	//	mainTitle
    try {
        mainTitle = contentWrapper.children[0].children[1].textContent;
		typePage = 'Anime';
		typeCate = 'Anime';
    } catch (e) {
        alert('This page does not contain detail information of an anime or a manga!');
        return false;
    }


    mainTitle = mainTitle.trim();

	if (mainTitle.indexOf("(Manga)") > -1) {
		typePage = 'Manga';
		typeCate = 'Manga';
		var index = mainTitle.indexOf("(Manga)");
		mainTitle = mainTitle.substring(0, index).trim();
	}
	if (mainTitle.indexOf("(Novel)") > -1) {
		typePage = 'Manga';
		typeCate = 'Novel';
		var index = mainTitle.indexOf("(Novel)");
		mainTitle = mainTitle.substring(0, index).trim();
	}
	if (mainTitle.indexOf("(One Shot)") > -1) {
		typePage = 'Manga';
		typeCate = 'One Shot';
		var index = mainTitle.indexOf("(One Shot)");
		mainTitle = mainTitle.substring(0, index).trim();
	}
	if (mainTitle.indexOf("(Manhwa)") > -1) {
		typePage = 'Manga';
		typeCate = 'Manhwa';
		var index = mainTitle.indexOf("(Manhwa)");
		mainTitle = mainTitle.substring(0, index).trim();
	}
	if (mainTitle.indexOf("(Doujin)") > -1) {
		typePage = 'Manga';
		typeCate = 'Doujin';
		var index = mainTitle.indexOf("(Doujin)");
		mainTitle = mainTitle.substring(0, index).trim();
	}
	if (mainTitle.indexOf("(Manhua)") > -1) {
		typePage = 'Manga';
		typeCate = 'Manhua';
		var index = mainTitle.indexOf("(Manhua)");
		mainTitle = mainTitle.substring(0, index).trim();
	}
    // try {
        // if (contentWrapper.children[0].children[2].textContent == "(Manga)") {
            // typePage = 'Manga';
            // typeCate = 'Manga';
        // } else if (contentWrapper.children[0].children[2].textContent == "(Novel)") {
            // typePage = 'Manga';
            // typeCate = 'Novel';
        // } else if (contentWrapper.children[0].children[2].textContent == "(One Shot)") {
            // typePage = 'Manga';
            // typeCate = 'One Shot';
        // } else if (contentWrapper.children[0].children[2].textContent == "(Manhwa)") {
            // typePage = 'Manga';
            // typeCate = 'Manhwa';
        // } else if (contentWrapper.children[0].children[2].textContent == "(Doujin)") {
            // typePage = 'Manga';
            // typeCate = 'Doujin';
        // } else if (contentWrapper.children[0].children[2].textContent == "(Manhua)") {
            // typePage = 'Manga';
            // typeCate = 'Manhua';
        // } else {
            // alert('Not supported!');
            // return false;
        // }

    // } catch (e) {
        // typePage = 'Anime';
        // typeCate = 'TV Series';
    // }

    var _profileRows = null;
    var _leftSide = null;
    var _altTitlesHeader = null;
    var _lookAhead = null;

    try {
        _profileRows = document.getElementById('profileRows');

        _leftSide = _profileRows.parentElement;
        //if (_leftSide.tagName != 'TD') {
        //    throw "_leftSide";
        //}

		//////////////////////////////////////
		//	Parse 'Alternative Titles' section
		//////////////////////////////////////
        _altTitlesHeader = getElementHasContent('h2', 'Alternative Titles');
        if (_altTitlesHeader == null) {
            altTitles = '';
        } else {

            _lookAhead = _altTitlesHeader.nextElementSibling;

            while (_lookAhead.textContent != 'Information') {
                if (_lookAhead.firstChild != null) {
                    if (altTitles != '') {
                        altTitles += ', ';
                    }
					altTitles += _lookAhead.textContent.trim();
                }
                _lookAhead = _lookAhead.nextElementSibling;
            }
        }

		///////////////////////////////
		//	Parse 'Information' section
		///////////////////////////////
		
        _lookAhead = getElementHasContent('h2', 'Information').nextElementSibling;
        
		while (_lookAhead.nodeName != 'H2') {
			//	the next 'Statistics' is H2 node, so lets have fun to iterate before reach the node
			if (_lookAhead.nodeName != 'DIV') {
				_lookAhead = _lookAhead.nextElementSibling;
				continue;
			}
			//	first children is always a label (dark_text)
            switch (_lookAhead.children[0].textContent.trim()) {
                case 'Type:':
                    typeCate = _lookAhead.children[0].nextElementSibling.textContent.trim().replace(/\s\s/g, ' ');
                    break;
                case 'Episodes:':
                    episodes = _lookAhead.children[0].nextSibling.textContent.trim().replace(/\s\s/g, ' ');
                    break;
                case 'Aired:':
                    airDate = _lookAhead.children[0].nextSibling.textContent.trim().replace(/\s\s/g, ' ');
                    break;
                case 'Duration:':
                    duration = _lookAhead.children[0].nextSibling.textContent.trim().replace(/\s\s/g, ' ');
                    break;
                case 'Rating:':
                    rating = _lookAhead.children[0].nextSibling.textContent.trim().replace(/\s\s/g, ' ');
                    break;
                case 'Volumes:':
                    volumes = _lookAhead.children[0].nextSibling.textContent.trim().replace(/\s\s/g, ' ');
                    break;
                case 'Chapters:':
                    chapters = _lookAhead.children[0].nextSibling.textContent.trim().replace(/\s\s/g, ' ');
					break;
                case 'Published:':
                    airDate = _lookAhead.children[0].nextSibling.textContent.trim().replace(/\s\s/g, ' ');
                    break;
				//	Because Author and Serialization has hyperlinks
                case 'Authors:':
                    {
						var c = 0;
                        for (var i = 1; i < _lookAhead.children.length; i++) {							
							authors += _lookAhead.children[i].textContent.trim();
							c++;
							if (c < _lookAhead.children.length-1) {
								authors += ', ';
							}
                        }
                        break;
					}
                case 'Serialization:':
                    {
						var c = 0;
                        for (var i = 1; i < _lookAhead.children.length; i++) {							
							serialization += _lookAhead.children[i].textContent.trim() + ' ';
							c++;
							if (c < _lookAhead.children.length-1) {
								serialization += ', ';
							}
                        }
                        break;
					}
                case 'Producers:':
                    {
                        var c = 0;
                        var lc = 0;
                        for (var i = 1; i < _lookAhead.children.length; i++) {
                            if (_lookAhead.children[i].nodeName == 'A') {
                                producers[c] = _lookAhead.children[i].textContent.trim();
                                c++;
                            } else {
                                producersL[lc] = producers[c - 1];
                                lc++;
                            }
                        }
                        break;
                    }
                case 'Studios:':
                    {
                        var c = 0;
                        var lc = 0;
                        for (var i = 1; i < _lookAhead.children.length; i++) {
                            if (_lookAhead.children[i].nodeName == 'A') {
                                producers[c] = _lookAhead.children[i].textContent.trim();
                                c++;
                            } else {
                                producersL[lc] = producers[c - 1];
                                lc++;
                            }
                        }
                        break;
                    }
                case 'Genres:':
                    {
                        var c = 0;
                        for (var i = 1; i < _lookAhead.children.length; i++) {							
							genres[c] = _lookAhead.children[i].textContent.trim();
							c++;
                        }
                        break;
                    }
                }
            _lookAhead = _lookAhead.nextElementSibling;
        }

		////////////////////////////
		//	Parse 'Synopsis' section
		////////////////////////////
		
        var _synopsisHeader = getElementHasContent('h2', 'EditSynopsis');

        if (_synopsisHeader == null) {
            alert('Please choose tab "Details" to be able to get the Synopsis');
            return false;
        }

		_lookAhead = _synopsisHeader.nextSibling;
		for (i = 0; i < _lookAhead.childNodes.length; i++)
		{
			if (_lookAhead.childNodes[i].nodeName == '#text') {
				synopsis += _lookAhead.childNodes[i].textContent;
			}
			if (_lookAhead.childNodes[i].nodeName == 'BR') {
				synopsis += '<br />';
			}
			if (_lookAhead.childNodes[i].nodeName == 'I') {
				synopsis += '<i>' + _lookAhead.childNodes[i].textContent + '</i>';
			}
		}

		/////////////////////////////////
		//	Parse 'Related Anime' section
		/////////////////////////////////

		var _relatedAnime = getElementHasContent('h2', 'EditRelated Anime');
		if (_relatedAnime != null)
		{
			relatedAnimeString += '<b>Related Anime</b>' + '<br />';
			_lookAhead = _relatedAnime.nextSibling;
			while (_lookAhead.nodeName != 'H2'){
				
				//	now all related anime info in table
				if (_lookAhead.nodeName == 'TABLE'){
					var rows = _lookAhead.childNodes[0];
					//	each related anime info. Ex. adaptation, prequel
					for (i = 0; i < rows.childNodes.length; i++){
						var related_row = rows.childNodes[i];
						var related_label = related_row.childNodes[0].textContent + ' ';						
						var related_link = related_row.childNodes[1].innerHTML.replace(/\">/g, '\" target=\"_blank\">').replace(/href=\"/g,'href=\"http://myanimelist.net').trim();
						relatedAnimeString += related_label + related_link + '<br />';
					}
				}
				if (_lookAhead.nodeName == 'BR'){
					relatedAnimeString += '<br />';
				}
				_lookAhead = _lookAhead.nextSibling;	
			}
		
		}

		////////////////////////////////////////
        //	Parse 'Opening' section
		////////////////////////////////////////
		
		if (typePage == 'Anime') {

            var _OPHeader = getElementHasContent('h2', 'Edit Opening Theme');
            if (_OPHeader == null) {
                throw "_OPHeader";
            }

            _lookAhead = _OPHeader.nextSibling;
            c = 0;
            while (_lookAhead != null && _lookAhead.nodeName != 'H2') {
				
				if (_lookAhead.nodeName == 'DIV' && _lookAhead.textContent != '.') {
					var tempstr = '';
					if (_lookAhead.textContent.indexOf('No opening themes') == 0) {
						//return 0 if the keyword found
						tempstr += '';
					} else {
						tempstr += _lookAhead.textContent.trim();
					}
					if ((tempstr != '') && (tempstr != 'more') && (tempstr != 'less') && (tempstr.length > 1)) {
						if (c != 0) {
							openingSong += String.fromCharCode(10);
						}
						openingSong += tempstr;
					}
					c++;
				}
				_lookAhead = _lookAhead.nextSibling;
            }
			
			////////////////////////////////////////
			//	Parse 'Ending' section
			////////////////////////////////////////
            var _EDHeader = getElementHasContent('h2', 'Edit Ending Theme');
            if (_EDHeader == null) {
                throw "_EDHeader";
            }
			
            _lookAhead = _EDHeader.nextSibling;
            c = 0;
            while (_lookAhead != null && _lookAhead.nodeName != 'H2') {
				
				if (_lookAhead.nodeName == 'DIV' && _lookAhead.textContent != '.') {
					var tempstr = '';
					if (_lookAhead.textContent.indexOf('No ending themes') == 0) {
						//return 0 if the keyword found
						tempstr += '';					
					} else {
						tempstr += _lookAhead.textContent.trim();
					}
					if ((tempstr != '') && (tempstr != 'more') && (tempstr != 'less') && (tempstr.length > 1)) {
						if (c != 0) {
							endingSong += String.fromCharCode(10);
						}
						endingSong += tempstr;
					}
					c++;
				}
				_lookAhead = _lookAhead.nextSibling;
            }
        }
    } catch (e) {
        alert('Error while trying to extract information\nIf the page is loading, you should wait until it load completed and try to copy again\nThis also happen when MAL change the layout, code...\nOtherwise If you think this is a bug, please report to me\nErrorMessage:  ' + e.message);
        return false;
    }

    if (volumes == 'Unknown') {
        volumes = '';
    }

    if (episodes == 'Unknown') {
        episodes = '';
    }

    if (chapters == 'Unknown') {
        chapters = '';
    }

    var tempArray = airDate.split(' to ');
    var tempStr = tempArray[0];
    tempArray = tempStr.split(' ');
    if ((tempArray[0] == 'Not') || (tempArray[0] == '?')) {
        tempStr = '1 1 1900';
    } else if (tempArray.length == 2) {
        tempStr = '1 ' + tempStr;
    } else if (tempArray.length == 1) {
        tempStr = '1 1 ' + tempStr;
    }
    tempStr = tempStr.replace(',', '');

    try {
        var tempDate = new Date(tempStr);
        airDate = tempDate.getFullYear() + '-';
        if (tempDate.getMonth() + 1 < 10) {
            airDate += '0';
        }
        airDate += tempDate.getMonth() + 1 + '-';
        if (tempDate.getDate() < 10) {
            airDate += '0';
        }
        airDate += tempDate.getDate();
    } catch (e) {
        airDate = '';
    }


    if (typePage == 'Anime') {
        duration = duration.replace(' per ep.', '');
        tempArray = duration.split(' ');
        var _hour = 0;
        var _min = 0;
        try {
            if (tempArray.length == 2) {
                if (tempArray[1] == 'hr.') {
                    _hour = parseInt(tempArray[0]);
                }
                if (tempArray[1] == 'min.') {
                    _min = parseInt(tempArray[0]);
                }
            }
            if (tempArray.length == 4) {
                if ((tempArray[1] == 'hr.') && (tempArray[3] == 'min.')) {
                    _hour = parseInt(tempArray[0]);
                    _min = parseInt(tempArray[2]);
                }
            }
        } catch (e) {
            _hour = 0;
            _min = 0;
        }
        duration = (_hour * 60) + _min;

        switch (rating) {
        case 'G - All Ages':
            rating = '1';
            break;
        case 'PG - Childrens':
            rating = '2';
            break;
        case 'PG-13 - Teens 13 or older':
            rating = '3';
            break;
        case 'R - 17+ (violence & profanity)':
            rating = '4';
            break;
        case 'R+ - Mild Nudity':
            rating = '5';
            break;
        case 'Rx - Hentai':
            rating = '6';
            break;
        default:
            rating = '0';
        }
    }
    Information.mainTitle = mainTitle;
    Information.altTitles = altTitles;
    Information.typePage = typePage;
    Information.typeCate = typeCate;
    Information.pastable = true;
    Information.producers = producers;
    Information.producersL = producersL;
    Information.genres = genres;
    Information.episodes = episodes;
    Information.volumes = volumes;
    Information.chapters = chapters;
    Information.authors = authors;
    Information.duration = duration;
    Information.rating = rating;
    Information.serialization = serialization;
    Information.airDate = airDate;
    Information.link = document.location.toString();
    Information.openingSong = openingSong;
    Information.endingSong = endingSong;
    Information.summary = synopsis;
	Information.relatedAnime = relatedAnimeString;
    return true;
}

function pasteInfo() {

    if (document.location.hostname != 'minitheatre.org') {
        alert('This page is not from minitheatre.org !');
        return false;
    }

    if (document.location.pathname.search(/^(\/anime\/submit.html)|(\/manga\/submit-manga.html)|(\/component\/jreviews\/listings\/edit\/id:.+)$/) < 0) {
        alert('This page is not submission/editing page for anime or manga!');
        return false;
    }


    try {
        var pageSect = '';
        var section_id = document.getElementById('section_id');
        var cat_id = document.getElementById('cat_id');
        var jr_volumes = document.getElementById('jr_volumes');
        var jr_episodes = document.getElementById('jr_episodes');
        var introtext_ifr = document.getElementById('introtext_ifr');

        if (document.location.pathname.search(/^\/component\/jreviews\/listings\/edit\/id:.+$/) == -1) {
            if ((section_id.selectedIndex == 0) || (cat_id.selectedIndex == 0)) {
                alert('Please select section and category for the listing');
                return false;
            }
        }

        if (jr_volumes != null) {
            pageSect = 'Manga';
        } else if (jr_episodes != null) {
            pageSect = 'Anime';
        } else {
            alert('Only support anime or manga listing!');
            return false;
        }




        if (Information.typePage != pageSect) {
            alert("You're trying to submit/edit a/an " + pageSect + " listing, but the copied information is belong to a/an " + Information.typePage);
            return false;
        }

        //Main Title
        var title = document.getElementById('title');
        if (title != null) {
            title.value = Information.mainTitle + ' (1280x720) (Sub)';
        }

        //Anime Sect
        if (pageSect == 'Anime') {

            var jr_titles = document.getElementById('jr_titles');

            var jr_aired = document.getElementById('jr_aired');
            var jr_producers = document.getElementById('jr_producers');
            var jr_duration = document.getElementById('jr_duration');
            var jr_agerate = document.getElementById('jr_agerate');
            var jr_malprofile = document.getElementById('jr_malprofile');
            var jr_openingthemes = document.getElementById('jr_openingthemes');
            var jr_endingtheme = document.getElementById('jr_endingtheme');
            var jr_company = document.getElementById('jr_company');
			

            //Alt Titles
            if (jr_titles != null) {
                jr_titles.value = Information.altTitles;
            }

            //Type
            autoSelectType('jr_fieldOption', Information.typeCate, 'tv', 'music');

            //Epispdes
            jr_episodes.value = Information.episodes;

            //Aired
            if (jr_aired != null) {
                jr_aired.value = Information.airDate;
            }

            //producers
            if (jr_producers != null) {
                selectWithArray(jr_producers, Information.producers);
            }

            //geners
            autoSelectGenres('jr_fieldOption', Information.genres, 'action', 'yuri');

            if (jr_duration != null) {
                jr_duration.value = Information.duration;
            }

            if (jr_agerate != null) {
                jr_agerate.selectedIndex = Information.rating;
            }

            if (jr_malprofile != null) {
                jr_malprofile.value = Information.link;
            }

            if (jr_openingthemes != null) {
                jr_openingthemes.value = Information.openingSong;
            }

            if (jr_endingtheme != null) {
                jr_endingtheme.value = Information.endingSong;
            }

            if (jr_company != null) {
                selectWithArray(jr_company, Information.producersL);
            }

            if (introtext_ifr != null) {
                introtext_ifr.contentDocument.body.innerHTML = '<p>' + Information.summary + '</p>' + Information.relatedAnime + '<hr />';
            }

			//	Auto-Fill encodes information
			document.getElementById('jr_type_X264-MKV').checked = true;	
			document.getElementById('jr_audio_Japanese').checked = true;
			document.getElementById('jr_subs_English').checked = true;
			if (document.getElementById('jr_size').value == ''){
				document.getElementById('jr_size').value = 'Unknown';
			}
			document.getElementById('jr_hosts_Other').checked = true;
			document.getElementById('jr_encoder').value += document.getElementsByClassName('register-switch')[0].textContent.substring(3);
			document.getElementById('jr_status').options[2].selected = true;
			
        } //End Anime
        //Manga Sect
        else {

            var jr_mantitles = document.getElementById('jr_mantitles');

            var jr_chapters = document.getElementById('jr_chapters');
            var jr_published = document.getElementById('jr_published');
            var jr_authors = document.getElementById('jr_authors');
            var jr_serialization = document.getElementById('jr_serialization');
            var jr_malmanga = document.getElementById('jr_malmanga');

            //Alt Titles
            if (jr_mantitles != null) {
                jr_mantitles.value = Information.altTitles;
            }

            //Type
            autoSelectType('jr_fieldOption', Information.typeCate, 'manga', 'doujin');

            //Vol
            if (jr_volumes != null) {
                jr_volumes.value = Information.volumes;
            }

            //chapters
            if (jr_chapters != null) {
                jr_chapters.value = Information.chapters;
            }

            //Pub
            if (jr_published != null) {
                jr_published.value = Information.airDate;
            }

            //genre
            autoSelectGenres('jr_fieldOption', Information.genres, 'action', 'yuri');

            //auth
            if (jr_authors != null) {
                jr_authors.value = Information.authors;
            }

            //ser
            if (jr_serialization != null) {
                selectWithStr(jr_serialization, Information.serialization);
            }

            //limk
            if (jr_malmanga != null) {
                jr_malmanga.value = Information.link;
            }

            if (introtext_ifr != null) {
                introtext_ifr.contentDocument.body.innerHTML = '<p>' + Information.summary + '</p>';
            }

        } //end manga

    } catch (e) {
        alert('A error occurs when filling information');
        return false;
    }

    return true;
}

function getElementHasContent(tag, str) {
    var collect = document.getElementsByTagName(tag);
    for (var i = 0; i < collect.length; i++) {
        if (collect[i].innerText == str) {
            return collect[i];
        }
    }
    return null;
}

function selectWithArray(listObj, Arr) {
    try {
        for (var i = 0; i < listObj.options.length; i++) {
            if (Arr.indexOf(listObj.options[i].text) != -1) {
                listObj.options[i].selected = true;
            } else {
                listObj.options[i].selected = false;
            }
        }
    } catch (e) {

    }
}

function selectWithStr(listObj, str) {
    try {
        for (var i = 0; i < listObj.options.length; i++) {
            if (listObj.options[i].text.toLowerCase().trim() == str.toLowerCase().trim()) {
                listObj.options[i].selected = true;
            } else {
                listObj.options[i].selected = false;
            }
        }
    } catch (e) {

    }
}

function autoSelectType(clsName, str, start, end) {
    try {
        var collect = document.getElementsByClassName(clsName);
        var begin = false;
        var stop = false;
        for (var i = 0; i < collect.length; i++) {

            if (stop) {
                return;
            }

            a = str.replace(/\s/g, '').replace('-', '').toLowerCase().trim();
            b = collect[i].textContent.replace('\xA0', '').replace(/\s/g, '').replace(/-/g, '').toLowerCase().trim();

            if (b == start) {
                begin = true;
            }

            if (b == end) {
                stop = true;
            }

            if (!begin) {
                continue;
            }


            if (a == b) {
                collect[i].firstChild.checked = true;
            } else {
                collect[i].firstChild.checked = false;
            }
        }
    } catch (e) {

    }
}

function autoSelectGenres(clsName, arr, start, end) {
    try {
        var collect = document.getElementsByClassName(clsName);
        var begin = false;
        var stop = false;
        for (var i = 0; i < collect.length; i++)
        for (var j = 0; j < arr.length; j++) {

            if (stop) {
                return;
            }

            a = arr[j].replace(/\s/g, '').replace('-', '').toLowerCase().trim();
            b = collect[i].textContent.replace('\xA0', '').replace(/\s/g, '').replace(/-/g, '').toLowerCase().trim();

            if (b == start) {
                begin = true;
            }

            if (b == end) {
                stop = true;
            }

            if (!begin) {
                continue;
            }

            if (a == b) {
                collect[i].firstChild.checked = true;
                break;
            } else {
                collect[i].firstChild.checked = false;
            }
        }

    } catch (e) {

    }
}