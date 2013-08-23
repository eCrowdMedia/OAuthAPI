/*! readmoo_oauth2 - v1.0.0-alpha - 2013-08-23
* Copyright (c) 2013 Kevin Chiu; Licensed  */
var hello = (function(){

	"use strict";

	// JSONP
	var _jsonp_counter = 0;
	
	// Events
	var listeners = {};

	// Shy elements, without dispay:none
	var shy = {position:'absolute',left:"-1000px",bottom:0,height:'1px',width:'1px'};

	// default timeout, 20 seconds for API calls
	var _timeout = 20000;

	// hello.init() already called?
	var _initstarted = false;

	//
	// Services Object
	var _services = {};

	// Monitor for a change in state and fire
	var old_session = {}, pending = {};

	//
	// Monitoring session state
	// Check for session changes
	(function self(){

		// Loop through the services
		for(var x in _services){if(_services.hasOwnProperty(x)){

			if(!_services[x].id){
				// we haven't attached an ID so dont listen.
				continue;
			}
		
			// Get session
			var session = hello.getAuthResponse(x) || {};
			var oldsess = old_session[x] || {};
			var evt = '';

			//
			// Listen for callbacks fired from Signin
			//
			if(session && "callback" in session && session.callback in listeners){

				// to do remove from session object...
				var cb = session.callback;
				try{
					delete session.callback;
				}catch(e){}

				// Update store
				_store(x,session);

				// fire
				hello.trigger(cb, { network:x, authResponse: session } );
			}
			
			//
			// Refresh login
			//
			if( session && ("expires" in session) && session.expires < ((new Date()).getTime()/1e3) ){

				if( !( x in pending ) || pending[x] < ((new Date()).getTime()/1e3) ) {
					// try to resignin
					log( x + " has expired trying to resignin" );
					hello.login(x,{display:'none'});

					// update pending, every 10 minutes
					pending[x] = ((new Date()).getTime()/1e3) + 600;
				}
				// If session has expired then we dont want to store its value until it can be established that its been updated
				continue;
			}
			// Has session changed?
			else if( oldsess.access_token === session.access_token &&
						oldsess.expires === session.expires ){
				continue;
			}
			// Access_token has been removed
			else if( !session.access_token && oldsess.access_token ){
				hello.trigger( x+':auth.logout', {
					network : x,
					authResponse : session
				});
			}
			// Access_token has been created
			else if( session.access_token && !oldsess.access_token ){
				hello.trigger( x+':auth.login', {
					network:x,
					authResponse: session
				} );
			}
			// Access_token has been updated
			else if( session.expires !== oldsess.expires ){
				hello.trigger( x+':auth.update', {
					network:x,
					authResponse: session
				} );
			}
			
			old_session[x] = session;
		}}

		// Check error events
		setTimeout(self, 1000);
	})();



	var hello = {


		//
		// Options
		// #fragment not allowed
		//
		settings : {

			//
			// OAuth 2 authentication defaults
			redirect_uri  : window.location.href.split('#')[0],
			response_type : 'token',
			display       : 'popup',
			state         : '',

			//
			// OAuth 1 shim
			// This is the path to the OAuth1 server for signing user requests
			// Wanna recreate your own? checkout https://github.com/MrSwitch/node-oauth-shim
			oauth_proxy   : 'https://auth-server.herokuapp.com/proxy'
		},

		//
		// Service
		// Get/Set the default service
		//
		service : function(service){
			if(typeof (service) !== 'undefined' ){
				return _store( 'sync_service', service );
			}
			return _store( 'sync_service' );
		},

		//
		// init
		// Define the clientId's for the endpoint services
		// @param object o, contains a key value pair, service => clientId
		// @param object opts, contains a key value pair of options used for defining the authentication defaults
		// @param number timeout, timeout in seconds
		//
		init : function(services,opts,timeout){

			if(!services){
				return _services;
			}

			// Arguments
			var p = _arguments({services:'o!',opts:'o',timeout:'i'},arguments);

			// Define provider credentials
			// Reformat the ID field
			for( var x in p.services ){if(p.services.hasOwnProperty(x)){
				if( typeof(p.services[x]) !== 'object' ){
					p.services[x] = {id : p.services[x]};
				}
			}}

			// merge objects
			_services = _merge(_services, p.services);

			// Tidy
			for( x in _services ){if(_services.hasOwnProperty(x)){
				_services[x].scope = _services[x].scope || {};
			}}

			// options
			if(p.opts){
				this.settings = _merge(this.settings, p.opts);

				if("redirect_uri" in p.opts){
					this.settings.redirect_uri = _realPath(p.opts.redirect_uri);
				}
			}

			// Timeout
			if(p.timeout){
				_timeout = p.timeout;
			}

			return _services;
		},

		//
		// Login
		// Using the endpoint defined by _services[x].auth we prompt the login
		// @param network	stringify				name to connect to
		// @param options	object		(optional)	{display mode, is either none|popup(default)|page, scope: email,birthday,publish, .. }
		// @param callback	function	(optional)	fired on signin
		//
		login :  function(network, opts, callback){

			var url,
				p = _arguments({network:'s!', options:'o', callback:'f'}, arguments);
			

			// merge/override options with app defaults
			p.options = _merge(this.settings, p.options || {} );

			// Is our service valid?
			if( typeof(p.network) !== 'string' ){
				// trigger the default login.
				// ahh we dont have one.
				log('Please specify a service.');
			}

			//
			var provider  = _services[p.network],
				callback_id = "" + Math.round(Math.random()*1e9);

			//
			// Callback
			// Save the callback until state comes back.
			//
			var responded = false;
			this.subscribe(callback_id, function self(){
				responded = true;
				hello.unsubscribe(callback_id,self);
				if(p.callback){
					p.callback.apply(this, arguments);
				}
			});


			//
			// QUERY STRING
			// querystring parameters, we may pass our own arguments to form the querystring
			//
			var qs = _merge( p.options, {
				client_id	: provider.id,
				scope		: 'basic',
				state		: {
					client_id	: provider.id,
					network		: p.network,
					display		: p.options.display,
					callback	: callback_id,
					state		: p.options.state,
					oauth_proxy : p.options.oauth_proxy
				}
			});

			//
			// SCOPES
			// Authentication permisions
			//
			var scope = p.options.scope;
			if(scope){
				// Format
				if(typeof(scope)!=='string'){
					scope = scope.join(',');
				}
			}
			scope = (scope ? scope + ',' : '') + qs.scope;

			// Save in the State
			qs.state.scope = scope.split(/,\s/);

			// Replace each with the default scopes
			qs.scope = scope.replace(/[^,\s]+/ig, function(m){
				return (m in provider.scope) ? provider.scope[m] : '';
			}).replace(/[,\s]+/ig, ',');
			// remove duplication and empty spaces
			qs.scope = _unique(qs.scope.split(/,+/)).join( provider.scope_delim || ',');

			//
			// Is the user already signed in
			//
			var session = hello.getAuthResponse(p.network);
			if( session && "expires" in session && session.expires > ((new Date()).getTime()/1e3) ){
				// What is different about the scopes in the session vs the scopes in the new login?
				var diff = _diff( session.scope || [], qs.state.scope || [] );
				if(diff.length===0){
					// Ok trigger the callback
					this.trigger(callback_id+".login", {
						network : p.network,
						authResponse : session
					});

					// Notthing has changed
					return;
				}
			}

			//
			// REDIRECT_URI
			// Is the redirect_uri root?
			//
			qs.redirect_uri = _realPath(qs.redirect_uri);

			// Add OAuth to state
			if(provider.oauth){
				qs.state.oauth = provider.oauth;
			}

			// Convert state to a string
			qs.state = JSON.stringify(qs.state);

			// Loop through and remove unwanted attributes from the path
			for(var x in qs){
				if(qs.hasOwnProperty(x) && _indexOf(['response_type','redirect_uri','state', 'client_id', 'scope', 'display'], x) === -1 ){
					delete qs[x];
				}
			}


			//
			// Override login querystrings from auth_options
			if(provider.auth_options){
				qs = _merge(qs, provider.auth_options );
			}


			//
			// URL
			//
			if( provider.oauth && parseInt(provider.oauth.version,10) === 1 ){
				// Turn the request to the OAuth Proxy for 3-legged auth
				url = _qs( p.options.oauth_proxy, qs );
			}
			else{
				url = _qs( provider.uri.auth, qs );
			}

			//
			// Execute
			// Trigger how we want this displayed
			// Calling Quietly?
			//
			if( p.options.display === 'none' ){
				// signin in the background, iframe
				_append('iframe', { src : url, style : shy }, 'body');
			}

			// Triggering popup?
			else if( p.options.display === 'popup'){

				// Trigger callback
				var popup = window.open(
					url,
					'Authentication',
					"resizeable=true,height=550,width=500,left="+((window.innerWidth-500)/2)+",top="+((window.innerHeight-550)/2)
				);
				// Ensure popup window has focus upon reload, Fix for FF.
				popup.focus();

				var self = this;
				var timer = setInterval(function(){
					if(popup.closed){
						clearInterval(timer);
						if(!responded){
							self.trigger(callback_id+".failed", {error:{code:"user_cancelled", message:"Cancelled"}, network:p.network });
						}
					}
				}, 100);
			}

			else {
				window.location = url;
			}

			return {url:url,method:qs.display};
		},
	
	
		//
		// Logout
		// Remove any data associated with a given service
		// @param string name of the service
		// @param function callback
		//
		logout : function(s, callback){

			var p = _arguments({name:'s', callback:"f" }, arguments);

			if(p.name && _store(p.name)){
				_store(p.name,'');
			}
			else if(!p.name){
				for(var x in _services){if(_services.hasOwnProperty(x)){
					hello.logout(x);
				}}
				// remove the default
				hello.service(false);
				// trigger callback
			}
			else{
				log( p.name + ' had no session' );
			}
			if(p.callback){
				p.callback(false);
			}
		},


		//
		// API
		// @param path		string
		// @param method	string (optional)
		// @param data		object (optional)
		// @param timeout	integer (optional)
		// @param callback	function (optional)
		//

		api : function(){

			// get arguments
			var p = _arguments({path:'s!', method : "s", data:'o', timeout:'i', callback:"f" }, arguments),
				self = this;
			
			// method
			p.method = (p.method || 'get').toLowerCase();
			
			// data
			p.data = p.data || {};
			
			// Path
			p.path = p.path.replace(/^\/+/,'');
			var a = (p.path.split(/[\/\:]/,2)||[])[0].toLowerCase();
	
			var service;
	
			if(a in _services){
				service = a;
				var reg = new RegExp('^'+a+':?\/?');
				p.path = p.path.replace(reg,'');
			}
			else {
				service = this.service();
			}
			
			// callback
			p.callback = p.callback || function(){};
			
			// timeout global setting
			_timeout = p.timeout || _timeout;
			
			
			log("API: "+p.method.toUpperCase()+" '"+p.path+"' (request)",p);
			
			var o = _services[service];
			
			// Have we got a service
			if(!o){
				log("No user");
				p.callback(false);
				return;
			}

			//
			// Callback wrapper?
			// Change the incoming values so that they are have generic values according to the path that is defined
			var callback = function(r,code){
				if( o.wrap && ( (p.path in o.wrap) || ("default" in o.wrap) )){
					var wrap = (p.path in o.wrap ? p.path : "default");
					var time = (new Date()).getTime();
					r = o.wrap[wrap](r,code);
					log("Processig took" + ((new Date()).getTime() - time));
				}
				log("API: "+p.method.toUpperCase()+" '"+p.path+"' (response)", r);
				p.callback(r,code);
			};

			// push out to all networks
			// as long as the path isn't flagged as unavaiable, e.g. path == false
			if( !(p.path in o.uri) || o.uri[p.path] !== false ){

				var url = (p.path in o.uri ?
							o.uri[p.path] :
							( o.uri['default'] ? o.uri['default'] : p.path));

				// if url needs a base
				// Wrap everything in
				var getPath = function(url){

					if( !url.match(/^https?:\/\//) ){
						url = o.uri.base + url;
					}


					var qs = {};

					// Format URL
					var format_url = function( qs_handler, callback ){

						// Execute the qs_handler for any additional parameters
						if(qs_handler){
							if(typeof(qs_handler)==='function'){
								qs_handler(qs);
							}
							else{
								qs = _merge(qs, qs_handler);
							}
						}

						var path = _qs(url, qs||{} );
						_sign(service, path, p.method, p.data, o.querystring, callback);
					};


					// Update the resource_uri
					//url += ( url.indexOf('?') > -1 ? "&" : "?" );

					// Format the data
					if( !_isEmpty(p.data) && !_dataToJSON(p) ){
						// If we can't format the post then, we are going to run the iFrame hack
						_post( format_url, p.data, ("post" in o ? o.post(p) : null), callback );
						return;
					}

					// the delete callback needs a better response
					if(p.method === 'delete'){
						var _callback = callback;
						callback = function(r, code){
							_callback((!r||_isEmpty(r))? {response:'deleted'} : r, code);
						};
					}

					// Can we use XHR for Cross domain delivery?
					if( 'withCredentials' in new XMLHttpRequest() && ( !("xhr" in o) || ( o.xhr && o.xhr(p,qs) ) ) ){

						qs.suppress_response_codes = true;

						var x = _xhr(p.method, format_url, p.headers, p.data, callback );

						// we're done
						return {
							xhr : x,
							method : 'XHR',
							data : p.data
						};
					}

					// Otherwise we're on to the old school, IFRAME hacks and JSONP
					// Preprocess the parameters
					// Change the p parameters
					if("jsonp" in o){
						o.jsonp(p,qs);
					}

					// Is this still a post?
					if( p.method === 'post' ){

						//qs.channelUrl = window.location.href;
						return {
							url : _post( format_url, p.data, ("post" in o ? o.post(p) : null), callback ),
							method : 'POST',
							data : p.data
						};
					}
					// Make the call
					else{

						qs = _merge(qs,p.data);
						qs.callback = '?';

						return {
							url : _jsonp( format_url, callback ),
							method : 'JSONP'
						};
					}
				};

				// Make request
				if(typeof(url)==='function'){
					url(p, getPath);
				}
				else{
					getPath(url);
				}
			}
			else{
				log('The path "'+ p.path +'" is not recognised');
			}
		},


		//
		// getAuthResponse
		// Returns all the sessions that are subscribed too
		// @param string optional, name of the service to get information about.
		//
		getAuthResponse : function(service){
			return _store(service||this.service());
		},
		



		//
		// Subscribe to events
		// @param evt		string
		// @param callback	function
		//
		subscribe : function(evt, callback){

			log("Subscribed", evt, callback);

			var p = _arguments({evt:'s!', callback:"f!"}, arguments);

			if(!p){
				return false;
			}
	
			listeners[p.evt] = [p.callback].concat(listeners[p.evt]||[]);

		},


		//
		// Unsubscribe to events
		// @param evt		string
		// @param callback	function
		//
		unsubscribe : function(evt, callback){
	
			log('Unsubscribe', evt, callback);

			var p = _arguments({evt:'s!', callback:"f"}, arguments);

			if(!p){
				return false;
			}
			
			for(var i=0;i<listeners[p.evt].length;i++){
				if(!p.callback || listeners[p.evt][i] === p.callback){
					listeners[p.evt] = listeners[p.evt].splice(i,1);
				}
			}
		},
		
		//
		// Trigger
		// Triggers any subscribed events
		//
		trigger : function(evt, data){
			// loop through the events
			log("Trigger: '"+ evt+"'", data);

			for(var x in listeners){if(listeners.hasOwnProperty(x)){
				if( evt.indexOf(x) > -1 ){
					for(var i=0;i<listeners[x].length;i++){
						listeners[x][i].call(this, data);
					}
				}
			}}
		},
		
		//
		// Utilities
		//
		utils : {
			param : _param,
			hasBinary : _hasBinary,
			sign : _sign,
			store : _store,
			append : _append,
			merge : _merge
		}
	};


	//
	// AuthCallback
	// Trigger a callback to authenticate
	//
	function authCallback(network, obj){
		// Trigger the callback on the parent
		_store(obj.network, obj );

		// this is a popup so
		if( !("display" in p) || p.display !== 'page'){

			// trigger window.opener
			var win = (window.opener||window.parent);

			if(win&&"hello" in win&&win.hello){
				// Call the generic listeners
//				win.hello.trigger(network+":auth."+(obj.error?'failed':'login'), obj);
				// Call the inline listeners

				// to do remove from session object...
				var cb = obj.callback;
				try{
					delete obj.callback;
				}catch(e){}


				// Trigger on the parent
				if(obj.error){
					win.hello.trigger(obj.network+":"+cb+".failed", obj );
				}
				else{
					// Save on the parent window the new credentials
					// This fixes an IE10 bug i think... atleast it does for me.
					win.hello.utils.store(obj.network,obj);

					win.hello.trigger(obj.network+":"+cb+".login", {
						network : obj.network,
						authResponse : obj
					});
				}

				// Update store
				_store(obj.network,obj);
			}

			window.close();
			log('Trying to close window');

			// Dont execute any more
			return;
		}
	}

	//
	// Save session, from redirected authentication
	// #access_token has come in?
	//
	// FACEBOOK is returning auth errors within as a query_string... thats a stickler for consistency.
	// SoundCloud is the state in the querystring and the rest in the hashtag
	var p = _merge(_param(window.location.search||''), _param(window.location.hash||''));

	
	// if p.state
	if( p && "state" in p ){

		// remove any addition information
		// e.g. p.state = 'facebook.page';
		try{
			var a = JSON.parse(p.state);
			p = _merge(p, a);
		}catch(e){
			log("Could not decode state parameter");
		}

		// access_token?
		if( ("access_token" in p&&p.access_token) && p.network ){

			if(!p.expires_in || parseInt(p.expires_in,10) === 0){
				// If p.expires_in is unset, 1 hour, otherwise 0 = infinite, aka a month
				p.expires_in = !p.expires_id ? 3600 : (3600 * 24 * 30);
			}
			p.expires_in = parseInt(p.expires_in,10);
			p.expires = ((new Date()).getTime()/1e3) + parseInt(p.expires_in,10);

			// Make this the default users service
			hello.service( p.network );

			// Lets use the "state" to assign it to one of our networks
			authCallback( p.network, p );
		}

		//error=?
		//&error_description=?
		//&state=?
		else if( ("error" in p && p.error) && p.network ){
			// Error object
			p.error = {
				code: p.error,
				message : p.error_message || p.error_description
			};

			// Let the state handler handle it.
			authCallback( p.network, p );
		}

		// API Calls
		// IFRAME HACK
		// Result is serialized JSON string.
		if(p&&p.callback&&"result" in p && p.result ){
			// trigger a function in the parent
			if(p.callback in window.parent){
				window.parent[p.callback](JSON.parse(p.result));
			}
		}
	}

	// redefine
	p = _param(window.location.search);
	// IS THIS AN OAUTH2 SERVER RESPONSE? OR AN OAUTH1 SERVER RESPONSE?
	if((p.code&&p.state) || (p.oauth_token&&p.proxy_url)){
		// Add this path as the redirect_uri
		p.redirect_uri = window.location.href.replace(/[\?\#].*$/,'');
		// JSON decode
		var state = JSON.parse(p.state);
		// redirect to the host
		var path = (state.oauth_proxy || p.proxy_url) + "?" + _param(p);

		window.location = path;
	}

	return hello;



	//////////////////////////////////////////////
	//////////////////////////////////////////////
	/////////////////UTILITIES////////////////////
	//////////////////////////////////////////////
	//////////////////////////////////////////////

	//
	// Log
	// [@param,..]
	//
	function log() {
		return;
		if(typeof arguments[0] === 'string'){
			arguments[0] = "HelloJS-" + arguments[0];
		}
		if (typeof(console) === 'undefined'||typeof(console.log) === 'undefined'){ return; }
		if (typeof console.log === 'function') {
			console.log.apply(console, arguments); // FF, CHROME, Webkit
		}
		else{
			console.log(Array.prototype.slice.call(arguments)); // IE
		}
	}
	

	//
	// isArray
	function _isArray(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	}

	// isEmpty
	function _isEmpty(obj){
		// scalar?
		if(!obj){
			return true;
		}

		// Array?
		if(obj && obj.length>0) return false;
		if(obj && obj.length===0) return true;

		// object?
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	//
	// diff
	function _diff(a,b){
		var r = [];
		for(var i=0;i<b.length;i++){
			if(_indexOf(a,b[i])===-1){
				r.push(b[i]);
			}
		}
		return r;
	}

	// _DOM
	// return the type of DOM object
	function _domInstance(type,data){
		var test = "HTML" + (type||'').replace(/^[a-z]/,function(m){return m.toUpperCase();}) + "Element";
		if(window[test]){
			return data instanceof window[test];
		}else if(window.Element){
			return data instanceof window.Element && (!type || data.tagName === type);
		}else{
			return (!(data instanceof Object||data instanceof Array||data instanceof String||data instanceof Number) && data.tagName && data.tagName === type );
		}
	}

	//
	// indexOf
	// IE hack Array.indexOf doesn't exist prior to IE9
	function _indexOf(a,s){
		// Do we need the hack?
		if(a.indexOf){
			return a.indexOf(s);
		}

		for(var j=0;j<a.length;j++){
			if(a[j]===s){
				return j;
			}
		}
		return -1;
	}

	// Append the querystring to a url
	// @param string url
	// @param object parameters
	function _qs(url, params){
		if(params){
			var reg;
			for(var x in params){
				if(url.indexOf(x)>-1){
					reg = new RegExp("[\?\&]"+x+"=[^\&]*");
					url = url.replace(reg,'');
				}
			}
		}
		return url + (!_isEmpty(params) ? ( url.indexOf('?') > -1 ? "&" : "?" ) + _param(params) : '');
	}
	
	//
	// Param
	// Explode/Encode the parameters of an URL string/object
	// @param string s, String to decode
	//
	function _param(s){
		var b,
			a = {},
			m;
		
		if(typeof(s)==='string'){

			m = s.replace(/^[\#\?]/,'').match(/([^=\/\&]+)=([^\&]+)/g);
			log(m);
			if(m){
				for(var i=0;i<m.length;i++){
					b = m[i].split('=');
					a[b[0]] = decodeURIComponent( b[1] );
				}
			}
			return a;
		}
		else {
			var o = s;
		
			a = [];

			for( var x in o ){if(o.hasOwnProperty(x)){
				if( o.hasOwnProperty(x) ){
					a.push( [x, o[x] === '?' ? '?' : encodeURIComponent(o[x]) ].join('=') );
				}
			}}

			return a.join('&');
		}
	}
	
	//
	// Store
	//
	function _store(name,value,days) {

		// log
		//log("_store",arguments);
		
		// Local storage
		var hello = JSON.parse(localStorage.getItem('hello')) || {};

		if(name && typeof(value) === 'undefined'){
			return hello[name];
		}
		else if(name && value === ''){
			try{
				delete hello[name];
			}
			catch(e){
				hello[name]=null;
			}
		}
		else if(name){
			hello[name] = value;
		}
		else {
			return hello;
		}

		localStorage.setItem('hello', JSON.stringify(hello));

		return hello;
		
		/*
		if(typeof(value) === 'undefined'){
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' '){
					c = c.substring(1,c.length);
				}
				if (c.indexOf(nameEQ) == 0){
					r = c.substring(nameEQ.length,c.length);
					if( r.match(/^\{/) ){
						try{
							r = JSON.parse(r);
						}catch(e){}
					}
					return r;
				}
			}
			return null;
		}
		else if (value === ''){
			days = -1;
		}
	
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		
		if(typeof(value)!=='string'){
			value = JSON.stringify(value);
		}
		document.cookie = name+"="+value+expires+"; path=/";
		*/
	}

	//
	// unique
	// remove duplicate and null values from an array
	// @param a array
	//
	function _unique(a){
		if(typeof(a)!=='object'){ return []; }
		var r = [];
		for(var i=0;i<a.length;i++){

			if(!a[i]||a[i].length===0||_indexOf(r, a[i])!==-1){
				continue;
			}
			else{
				r.push(a[i]);
			}
		}
		return r;
	}


	//
	// merge
	// recursive merge two objects into one, second parameter overides the first
	// @param a array
	//
	function _merge(a,b){
		var x,r = {};
		if( typeof(a) === 'object' && typeof(b) === 'object' ){
			for(x in a){if(a.hasOwnProperty(x)){
				r[x] = a[x];
				if(x in b){
					r[x] = _merge( a[x], b[x]);
				}
			}}
			for(x in b){if(b.hasOwnProperty(x)){
				if(!(x in a)){
					r[x] = b[x];
				}
			}}
		}
		else{
			r = b;
		}
		return r;
	}

	//
	// Args utility
	// Makes it easier to assign parameters, where some are optional
	// @param o object
	// @param a arguments
	//
	function _arguments(o,args){

		var p = {},
			i = 0,
			t = null,
			x = null;
		
		// define x
		for(x in o){if(o.hasOwnProperty(x)){
			break;
		}}

		// Passing in hash object of arguments?
		// Where the first argument can't be an object
		if((args.length===1)&&(typeof(args[0])==='object')&&o[x]!='o!'){
			// return same hash.
			return args[0];
		}

		// else loop through and account for the missing ones.
		for(x in o){if(o.hasOwnProperty(x)){

			t = typeof( args[i] );

			if( ( typeof( o[x] ) === 'function' && o[x].test(args[i]) ) || ( typeof( o[x] ) === 'string' && (
					( o[x].indexOf('s')>-1 && t === 'string' ) ||
					( o[x].indexOf('o')>-1 && t === 'object' ) ||
					( o[x].indexOf('i')>-1 && t === 'number' ) ||
					( o[x].indexOf('a')>-1 && t === 'object' ) ||
					( o[x].indexOf('f')>-1 && t === 'function' )
				) )
			){
				p[x] = args[i++];
			}
			
			else if( typeof( o[x] ) === 'string' && o[x].indexOf('!')>-1 ){
				log("Whoops! " + x + " not defined");
				return false;
			}
		}}
		return p;
	}

	//
	// realPath
	//
	function _realPath(path){
		if( path.indexOf('/') === 0 ){
			path = window.location.protocol + '//' + window.location.host + path;
		}
		// Is the redirect_uri relative?
		else if( !path.match(/^https?\:\/\//) ){
			path = (window.location.href.replace(/#.*/,'').replace(/\/[^\/]+$/,'/') + path).replace(/\/\.\//g,'/');
		}
		while( /\/[^\/]+\/\.\.\//g.test(path) ){
			path = path.replace(/\/[^\/]+\/\.\.\//g, '/');
		}
		return path;
	}


	//
	// Create and Append new Dom elements
	// @param node string
	// @param attr object literal
	// @param dom/string
	//
	function _append(node,attr,target){

		var n = typeof(node)==='string' ? document.createElement(node) : node;

		if(typeof(attr)==='object' ){
			if( "tagName" in attr ){
				target = attr;
			}
			else{
				for(var x in attr){if(attr.hasOwnProperty(x)){
					if(typeof(attr[x])==='object'){
						for(var y in attr[x]){if(attr[x].hasOwnProperty(y)){
							n[x][y] = attr[x][y];
						}}
					}
					else if(x==="html"){
						n.innerHTML = attr[x];
					}
					// IE doesn't like us setting methods with setAttribute
					else if(!/^on/.test(x)){
						n.setAttribute( x, attr[x]);
					}
					else{
						n[x] = attr[x];
					}
				}}
			}
		}
		
		if(target==='body'){
			(function self(){
				if(document.body){
					document.body.appendChild(n);
				}
				else{
					setTimeout( self, 16 );
				}
			})();
		}
		else if(typeof(target)==='object'){
			target.appendChild(n);
		}
		else if(typeof(target)==='string'){
			log(target);
			document.getElementsByTagName(target)[0].appendChild(n);
		}
		return n;
	}

	//
	// Add authentication to the URL
	function _sign(network, path, method, data, modifyQueryString, callback){

		// OAUTH SIGNING PROXY
		var session = hello.getAuthResponse(network),
			service = _services[network],
			token = (session ? session.access_token : null);

		var proxy = ( service.oauth && parseInt(service.oauth.version,10) === 1 ? hello.settings.oauth_proxy : null);

		if(proxy){

			if(method.toUpperCase()!=='GET'){
				// Make an call to get a OAuth1 signed URL before calling the response
				var url = _qs(proxy, {
					path : path,
					access_token : token||'',
					method : method
//					data : (data ? JSON.stringify(data) : null)
				});

				if("withCredentials" in new XMLHttpRequest()){
					_xhr(method, url, null, data, callback);
				}
				else{
					_jsonp(_qs( url, {callback:'?',data: JSON.stringify(data)}), callback);
				}
			}
			else{
				callback( _qs(proxy, {
					path : path,
					access_token : token||''
				}));
			}
			return;
		}
		var qs = { 'access_token' : token||'' };

		if(modifyQueryString){
			modifyQueryString(qs);
		}

		callback(  _qs( path, qs) );
	}

	//
	// Authentication
	function _xhr(method, pathFunc, headers, data, callback){

		if(typeof(pathFunc)!=='function'){
			var path = pathFunc;
			pathFunc = function(qs, callback){callback(_qs( path, qs ));};
		}

		var r = new XMLHttpRequest();

		// Binary?
		var binary = false;
		if(method==='blob'){
			binary = method;
			method = 'GET';
		}
		// UPPER CASE
		method = method.toUpperCase();

		// xhr.responseType = "json"; // is not supported in any of the vendors yet.
		r.onload = function(e){
			var json = r.response;
			try{
				json = JSON.parse(r.responseText);
			}catch(_e){
				if(r.status===401){
					json = {
						error : {
							code : "access_denied",
							message : r.statusText
						}
					};
				}
			}


			callback( json || ( method!=='DELETE' ? {error:{message:"Could not get resource"}} : {} ), r.status );
		};
		r.onerror = function(e){
			var json = r.responseText;
			try{
				json = JSON.parse(r.responseText);
			}catch(_e){}

			callback(json||{error:{
				code: "access_denied",
				message: "Could not get resource"
			}});
		};

		var qs = {}, x;

		// Should we add the query to the URL?
		if(method === 'GET'||method === 'DELETE'){
			if(!_isEmpty(data)){
				qs = _merge(qs, data);
			}
			data = null;
		}
		else if( data && typeof(data) !== 'string' && !(data instanceof FormData)){
			// Loop through and add formData
			var f = new FormData();
			for( x in data )if(data.hasOwnProperty(x)){
				if( data[x] instanceof HTMLInputElement ){
					if( "files" in data[x] && data[x].files.length > 0){
						f.append(x, data[x].files[0]);
					}
				}
				else{
					f.append(x, data[x]);
				}
			}
			data = f;
		}

		// Create url

		pathFunc(qs, function(url){

			// Open the path, async
			r.open( method, url, true );

			if(binary){
				if("responseType" in r){
					r.responseType = binary;
				}
				else{
					r.overrideMimeType("text/plain; charset=x-user-defined");
				}
			}

			// Set any bespoke headers
			if(headers){
				for(var x in headers){
					r.setRequestHeader(x, headers[x]);
				}
			}

			r.send( data );
		});


		return r;
	}


	//
	// JSONP
	// Injects a script tag into the dom to be executed and appends a callback function to the window object
	// @param string/function pathFunc either a string of the URL or a callback function pathFunc(querystringhash, continueFunc);
	// @param function callback a function to call on completion;
	//
	function _jsonp(pathFunc,callback){


		// Add data
		
		// Change the name of the callback
		var cb_name = '__lx_jsonp'+(_jsonp_counter++),
			bool = 0,
			head = document.getElementsByTagName('head')[0],
			operafix,
			script,
			result = {error:{message:'server_error',code:'server_error'}},
			cb = function(){
				if( !( bool++ ) ){
					window.setTimeout(function(){
						callback(result);
						head.removeChild(script);
					},0);
				}
			};

		// The URL is a function for some cases and as such
		// Determine its value with a callback containing the new parameters of this function.
		if(typeof(pathFunc)!=='function'){
			var path = pathFunc;
			path = path.replace(new RegExp("=\\?(&|$)"),'='+cb_name+'$1');
			pathFunc = function(qs, callback){ callback(_qs(path, qs));};
		}

		// Add callback to the window object
		window[cb_name] = function(json){
			result = json;
			try{
				delete window[cb_name];
			}catch(e){}
		};

		pathFunc(function(qs){
				for(var x in qs){ if(qs.hasOwnProperty(x)){
					if (qs[x] === '?') qs[x] = cb_name;
				}}
			}, function(url){

			// Build script tag
			script = _append('script',{
				id:cb_name,
				name:cb_name,
				src: url,
				async:true,
				onload:cb,
				onerror:cb,
				onreadystatechange : function(){
					if(/loaded|complete/i.test(this.readyState)){
						cb();
					}
				}
			});

			// Opera fix error
			// Problem: If an error occurs with script loading Opera fails to trigger the script.onerror handler we specified
			// Fix:
			// By setting the request to synchronous we can trigger the error handler when all else fails.
			// This action will be ignored if we've already called the callback handler "cb" with a successful onload event
			if( window.navigator.userAgent.toLowerCase().indexOf('opera') > -1 ){
				operafix = _append('script',{
					text:"document.getElementById('"+cb_name+"').onerror();"
				});
				script.async = false;
			}

			// Add timeout
			window.setTimeout(function(){
				result = {error:{message:'timeout',code:'timeout'}};
				cb();
			}, _timeout);

			// Todo:
			// Add fix for msie,
			// However: unable recreate the bug of firing off the onreadystatechange before the script content has been executed and the value of "result" has been defined.
			// Inject script tag into the head element
			head.appendChild(script);
			
			// Append Opera Fix to run after our script
			if(operafix){
				head.appendChild(operafix);
			}

		});
	}


	//
	// Post
	// Send information to a remote location using the post mechanism
	// @param string uri path
	// @param object data, key value data to send
	// @param function callback, function to execute in response
	//
	function _post(pathFunc, data, options, callback){

		// The URL is a function for some cases and as such
		// Determine its value with a callback containing the new parameters of this function.
		if(typeof(pathFunc)!=='function'){
			var path = pathFunc;
			pathFunc = function(qs, callback){ callback(_qs(path, qs));};
		}

		// This hack needs a form
		var form = null,
			reenableAfterSubmit = [],
			newform,
			i = 0,
			x = null,
			bool = 0,
			cb = function(r){
				if( !( bool++ ) ){
					try{
						// remove the iframe from the page.
						//win.parentNode.removeChild(win);
						// remove the form
						if(newform){
							newform.parentNode.removeChild(newform);
						}
					}
					catch(e){log("could not remove iframe");}

					// reenable the disabled form
					for(var i=0;i<reenableAfterSubmit.length;i++){
						if(reenableAfterSubmit[i]){
							reenableAfterSubmit[i].setAttribute('disabled', false);
						}
					}

					// fire the callback
					callback(r);
				}
			};

		// What is the name of the callback to contain
		// We'll also use this to name the iFrame
		var callbackID = "ifrmhack_"+parseInt(Math.random()*1e6,10).toString(16);

		// Save the callback to the window
		window[callbackID] = cb;

		// Build the iframe window
		var win;
		try{
			// IE7 hack, only lets us define the name here, not later.
			win = document.createElement('<iframe name="'+callbackID+'">');
		}
		catch(e){
			win = document.createElement('iframe');
		}

		win.name = callbackID;
		win.id = callbackID;
		win.style.display = 'none';

		// Override callback mechanism. Triggger a response onload/onerror
		if(options&&options.callbackonload){
			// onload is being fired twice
			win.onload = function(){
				cb({
					response : "posted",
					message : "Content was posted"
				});
			};
		}

		setTimeout(function(){
			cb({
				error : {
					code:"timeout",
					message : "The post operation timed out"
				}
			});
		}, _timeout);

		document.body.appendChild(win);

		// Add some additional query parameters to the URL
		var qs = {
//			"suppress_response_codes":true,
			'redirect_uri':hello.settings.redirect_uri,
			'state':JSON.stringify({callback:callbackID})
//			,
//			'callbackUrl':hello.settings.redirect_uri,
//			'redirect-uri':hello.settings.redirect_uri
		};
		//qs = {};

		// if we are just posting a single item
		if( _domInstance('form', data) ){
			// get the parent form
			form = data.form;
			// Loop through and disable all of its siblings
			for( i = 0; i < form.elements.length; i++ ){
				if(form.elements[i] !== data){
					form.elements[i].setAttribute('disabled',true);
				}
			}
			// Move the focus to the form
			data = form;
		}

		// Posting a form
		if( _domInstance('form', data) ){
			// This is a form element
			form = data;

			// Does this form need to be a multipart form?
			for( i = 0; i < form.elements.length; i++ ){
				if(!form.elements[i].disabled && form.elements[i].type === 'file'){
					form.encoding = form.enctype = "multipart/form-data";
					form.elements[i].setAttribute('name', 'file');
				}
			}
		}
		else{
			// Its not a form element,
			// Therefore it must be a JSON object of Key=>Value or Key=>Element
			// If anyone of those values are a input type=file we shall shall insert its siblings into the form for which it belongs.
			for(x in data) if(data.hasOwnProperty(x)){
				// is this an input Element?
				if( _domInstance('input', data[x]) && data[x].type === 'file' ){
					form = data[x].form;
					form.encoding = form.enctype = "multipart/form-data";
				}
			}

			// Do If there is no defined form element, lets create one.
			if(!form){
				// Build form
				form = document.createElement('form');
				document.body.appendChild(form);
				newform = form;
			}

			// Add elements to the form if they dont exist
			for(x in data) if(data.hasOwnProperty(x)){

				// Is this an element?
				var el = ( _domInstance('input', data[x]) || _domInstance('textArea', data[x]) || _domInstance('select', data[x]) );

				// is this not an input element, or one that exists outside the form.
				if( !el || data[x].form !== form ){

					// Does an element have the same name?
					if(form.elements[x]){
						// Remove it.
						form.elements[x].parentNode.removeChild(form.elements[x]);
					}

					// Create an input element
					var input = document.createElement('input');
					input.setAttribute('type', 'hidden');
					input.setAttribute('name', x);

					// Does it have a value attribute?
					if(el){
						input.value = data[x].value;
					}
					else if( _domInstance(null, data[x]) ){
						input.value = data[x].innerHTML || data[x].innerText;
					}else{
						input.value = data[x];
					}

					form.appendChild(input);
				}
				// it is an element, which exists within the form, but the name is wrong
				else if( el && data[x].name !== x){
					data[x].setAttribute('name', x);
					data[x].name = x;
				}
			}

			// Disable elements from within the form if they weren't specified
			for(i=0;i<form.children.length;i++){
				// Does the same name and value exist in the parent
				if( !( form.children[i].name in data ) && form.children[i].getAttribute('disabled') !== true ) {
					// disable
					form.children[i].setAttribute('disabled',true);
					// add re-enable to callback
					reenableAfterSubmit.push(form.children[i]);
				}
			}
		}


		// Set the target of the form
		form.setAttribute('method', 'POST');
		form.setAttribute('target', callbackID);
		form.target = callbackID;


		// Call the path
		pathFunc( qs, function(url){
			form.setAttribute('action', url);

			// Submit the form
			setTimeout(function(){
				form.submit();
			},100);
		});

		// Build an iFrame and inject it into the DOM
		//var ifm = _append('iframe',{id:'_'+Math.round(Math.random()*1e9), style:shy});
		
		// Build an HTML form, with a target attribute as the ID of the iFrame, and inject it into the DOM.
		//var frm = _append('form',{ method: 'post', action: uri, target: ifm.id, style:shy});

		// _append('input',{ name: x, value: data[x] }, frm);
	}


	//
	// Some of the providers require that only MultiPart is used with non-binary forms.
	// This function checks whether the form contains binary data
	function _hasBinary(data){
		for(var x in data ) if(data.hasOwnProperty(x)){
			if( (_domInstance('input', data[x]) && data[x].type === 'file')	||
				("FileList" in window && data[x] instanceof window.FileList) ||
				("File" in window && data[x] instanceof window.File) ||
				("Blob" in window && data[x] instanceof window.Blob)
			){
				return true;
			}
		}
		return false;
	}

	//
	// dataToJSON
	// This takes a FormElement and converts it to a JSON object
	//
	function _dataToJSON(p){

		var data = p.data;

		// Is data a form object
		if( _domInstance('form', data) ){
			// Get the first FormElement Item if its an type=file
			var kids = data.elements;

			var json = {};

			// Create a data string
			for(var i=0;i<kids.length;i++){

				// Is this a file, does the browser not support 'files' and 'FormData'?
				if( kids[i].type === 'file' ){
					// the browser does not XHR2
					if("FormData" in window){
						// include the whole element
						json[kids[i].name] = kids[i];
						break;
					}
					else if( !("files" in kids[i]) ){
						return false;
					}
				}
				else{
					json[ kids[i].name ] = kids[i].value || kids[i].innerHTML;
				}
			}

			// Convert to a postable querystring
			data = json;
		}

		// Is this a form input element?
		if( _domInstance('input', data) ){
			// Get the Input Element
			// Do we have a Blob data?
			if("files" in data){

				var o = {};
				o[ data.name ] = data.files;
				// Turn it into a FileList
				data = o;
			}
			else{
				// This is old school, we have to perform the FORM + IFRAME + HASHTAG hack
				return false;
			}
		}

		// Is data a blob, File, FileList?
		if( ("File" in window && data instanceof window.File) ||
			("Blob" in window && data instanceof window.Blob) ||
			("FileList" in window && data instanceof window.FileList) ){

			// Convert to a JSON object
			data = {'file' : data};
		}

		// Loop through data if its not FormData it must now be a JSON object
		if( !( "FormData" in window && data instanceof window.FormData ) ){

			// Loop through the object
			for(var x in data) if(data.hasOwnProperty(x)){

				// FileList Object?
				if("FileList" in window && data[x] instanceof window.FileList){
					// Get first record only
					if(data[x].length===1){
						data[x] = data[x][0];
					}
					else{
						log("We were expecting the FileList to contain one file");
					}
				}
				else if( _domInstance('input', data[x]) && data[x].type === 'file' ){

					if( ( "files" in data[x] ) ){
						// this supports HTML5
						// do nothing
					}
					else{
						// this does not support HTML5 forms FileList
						return false;
					}
				}
				else if( _domInstance('input', data[x]) ||
					_domInstance('select', data[x]) ||
					_domInstance('textArea', data[x])
					){
					data[x] = data[x].value;
				}
				else if( _domInstance(null, data[x]) ){
					data[x] = data[x].innerHTML || data[x].innerText;
				}
			}
		}

		// Data has been converted to JSON.
		p.data = data;

		return true;
	}

})();
(function() {
  var clientId, clientSecret, options, readmoo, redirectUri, scope;

  scope = ['reading', 'highlight', 'like', 'comment', 'me', 'library'];

  redirectUri = 'http://korprulu.ohread.com/test/oauth2/test/';

  clientSecret = 'b4c5026fcd9d9eeec642d09e8402036f';

  clientId = {
    readmoo: 'efe60b2afc3447dded5e6df6fd2bd920'
  };

  options = {
    redirect_uri: redirectUri,
    scope: scope.join(),
    response_type: 'code'
  };

  hello.subscribe('auth.login', function() {
    return console.log('login success');
  });

  hello.init(clientId, options);

  window.readmoo = readmoo = {};

  readmoo.login = function() {
    return hello.login('readmoo');
  };

}).call(this);

(function() {
  hello.init({
    readmoo: {
      name: 'Readmoo',
      uri: {
        auth: 'https://readmoo.com/member/oauth',
        me: 'https://api.readmoo.com/me',
        base: 'https://api.readmoo.com/'
      },
      oauth: {
        version: 2,
        grant: 'https://readmoo.com/member/oauth/access_token'
      },
      scope: {
        reading: 'reading',
        highlight: 'highlight',
        like: 'like',
        comment: 'comment',
        library: 'library'
      }
    }
  });

}).call(this);
