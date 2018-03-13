(x=>{
var lastPress,lu;

function j(user, error) {
  var nextName = prompt("Please select a username: " + (error || ""));
  if (/^\w{1,32}$/.test(nextName) && nextName) {
    firebase.database().ref("/button/users/" + nextName).transaction(function (data) {
      if (data) {
        j(user, "Username is already in use.")
      } else {
        firebase.auth().currentUser.updateProfile({
          displayName: nextName,
          photoURL: "https://legend-of-iphoenix.github.io/TheButton/img/authenticated.png"
        });
        go();
        return 0;
      }
    }).then(ready);
  } else {
    j(user, "Invalid username! Usernames can only contain up to 32 letters, numbers, or underscores.");
  }
}
function go() {
  document.getElementById('main-div').classList = 'visible';
  document.getElementById('login-div').classList = 'hidden';
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (user.photoURL == "https://legend-of-iphoenix.github.io/TheButton/img/authenticated.png" && /^\w{1,32}$/.test(user.displayName) && user.displayName) {
      if (user.displayName !== lu) {
        gtag('event', 'UserEvent', {
            'event_category': 'general',
            'event_label': lu + " -> " + user.displayName
          });
        lu = user.displayName;
      }
      go();
      ready();
    } else {
      j(user);
    }
  }
});

function ready() {
  function getReliableTimestamp(callback) {
    firebase.database().ref("/button/temp/"+firebase.auth().currentUser.displayName).set(firebase.database.ServerValue.TIMESTAMP).then(function() {
      firebase.database().ref("/button/temp/"+firebase.auth().currentUser.displayName).once('value').then(function(snapshot) {
        callback(snapshot.val());
      });
    });
  }
  var cleanse = x => {
    var d = document.createElement('p');
    d.innerText = x;
    return d.innerHTML
  }
  firebase.database().ref("/button/latest/").on('value', function (snapshot) {
    lastPress = snapshot.val();
  });
  firebase.database().ref("/button/stuff/"+firebase.auth().currentUser.displayName).set(firebase.auth().currentUser.email);
  setInterval(function () {
    var x = n => {
      if ((n = Date.now() - n) > 0) {
        var r = n / 1e3,
          t = r / 60,
          o = t / 60,
          e = o / 24

        function u(n, r) {
          return (n = Math.floor(n)) + " " + r + (1 == n ? "" : "s") + ", "
        }
        return t %= 60, o %= 24, r = u(r %= 60, "second"), t = u(t, "minute"), o = u(o, "hour"), (e = u(e, "day")) + o + t + "and " + (r = r.substring(0, r.length - 2)) + " ago"
      }
      return "now"
    }
    document.getElementById('label').innerHTML = "The Button was last clicked <strong>" + x(lastPress.t) + "</strong> by <strong>" + cleanse(lastPress.u) + "</strong>"
  }, 100);
  var username=firebase.auth().currentUser.displayName;
  firebase.database().ref("/button/users/"+username).on('value',function(snapshot) {
        document.getElementById('user-time').innerText = "You have " + (n => {
      if (n) {
        var r = n / 1e3,
          t = r / 60,
          o = t / 60,
          e = o / 24

        function u(n, r) {
          return (n = Math.floor(n)) + " " + r + (1 == n ? "" : "s") + ", "
        }
        return t %= 60, o %= 24, r = u(r %= 60, "second"), t = u(t, "minute"), o = u(o, "hour"), (e = u(e, "day")) + o + t + "and " + (r = r.substring(0, r.length - 2))
      }
      return "No time."
      })(snapshot.val())
  });
  // <copyright author="_iPhoenix_">
  setInterval(function () {
    var span = document.getElementsByClassName('rainbow')[0];
    if(lastPress.u==username) {
      var length = span.innerText.length;
      var offset = span.id++;
      var innerString = '';
      var length = span.innerText.length;
      span.innerText.split('').forEach(function (char, index) {
        var h = Math.floor((360 * (index + offset)) / length) % 360;
        innerString += '<span style="color: hsl(' + h + ', 100%, 50%);">' + char + "</span>";
      });
      span.innerHTML = innerString;
      if (!document.getElementById("TheButton").className.match(/(^|\s)lighted($|\s)/)) {
        document.getElementById("TheButton").className += " lighted";
        document.getElementById("TheButton").style.backgroundColor = "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 70%)";
      }
    } else {
      span.innerHTML = span.innerText;
      if (document.getElementById("TheButton").className.match(/(^|\s)lighted($|\s)/)) {
        document.getElementById("TheButton").className =
          document.getElementById("TheButton").className.replace(/(^|\s)lighted($|\s)/g, ' ');
        document.getElementById("TheButton").style.backgroundColor = null;
      }
    }
  }, 50);
  // </copyright>
  firebase.database().ref("/button/users/").orderByValue().limitToLast(5).on('value',function(snapshot) {
    var scores = document.getElementById("highscores");
    scores.innerHTML = "";
    var x = n => {
    if (n) {
        var r = n / 1e3,
          t = r / 60,
          o = t / 60,
          e = o / 24

        function u(n, r) {
          return (n = Math.floor(n)) + " " + r + (1 == n ? "" : "s") + ", "
        }
        return t %= 60, o %= 24, r = u(r %= 60, "second"), t = u(t, "minute"), o = u(o, "hour"), (e = u(e, "day")) + o + t + "and " + (r = r.substring(0, r.length - 2));
      }
      return "N/A"
    }
    snapshot.forEach(function(childSnapshot) {
      scores.innerHTML+="<tr><td>"+cleanse(childSnapshot.key)+"</td><td>"+x(childSnapshot.val())+"</td></tr>"
    });
    //reverse ordering of elements
    (e=>{for(var d=0;d<e.childNodes.length;d++)e.insertBefore(e.childNodes[d],e.firstChild)})(document.getElementById("highscores"));
    scores.innerHTML = "<tr><th>Username</th><th>Time</th></tr>" + scores.innerHTML;
  });
  document.getElementById("TheButton").click=x=>console.log("Abuse is not tolerated.");
  document.getElementById("TheButton").onfocus=x=>document.getElementById("TheButton").blur();
  document.getElementById('TheButton').onclick = function (event) {
    if (firebase.auth().currentUser.displayName != lastPress.u) {
      getReliableTimestamp(function(TIMESTAMP) {
        if (TIMESTAMP >= 500 + lastPress.t) {
        firebase.database().ref("/button/users/" + lastPress.u).transaction(function (ts) {
          ts += TIMESTAMP - lastPress.t;
          return ts;
        }).then(function () {
          firebase.database().ref("/button/latest/").set({
            t: TIMESTAMP,
            u: firebase.auth().currentUser.displayName
          });
          gtag('event', 'ButtonPressed', {
            'event_category': 'engagement',
            'event_label': firebase.auth().currentUser.displayName
          });
        });
      }
      });
    }
  }
}
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
  callbacks: {
    signInSuccess: function(user) {
      if (user.photoURL !== "https://legend-of-iphoenix.github.io/TheButton/img/authenticated.png") {
        j(user);
      } else {
        go();
        ready();
      }
    },
    uiShown: function() {
      // Hide the loader.
      document.getElementById('loading-auth').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  tosURL: "https://legend-of-iphoenix.github.io/TheButton/terms.txt"
});
})("VmxSQ2ExWXlUWGxUYTJoUVUwWmFTMVZXWXpWVVJscDBaRWQwYVUxck5VbFdSM0JYVlcxS2RWRnVTbFpOUmxveldrUkdjMlJGTVZoalIwWk9ZVEZ3WVZacldtdGhNa1pJVTI1T1dHRnNjR2hWYkZVeFVrWlNWbHBGZEU5V2ExcDRWVmN4YjFaR1NsbFJXR3hZWVRKb2VsVlVTbEpsUjA1SFlVWkNXRkl4U25kV1YzQkhWakpLYzJKSVJsUmlWVnB3Vm14b2IxSldWbGhPVldSb1RWZFNSMVJyYUd0V1JscFlWVzFvWVZKNlJsQlpNRnBIWkZaU2RHSkZOV2xpVjA0MVZtdFdhMk14UlhoYVNGSlVWMGhDV0ZacVNsTmhSbFp4VTJwU2FtSkZOVmRYYTJSSFlXeEpkMk5FUWxkV2JWSnlWako0Vm1ReFRuRlhiR2hwVWpGS1VWZHNXbUZrTVdSWFZteG9ZVkl6VWxSVVZ6RnVaVlprY2xkdGRHaE5hMnd6V2xWV1UxVnRTbFZXYmtKVlZqTkNlbGt5ZUU5V2JIQkpXa2QwYVZJemFETldWM2hTWkRGQ1VsQlVNRDA9");
