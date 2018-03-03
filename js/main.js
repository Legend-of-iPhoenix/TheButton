var lastPress;
window.onload = function() {
	var username = false;
	while (!username || username.length > 32) {
		username = prompt("Username: ");
	}
	var cleanse = x=>{var d=document.createElement('p');d.innerText=x;return d.innerHTML}
	firebase.database().ref("/button/").on('value',function(snapshot) {
		lastPress = snapshot.val();
	});
	//some code I've used before to format timestamps.
	setInterval(function(){
		var x=n=>{if((n=Date.now()-n)>0){var r=n/1e3,t=r/60,o=t/60,e=o/24
function u(n,r){return(n=Math.floor(n))+" "+r+(1==n?"":"s")+", "}return t%=60,o%=24,r=u(r%=60,"second"),t=u(t,"minute"),o=u(o,"hour"),(e=u(e,"day"))+o+t+"and "+(r=r.substring(0,r.length-2))+" ago"}return"now"}
		document.getElementById('label').innerHTML = "The Button was last clicked <strong>"+x(lastPress.t)+"</strong> by <strong>"+cleanse(lastPress.u)+"</strong>"
	},10);
	document.getElementById('TheButton').onclick = function(event) {
		if(username!=lastPress.u) {
		firebase.database().ref("/button/").set({t: Date.now(),u:username});
		gtag('event', 'ButtonPressed', {
  		'event_category': 'engagement',
  		'event_label': username
		});
		}
	};
}
