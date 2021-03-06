/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var toolbar = document.getElementById("toolbar");
var toolbarButton = document.getElementById('toolbarButton');
var gridCheckbox = document.getElementById("gridCheck");
var loginForm = document.getElementById("loginScreen");
var socket;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
	document.getElementById("loadingScreen").getElementsByTagName("h1")[0].innerHTML = "Connecting...";
        screen.orientation.lock('landscape');
	loginForm.getElementsByTagName("button")[0].addEventListener("click", login);
        toolbarButton.addEventListener("click", toggleToolbar);
        gridCheck.addEventListener("change", toggleGrid);

        socket = io.connect('https://collaborativepaint.herokuapp.com');
	socket.on('connect', function(){
		document.getElementById("loadingScreen").style.display = 'none';
		if(window.localStorage.getItem("username") !== null){
                	loginForm.style.display = "none";
			socket.emit("login", window.localStorage.getItem("username"));
        	}
	});
        socket.on("draw", function(startX, startY, x, y, color, width, tool){
        	var pos1 = {
        		x: startX * 2,
        		y: startY * 2
        	};
        	var pos2 = {
        		x: x * 2,
        		y: y * 2
        	};
        	draw(pos1, pos2, tool, color, width, false);
        });

        setScaleFactor();
        window.addEventListener('orientationchange', function(){
          setTimeout(function(){
            setScaleFactor();
          }, 200);
        });
    },
};

function toggleToolbar(){
    if(toolbar.className == "collapsed"){
      setToolbarExpanded(true);
    }else{
      setToolbarExpanded(false);
    }
};

function setToolbarExpanded(expanded){
    if(expanded){
      toolbar.className = "expanded";
      toolbarButton.innerHTML = "&lsaquo;";
    }else{
      toolbar.className = "collapsed";
      toolbarButton.innerHTML = "&rsaquo;";
    }
};

function login(){
    var username = document.getElementById("username").value;
    socket.emit("login", username);
    window.localStorage.setItem("username", username);
    loginForm.style.display = "none";
}

app.initialize();
