<!DOCTYPE html>
<?PHP
	date_default_timezone_set( 'EST' );
?>
<html>
	<head>
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<title>Thermostat</title>
		<link type="text/css" rel="stylesheet" href="./styles/main.css">
		<script src="./scripts/jquery.js"></script>
		<script src="./scripts/modules.js"></script>
	</head>
	
	<script>
		MAIN.server = '<?PHP echo $_SERVER['SERVER_ADDR']; ?>';
	</script>
	
	<body style="padding: 0; margin: 0;">
		<div id="main" style="float: left; height: 480px; width: 800px; background-color: #444; background: linear-gradient( to bottom right, #333, #666 ); color: #ddd;">
			<div class="row" id="top-row" style="float: left; margin-left: 7%; margin-top: 15px; width: 86%; font-size: 38px;">
				<div id="top" style="float: left; width: 95%; margin-left: 2.5%; margin-bottom: 5px;">
					<div id="date" style="float: right; font-size: 32px; line-height: 42px;">
						<?PHP print date( 'l, F jS' ); ?>
					</div>
					<div id="time" style="float: left;">
						<?PHP print date( 'g:i A' ); ?>
					</div>
				</div>
			</div>
			<div class="row" id="top-row-border" style="float: left; margin-left: 7%; width: 86%; height: 2px; background-color: #ddd; box-shadow: 0px 3px 14px 1px rgba(225,225,225,0.35);">
			</div>
			<div class="row" id="middle-row" style="float: left; width: 100%; text-align: center; height: 330px;">
				<div id="weather" style="float: left; width: 50%; height: 405px; text-align: center;">
					<div id="weatherTop" style="float: left; width: 100%; height: 35px;">
					</div>
					<div id="weatherIcon" style="float: left; width: 70%; margin-left: 15%;; height: 220px;">
					</div>
					<div id="weatherInfo" style="float: left; width: 100%;">
						<div id="weatherDetails" style="float: right; margin-left: 10px; max-width: 45%; overflow: hidden;">
							<div class="weather-row" style="float: left; width: 100%;">
								<div id="weatherHi" style="float: left; color: #E55E1A;">
									Hi <span id="hiTemp">--</span><span>&deg;</span>
								</div>
								<div id="weatherLow" style="float: left; margin-left: 15px; color: #71B2DC;">
									Lo <span id="lowTemp">--</span><span>&deg;</span>
								</div>
							</div>
							<div class="weather-row" style="float: left; width: 100%;">
								<div id="precipitation" style="float: left;">
									-- Rain
								</div>
							</div>
							<div class="weather-row" style="float: left; width: 100%;">
								<div id="humidity" style="float: left;">
									-- Humidity
								</div>
							</div>
						</div>
						<span style="float: right; font-size: 40px; margin-top: 0px; margin-right: 5px;">
							&deg;
						</span>
						<div id="outsideTemperature" style="float: right; font-size: 88px; line-height: 88px; text-align: left; margin-top: -2px;">
							--
						</div>
					</div>
				</div>
				<div id="thermostat" style="float: right; width: 50%; height: 100%; text-align: center;">
					<div id="thermostatTop" style="float: left; width: 100%; height: 35px;">
					</div>
					<div id="primaryTemperature" style="float: left; font-size: 200px; line-height: 220px; margin-left: 15%;">
						--
					</div>
					<span style="float: left; font-size: 60px; margin-top: 24px; margin-left: 5px;">
						&deg;
					</span>
					<div id="thermostatInfo" style="float: left; width: 74%; margin-left: 13%;">
						<div id="controlMode" style="float: left;">
							AUTO
						</div>
						<div id="scheduleIcon" style="float: right;">
						</div>
						<div id="tempSetting" style="float: right;">
							75&deg;
						</div>
						<div id="modeIcon" style="float: right; background-image: url('/thermostat_icons/cooling.png'); background-size: auto 24px; background-repeat: no-repeat; height: 24px; width: 24px; margin-right: 10px; margin-top: 2px;">
						</div>
						<div id="auxMode" style="float: right; margin-right: 10px; display: none;">
							AUX
						</div>
					</div>
				</div>
			</div>
			<div class="row" id="bottom-row" style="float: right; width: 100%;">
				<div id="navigation" style="float: right; margin-right: 5%;">
					 
				</div>
			</div>
		</div>
		<div style="float: left; display: none;">
			<img src="thermo.png" height="480px" width="800px">
		</div>
	</body>
</html>
