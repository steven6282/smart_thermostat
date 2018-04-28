// JavaScript Document
MAIN = ( function() {
	var weatherInterval;
	var temperatureInterval;
	var timeInterval;
	var pulseInterval;
	
	/*var parseCondition = function( condition ) {
		
	}*/
	var pulse = function() {
		updateDateTime();

		var oldMode = MAIN.mode;

		if ( MAIN.primaryTemp > MAIN.coolingTemp ) {
			MAIN.mode = 'cooling';
			DISPLAY.tempSetting.text = MAIN.coolingTemp + '&deg;';
		} else if ( MAIN.primaryTemp < MAIN.heatingTemp ) {
			MAIN.mode = 'heating';
			DISPLAY.tempSetting.text = MAIN.heatingTemp + '&deg;';
		} else {
			MAIN.mode = 'idle';
		}

		if ( MAIN.mode != oldMode ) {
			DISPLAY.mode.css( 'background-image', 'url("/thermostat_icons/null.png");')
			AJAX.makeRequest( '/thermostat/' + oldMode + '?mode=OFF', {} );
			if ( MAIN.mode != 'idle' ) {
				AJAX.makeRequest( '/thermostat/' + MAIN.mode + '?mode=ON', {},
					function( retData ) {
						DISPLAY.mode.css( 'background-image', 'url("/thermostat_icons/' + MAIN.mode + '.png");')
					},
					function( errorThrown ) {
						alert( errorThrown );
					} 
				);
			}
		}
	}

	var requestTemperature = function() {
		AJAX.makeRequest( 'http://' + MAIN.server + '/thermostat/', {},
			function( retData ) {
				console.log( 'New temperature reading ' + retData );
				DISPLAY.primaryTemp.html( Math.round( retData ) );
				MAIN.primaryTemp = retData;
			},
			function( errorThrown ) {
				
			}
		);
	}
	
	var requestWeather = function() {
		AJAX.makeRequest( 'http://' + MAIN.server + '/wunderground/data', { dataType: 'json', processData: 'true', contentType: 'application/json;charset=UTF-8' },
			function( retData ) {
				console.log( retData );
				var condition = { value: retData.condition, name: 'unknown', modifier: '2', night_modifier: '' };
				if ( condition.value.indexOf( 'Light' ) >= 0 ) {
					condition.modifier = '1';
				} else if ( condition.value.indexOf( 'Heavy' ) >= 0 ) {
					condition.modifier = '3';
				}
				var d = new Date();
				if ( d.getHours() > parseInt( retData.sunset.hour ) || d.getHours() < parseInt( retData.sunrise.hour )
						|| ( d.getHours() == parseInt( retData.sunset.hour ) && d.getMinutes() > parseInt( retData.sunset.minute ) )
						|| ( d.getHours() == parseInt( retData.sunrise.hour ) && d.getMinutes() < parseInt( retData.sunrise.minute ) ) ) {
					condition.night_modifier = '_night';
				}
				if ( condition.value.indexOf( 'Rain' ) >= 0 ) {
					condition.name = 'shower';
					if ( parseInt( retData.pop ) >= 50 ) {
						condition.modifier = 3;
					}
					if ( condition.modifier == '3' ) condition.night_modifier = '';
				} else if ( condition.value.indexOf( 'Drizzle' ) >= 0 ) {
					condition.modifier = '1';
					condition.name = 'shower';
				} else if ( condition.value.indexOf( 'Snow' ) >= 0 ) {
					condition.name = 'snow';
					if ( condidition.modifier == '3' ) {
						condition.modifier = '5';
						condition.night_modifier = '';
					} else if ( condition.modifier = '2' ) {
						condition.modifier = '3';
					}
				} else if ( condition.value.indexOf( 'Ice' ) >= 0 ) {
					condition.name = 'sleet';
					condition.modifier = '';
					condition.night_modifier = '';
				} else if ( condition.value.indexOf( 'Hail' ) >= 0 ) {
					condition.name = 'hail';
					condition.modifier = '';
					condition.night_modifier = '';
				} else if ( condition.value.indexOf( 'Thunderstorm' ) >= 0 ) {
					condition.name='tstorm';
					if ( condition.modifier == '3' ) condition.night_modifier = '';
				} else if ( condition.value.indexOf( 'Fog' ) >= 0 ) {
					condition.modifier = '';
					condition.name = 'fog';
				} else if ( condition.value == 'Overcast' ) {
					condition.name = 'overcast';
					condition.modifier = '';
					condition.night_modifier = '';
				} else if ( condition.value == 'Clear' ) {
					condition.name = 'sunny';
					condition.modifier = '';
				} else if ( condition.value == 'Partly Cloudy' ) {
					condition.name = 'cloudy';
					condition.modifier = '2';
				} else if ( condition.value == 'Mostly Cloudy' ) {
					condition.name = 'cloudy';
					condition.modifier = '4';
				} else if ( condition.value == 'Scattered Clouds' ) {
					condition.name = 'cloudy';
					condition.modifier = '1';
				} else if ( condition.value.indexOf( 'Clear' ) ) {
					condition.name = 'sunny';
					condition.modifier = '';
				}
				DISPLAY.weatherIcon.css( {
						'background-image': 'url("/images/weather/' + condition.name + condition.modifier + condition.night_modifier + '.png")',
						'background-repeat': 'no-repeat',
						'background-size': 'auto 100%',
						'background-position': 'center center'
				} );
				DISPLAY.outsideTemp.html( Math.round( retData.curr_temp ) );
				DISPLAY.outsideHumidity.text( retData.humidity + ' Humidity' );
				DISPLAY.outsideHiTemp.html( retData.high );
				DISPLAY.outsideLowTemp.html( retData.low );
				DISPLAY.outsidePrecipitation.text( retData.pop + '% Rain' );
				
				/*
				DISPLAY.weatherIcon.css( {
						'background-image': 'url("http://' + MAIN.server + '/test_site/images/weather/' + 'snow5' + '.png")',
						'background-repeat': 'no-repeat',
						'background-size': 'auto 100%',
						'background-position': 'center'
				} );
				DISPLAY.outsideTemp.html( '115' );
				DISPLAY.outsideHumidity.text( '125% Humidity' );
				DISPLAY.outsideHiTemp.html( '115' );
				DISPLAY.outsideLowTemp.html( '115' );
				DISPLAY.outsidePrecipitation.text( '100% Rain' );
				*/
			},
			function( errorThrown ) {

			}
		);
	}
	
	var updateDateTime = function() {
		var d = new Date();
		var monthDate = d.getDate();
		var timeString = d.toLocaleTimeString( "en-us", { hour12: true, hour: "numeric", minute: "2-digit" } );
		var dateString = d.toLocaleDateString( "en-us", { weekday: "long", month: "long", day: "numeric" } );
		if ( [ 1, 21, 31 ].indexOf( monthDate ) >= 0 ) {
			dateString += 'st';
		} else if ( [ 2, 22 ].indexOf( monthDate ) >= 0 ) {
			dateString += 'nd';
		} else if ( [ 3, 23 ].indexOf( monthDate ) >= 0 ) {
			dateString += 'rd';
		} else {
			dateString += 'th';
		}
		
		//dateString = 'Wednesday, September 27th';
		DISPLAY.date.text( dateString );
		DISPLAY.time.text( timeString );
	}
	
	return {
		coolingTemp: 75,
		heatingTemp: 65,
		mode: '',
		primaryTemp: 0,
		requestTemperature: requestTemperature,
		requestWeather: requestWeather,
		server: '127.0.0.1',
		init: function() {
			AJAX.init();
			DISPLAY.init();
			
			/* INFO UPDATES */
			requestTemperature();
			requestWeather();
			pulse();
			//updateDateTime();
			temperatureInterval = setInterval( requestTemperature, 30000 );
			weatherInterval = setInterval( requestWeather, 750000 );
			//timeInterval = setInterval( updateDateTime, 10000 );
			pulseInterval = setInterval( pulse, 30000 );

			
			/* HANDLERS */
			//$( '#primaryTemperature' ).on( 'click', handleClick );
			$( '#main' ).on( 'click', function() {
				//This causes an error on anything other than the pi display, but prevents clicks on other devices from waking the screen
				AJAX.makeRequest( 'http://' + '127.0.0.1' + '/thermostat/screen', 'brightness=255' );
			} );
		}
	}
} )();

DISPLAY = ( function() {
	
	return {
		date: $( '<div>' ),
		mode: $( '<div>' ),
		primaryTemp: $( '<div>' ),
		outsideHiTemp: $( '<div>' ),
		outsideHumidity: $( '<div>' ),
		outsideLowTemp: $( '<div>' ),
		outsidePrecipitation: $( '<div>' ),
		outsideTemp: $( '<div>' ),
		tempSetting: $( '<div>' ),
		time: $( '<div>' ),
		weatherIcon: $( '<div>' ),
		init: function() {
			this.date = $( '#date' );
			this.mode = $( '#modeIcon' );
			this.primaryTemp = $( '#primaryTemperature' );
			this.outsideHiTemp = $( '#hiTemp' );
			this.outsideHumidity = $( '#humidity' );
			this.outsideLowTemp = $( '#lowTemp' );
			this.outsidePrecipitation = $( '#precipitation' );
			this.outsideTemp = $( '#outsideTemperature' );
			this.tempSetting = $( '#tempSetting' );
			this.time = $( '#time' );
			this.weatherIcon = $( '#weatherIcon' );
		}
	}
} )();

AJAX = ( function() {
	var LoaderIcon = function () {
		this.parent=undefined;
		this.div={
			classInfo: undefined,
			height: undefined,
			width: undefined,
			style: undefined
		};
		this.img={
			classInfo: undefined,
			src: "images/ajax-loader.gif",
			height: undefined,
			width: undefined,
			style: undefined
		};
	}

	var makeAjaxRequest = function ( url,parameters,successCallback,errorCallback,alwaysCallback,asyncParam ) {
		if ( typeof parameters === "undefined" ) parameters = "";
		if ( typeof asyncParam === "undefined" ) asyncParam = true;
	
		var urlParams = parameters;
		var additionalData = {};
		var loaderIcon = "images/ajax-loader.gif";
		if ( parameters instanceof Object ) {
			urlParams = ( parameters.hasOwnProperty( "urlParams" ) ? parameters.urlParams : "" );
			additionalData = parameters;
			if ( typeof additionalData.loaderIcon !== "undefined" ) {
				if (typeof additionalData.loaderIcon.parent !== "undefined" ) {
					if ( !( additionalData.loaderIcon.parent instanceof jQuery ) ) {
						if ( typeof additionalData.loaderIcon.parent === "string" ) 
							additionalData.loaderIcon.parent=$( '#' + additionalData.loaderIcon.parent );
						else
							additionalData.loaderIcon.parent=$( '#' + additionalData.loaderIcon.parent.id );
					}
				}
				if ( typeof additionalData.loaderIcon.parentEmpty === 'undefined' ) additionalData.loaderIcon.parentEmpty = false;
				if ( typeof additionalData.loaderIcon.fadeOut === 'undefined' ) additionalData.loaderIcon.fadeOut = 0;
				$loaderIconObject=$( '<div id="loaderIconDiv" ' +
										( typeof additionalData.loaderIcon.div !== "undefined" ?
											( typeof additionalData.loaderIcon.div.classInfo !== "undefined" ? 'class="' + additionalData.loaderIcon.div.classInfo + '" ' : '' ) +
											( typeof additionalData.loaderIcon.div.height !== "undefined" ? 'height="' + additionalData.loaderIcon.div.height + '" ' : '' ) +
											( typeof additionalData.loaderIcon.div.width !== "undefined" ? 'width="' + additionalData.loaderIcon.div.width + '" ' : '' ) +
											( typeof additionalData.loaderIcon.div.style !== "undefined" ? 'style="' + additionalData.loaderIcon.div.style + '" ' : '' )
										: "" ) +
									'>' );
									
				$loaderIconObject.append(
									$( '<img id="loaderIconImg" ' + 
										( typeof additionalData.loaderIcon.img !== "undefined" ?
											( typeof additionalData.loaderIcon.img.classInfo !== "undefined" ? 'class="' + additionalData.loaderIcon.img.classInfo + '" ' : '' ) + 			
											( typeof additionalData.loaderIcon.img.src !== "undefined" ? 'src="' + additionalData.loaderIcon.img.src + '" ' : 'src="' + loaderIcon + '" ' ) + 
											( typeof additionalData.loaderIcon.img.height !== "undefined" ? 'height="' + additionalData.loaderIcon.img.height + '" ' : '' ) + 
											( typeof additionalData.loaderIcon.img.width !== "undefined" ? 'width="' + additionalData.loaderIcon.img.width + '" ' : '' ) +
											( typeof additionalData.loaderIcon.img.style !== "undefined" ? 'style="' + additionalData.loaderIcon.img.style + '" ' : '' )
										: 'src="' + loaderIcon + '" ' ) +
									'>' ));
				if (typeof additionalData.loaderIcon.parent !== "undefined" ) {
					if ( additionalData.loaderIcon.parentEmpty ) {
						additionalData.loaderIcon.parent.empty().append( $loaderIconObject );
					} else {
						additionalData.loaderIcon.parent.append( $loaderIconObject );
					}
				}
				additionalData.loaderIcon.obj=$loaderIconObject;
			}
		}
		if ( typeof additionalData.dataType === "undefined" ) additionalData.dataType="html";
		if ( typeof additionalData.data === "undefined" ) additionalData.data={};
		if ( typeof additionalData.type === "undefined" ) additionalData.type='GET';
		if ( typeof additionalData.contentType === "undefined" ) additionalData.contentType='application/x-www-form-urlencoded; charset=UTF-8';
		if ( typeof additionalData.processData === "undefined" ) additionalData.processData=true;
		if ( typeof additionalData.timeout === "undefined" ) additionalData.timeout=30000;
		
		var ret=$.ajax({
			type: additionalData.type,
			url: url + ( urlParams != "" ? "?" + urlParams : "" ),
			async: asyncParam,
			data: additionalData.data,
			timeout: additionalData.timeout,
			cache: false,
			dataType: additionalData.dataType,
			processData: additionalData.processData,
			contentType: additionalData.contentType,
			complete: function( jqXHR,textStatus ) { ajaxAlways( jqXHR,textStatus,alwaysCallback,additionalData ); },
			success: function( retData,textStatus,jqXHR ) { ajaxRequestSuccess( retData,textStatus,jqXHR,successCallback,additionalData ); },
			error: function( jqXHR,textStatus,errorThrown ) { ajaxRequestError( jqXHR,textStatus,errorThrown,errorCallback,additionalData ); }	
		});
		
		return ret;
	}
	
	var makeRequest = function( url,parameters,successCallback,errorCallback,alwaysCallback,asyncParam ) {
		return makeAjaxRequest( url, parameters,
							function( retData,textStatus,jqXHR,additionalData ) { //Success
								additionalData.requestData = {};
								additionalData.requestData.textStatus = textStatus;
								additionalData.requestData.jqXHR = jqXHR;
								if ( typeof successCallback === "function" ) successCallback( retData, additionalData );
							},
							function( jqXHR,textStatus,errorThrown,additionalData ) { //Fail
								additionalData.requestData = {};
								additionalData.requestData.textStatus = textStatus;
								additionalData.requestData.jqXHR = jqXHR;
								if ( typeof errorCallback === "function" ) errorCallback( errorThrown, additionalData );
							},
							function( jqXHR,textStatus,additionalData ) { //Always
								var additionalData = {}
								additionalData.requestData = {};
								additionalData.requestData.textStatus = textStatus;
								additionalData.requestData.jqXHR = jqXHR;
								if ( typeof alwaysCallback === "function" ) alwaysCallback( additionalData );
							},
							asyncParam
						);
	}
	
	function ajaxRequestSuccess( retData,textStatus,jqXHR,privateCallback,additionalData ) {
		//Global success handler if we wanted to add anything that always happened on a successful ajax request (for example a global loader icon or something like that)
		if ( typeof privateCallback === "function" ) privateCallback( retData,textStatus,jqXHR,additionalData );
	}
	
	function ajaxRequestError( jqXHR,textStatus,errorThrown,privateCallback,additionalData ) {
		//Global error handler if we wanted to add anything that always happened on an error in an ajax request (for example a global loader icon or something like that)	
		if ( typeof privateCallback === "function" && textStatus != 'abort' ) privateCallback( jqXHR,textStatus,errorThrown,additionalData );
	}
	
	function ajaxAlways( jqXHR,textStatus,privateCallback,additionalData ) {
		if ( typeof additionalData.loaderIcon !== 'undefined' ) {
			additionalData.loaderIcon.obj.fadeOut( additionalData.loaderIcon.fadeOut, function() { additionalData.loaderIcon.obj.remove(); } );
		}
		if ( typeof privateCallback === "function" ) privateCallback( jqXHR,textStatus );
	}
	
	return {
		makeRequest: makeRequest,
		init: function() {
		}
	}
} )(); 

$( function() {
	MAIN.init();
} );
