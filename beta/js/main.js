var lastPress;

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
        document.body.innerHTML = '<button id="TheButton" style="width: 20%; height: 10vh; border-radius: 2px; font-size: 20pt;">Click me.</button><p id="label"></p><table id="highscores"><tr><th>Username</th><th>Time</th></tr></table>';
        return 0;
      }
    }).then(ready);
  } else {
    j(user, "Invalid username! Usernames can only contain up to 32 letters, numbers, or underscores.");
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (user.photoURL == "https://legend-of-iphoenix.github.io/TheButton/img/authenticated.png" && /^\w{1,32}$/.test(user.displayName) && user.displayName) {
      document.body.innerHTML = '<button id="TheButton" style="width: 20%; height: 10vh; border-radius: 2px; font-size: 20pt;">Click me.</button><p id="label"></p><table id="highscores"><tr><th>Username</th><th>Time</th></tr></table>';
      ready();
    } else {
      j(user);
    }
  }
});

function ready() {
  var cleanse = x => {
    var d = document.createElement('p');
    d.innerText = x;
    return d.innerHTML
  }
  firebase.database().ref("/button/latest/").on('value', function (snapshot) {
    lastPress = snapshot.val();
  });
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
  firebase.database().ref("/button/users/").orderByValue().limitToLast(10).on('value',function(snapshot) {
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
    scores.innerHTML += "<tr><th>Username</th><th>Time</th></tr>"
    //reverse ordering of elements
    (e=>{for(var d=0;d<e.childNodes.length;d++)e.insertBefore(e.childNodes[d],e.firstChild)})(document.getElementById("highscores"));
  });
  document.getElementById("TheButton").click=x=>console.log("Abuse is not tolerated.");
  document.getElementById("TheButton").onfocus=x=>document.getElementById("TheButton").blur();
  document.getElementById('TheButton').onclick = function (event) {
    firebase.database().ref("/button/users/" + lastPress.u).transaction(function (ts) {
      ts += Date.now() - lastPress.t;
      return ts;
    }).then(function () {
      firebase.database().ref("/button/latest/").set({
        t: Date.now(),
        u: firebase.auth().currentUser.displayName
      });
      gtag('event', 'ButtonPressed', {
        'event_category': 'engagement',
        'event_label': firebase.auth().currentUser.displayName
      });
    });
  }
}
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
  callbacks: {
    signInSuccess: function(user) {
      if (user.photoURL !== "https://legend-of-iphoenix.github.io/TheButton/img/authenticated.png") {
        j(user);
      } else {
        document.body.innerHTML = '<button id="TheButton" style="width: 20%; height: 10vh; border-radius: 2px; font-size: 20pt;">Click me.</button><p id="label"></p><table id="highscores"><tr><th>Username</th><th>Time</th></tr></table>';
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
