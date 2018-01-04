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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    alert: function(){

        function alertDismissed() {
            alert('Usuário clicou no botão ok');
        }
        navigator.notification.alert(
            'Registro salvo com sucesso',  // message
            alertDismissed,         // callback
            'Sucesso',            // title
            'Ok'                  // buttonName
        );
    },

    confirm: function(){
        
        function onConfirm(buttonIndex) {
            alert('Usuário clicou no botão ' + buttonIndex);
        }
        
        navigator.notification.confirm(
            'Erro ao salvar registro. Deseja tentar novamente?!', // message
             onConfirm,            // callback to invoke with index of button pressed
            'Erro!',           // title
            ['Sim','Não']     // buttonLabels
        );
    },

    prompt: function(){
        function onPrompt(results) {
            alert("Usuário clicou no botão " + results.buttonIndex + " e digitou " + results.input1);
        }
        
        navigator.notification.prompt(
            'Insira o seu nome',  // message
            onPrompt,                  // callback to invoke
            'Registro',            // title
            ['Inserir','Fechar'],             // buttonLabels
            'Seu Nome'                 // defaultText
        );
    },

    beep: function(){
        navigator.notification.beep(5);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/

        window.addEventListener("batterystatus", onBatteryStatus, false);
        
        function onBatteryStatus(status) {
            alert("Level: " + status.level + " isPlugged: " + status.isPlugged);
            document.getElementById("level").innerHTML = status.level;
            document.getElementById("isPlugged").innerHTML = status.isPlugged;
            
        }

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            document.getElementById("versaoCordova").innerHTML = device.cordova;
            document.getElementById("modelo").innerHTML = device.model;
            document.getElementById("plataforma").innerHTML = device.platform;
            document.getElementById("versaoSO").innerHTML = device.version;
            document.getElementById("fabricante").innerHTML = device.manufacturer;
        }

        function checkConnection() {
            var networkState = navigator.connection.type;
        
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
        
            alert('Connection type: ' + states[networkState]);
            document.getElementById("tipoConexao").innerHTML = states[networkState];
        }
        
        checkConnection();
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
        
    },

    onSuccess: function(position){
        alert(position);
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude,longitude);

        var mapOptions = {
            center: latLong,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var marker = new google.maps.Marker({
            position: latLong,
            map: map,
            title: 'Minha Localização!'
        });
    },

    onError: function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },

    capturePhoto: function(){
        
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: true 
        });
        
        function onSuccess(imageURI) {
            var image = document.getElementById('minhaImagem');
            image.style.display = "block";
            image.src = "data:image/jpeg;base64," + imageURI;
        }
        
        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },

    listContacts: function(){
        function onSuccess(contacts) {
            alert('Found ' + contacts.length + ' contacts.');
        };
        
        function onError(contactError) {
            alert('onError!');
        };
        
        // find all contacts with 'Bob' in any name field
        var options      = new ContactFindOptions();
        options.multiple = true;
        options.desiredFields = [navigator.contacts.fieldType.id];
        options.hasPhoneNumber = true;
        var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, onSuccess, onError, options);
    },

    createContact: function(){

        function onSuccess(contact) {
            alert("Save Success");
        };
        
        function onError(contactError) {
            alert("Error = " + contactError.code);
        };
        
        // create a new contact object
        var contact = navigator.contacts.create();
        contact.displayName = "AAAA";
        contact.nickname = "PHONEGAP";            // specify both to support all devices
        
        // populate some fields
        var name = new ContactName();
        name.givenName = "AAA";
        name.familyName = "PHONEGAP";
        contact.name = name;
        
        // save to device
        contact.save(onSuccess,onError);
    },

    pickContacts: function(){

        navigator.contacts.pickContact(function(contact){
            alert('The following contact has been selected:' + JSON.stringify(contact));
        },function(err){
            console.log('Error: ' + err);
        });
    }


};
