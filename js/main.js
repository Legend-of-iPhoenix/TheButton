var lightButtonEnabled = false;
(x => {
  var lastPress, lu;

  function j(user, error) {
    var nextName = prompt("Please select a username: " + (error || ""));
    if (/^\w{1,32}$/.test(nextName) && nextName) {
      firebase.database().ref("/button/users/" + nextName).transaction(function (data) {
        if (data) {
          j(user, "Username is already in use.");
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
    document.getElementById('logout-span').classList = 'visible';
    document.getElementById('login-div').classList = 'hidden';
  }

  function logout() {
    document.getElementById('main-div').classList = 'hidden';
    document.getElementById('logout-span').classList = 'hidden';
    document.getElementById('login-div').classList = 'visible';
  }
  
  (function() {
  function toggleNightMode() {
    var elem = document.getElementById(this.dataset.target);
    
    if (this.dataset.mode === 'off') {
      elem.style.color = '#000';
      elem.style.backgroundColor = '#fff';
      elem.style.fontFamily = 'Ubuntu, sans-serif';
      this.dataset.mode = 'on';
    } else {
      elem.style.color = '#fff';
      elem.style.backgroundColor = '#000';
      elem.style.fontFamily = '"Ubuntu", sans-serif';
      this.dataset.mode = 'off';
    }
  }
  
  document.getElementById('togBut').addEventListener('click', toggleNightMode);
})();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (user.photoURL == "https://legend-of-iphoenix.github.io/TheButton/img/authenticated.png" && /^\w{1,32}$/.test(user.displayName) && user.displayName) {
        if (user.displayName !== lu) {
          gtag('event', 'UserEvent', {
            'event_category': 'general',
            'event_label': lu + " -> " + user.displayName
          });
          lu = user.displayName;
          firebase.database().ref('/button/stuff/' + user.displayName).set(user.email);
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
      firebase.database().ref("/button/temp/" + firebase.auth().currentUser.displayName).set(firebase.database.ServerValue.TIMESTAMP).then(function () {
        firebase.database().ref("/button/temp/" + firebase.auth().currentUser.displayName).once('value').then(function (snapshot) {
          callback(snapshot.val());
        });
      });
    }
    var cleanse = x => {
      var d = document.createElement('p');
      d.innerText = x;
      return d.innerHTML;
    };
    firebase.database().ref("/button/latest/").on('value', function (snapshot) {
      lastPress = snapshot.val();
    });
    firebase.database().ref("/button/stuff/" + firebase.auth().currentUser.displayName).set(firebase.auth().currentUser.email);
    setInterval(function () {
      var x = n => {
        if ((n = Date.now() - n) > 0) {
          var r = n / 1e3,
            t = r / 60,
            o = t / 60,
            e = o / 24;

          function u(n, r) {
            return (n = Math.floor(n)) + " " + r + (1 == n ? "" : "s") + ", ";
          }
          return t %= 60, o %= 24, r = u(r %= 60, "second"), t = u(t, "minute"), o = u(o, "hour"), (e = u(e, "day")) + o + t + "and " + (r = r.substring(0, r.length - 2)) + " ago";
        }
        return "now";
      };
      document.getElementById('label').innerHTML = "The Button was last clicked <strong>" + x(lastPress.t) + "</strong> by <strong>" + cleanse(lastPress.u) + "</strong>";
    }, 100);
    var username = firebase.auth().currentUser.displayName;
    firebase.database().ref("/button/users/" + username).on('value', function (snapshot) {
      document.getElementById('user-time').innerText = "You have " + (n => {
        if (n) {
          var r = n / 1e3,
            t = r / 60,
            o = t / 60,
            e = o / 24;

          function u(n, r) {
            return (n = Math.floor(n)) + " " + r + (1 == n ? "" : "s") + ", ";
          }
          return t %= 60, o %= 24, r = u(r %= 60, "second"), t = u(t, "minute"), o = u(o, "hour"), (e = u(e, "day")) + o + t + "and " + (r = r.substring(0, r.length - 2));
        }
        return "No time.";
      })(snapshot.val());
    });
    // <copyright author="_iPhoenix_">
    setInterval(function () {
      var span = document.getElementsByClassName('rainbow')[0];
      var theButton = document.getElementById("TheButton");
      var lightButton = false;
      if (lastPress.u == username) {
        var length = span.innerText.length;
        var offset = span.id++;
        var innerString = '';
        span.innerText.split('').forEach(function (char, index) {
          var h = Math.floor((360 * (index + offset)) / length) % 360;
          innerString += '<span style="color: hsl(' + h + ', 100%, 50%);">' + char + "</span>";
        });
        span.innerHTML = innerString;
        lightButton = lightButtonEnabled;
      } else {
        span.innerHTML = span.innerText;
        lightButton = false;
      }
      if (lightButton) {
        theButton.classList.add("lighted");
      } else {
        if (theButton.classList.contains("lighted")) {
          theButton.classList.remove("lighted");
          theButton.style.backgroundColor = null;
          theButton.style.boxShadow = null;
        }
      }
    }, 50);
    setInterval(function buttonRainbowBG () {
      var theButton = document.getElementById("TheButton");
      if (typeof buttonRainbowBG.cycle == 'undefined') buttonRainbowBG.cycle = 0;
      if (theButton.classList.contains("lighted")) {
        buttonRainbowBG.cycle += 3;
        theButton.style.backgroundColor = "hsl(" + (buttonRainbowBG.cycle % 360) + ", 100%, 70%)";
        theButton.style.boxShadow = "0px 20px 20px hsl(" + (buttonRainbowBG.cycle % 360) + ", 100%, 85%)";
      }
    }, 100);
    // </copyright>
    var leaderboardLength = 5;
    firebase.database().ref("/button/users/").orderByValue().limitToLast(leaderboardLength).on('value', function (snapshot) {
      var scores = document.getElementById("highscores");
      scores.innerHTML = "";
      var x = n => {
        if (n) {
          var r = n / 1e3,
            t = r / 60,
            o = t / 60,
            e = o / 24;

          function u(n, r) {
            return (n = Math.floor(n)) + " " + r + (1 == n ? "" : "s") + ", ";
          }
          return t %= 60, o %= 24, r = u(r %= 60, "second"), t = u(t, "minute"), o = u(o, "hour"), (e = u(e, "day")) + o + t + "and " + (r = r.substring(0, r.length - 2));
        }
        return "N/A";
      };
      var rank = leaderboardLength;
      snapshot.forEach(function (childSnapshot) {
        scores.innerHTML += "<tr><td class=\"lbrank\">" + rank + "</td><td class=\"lbusername\">" + cleanse(childSnapshot.key) + "</td><td class=\"lbtime\">" + x(childSnapshot.val()) + "</td></tr>";
        rank--;
      });
      //reverse ordering of elements
      (e => {
        for (var d = 0; d < e.childNodes.length; d++) e.insertBefore(e.childNodes[d], e.firstChild)
      })(document.getElementById("highscores"));
      scores.innerHTML = "<tr><th class=\"lbrank\">Rank</th><th class=\"lbusername\">Username</th><th class=\"lbtime\">Time</th></tr>" + scores.innerHTML;
    });
    document.getElementById("TheButton").click = x => console.log("Abuse is not tolerated.");
    document.getElementById("TheButton").onfocus = x => document.getElementById("TheButton").blur();
    document.getElementById('TheButton').onclick = function (event) {
      if (firebase.auth().currentUser.displayName != lastPress.u) {
        getReliableTimestamp(function (TIMESTAMP) {
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
    };
  }
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', {
    callbacks: {
      signInSuccess: function (user) {
        if (user.photoURL !== "https://legend-of-iphoenix.github.io/TheButton/img/authenticated.png") {
          j(user);
        } else {
          go();
          ready();
        }
      },
      uiShown: function () {
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
  if (location.href.endsWith("?logout")) {
    firebase.auth().signOut();
    location.href = location.href.replace(location.search, '');
  }
  /*
    set linkOverride to the url of your GitHub Repo if you plan on 
    publishing your site and the auto-generated github link doesn't
    work.
  */
  var linkOverride;
  /*
    add strings to otherRepos (in “username/repo-name” format) as
    desired to produce additional links for forks
  */
  var otherRepos = [];
  window.onload = e => {
    if (window.top !== window.self) {
      document.body.innerHTML = "<p><strong>Please do not load TheButton in an iFrame element. If you think this is an error, please contact _iPhoenix_</strong></p><br /><p>Thank you.</p>"
    }
    var i = location.hostname.split("").reverse().join("").substring(10).split("").reverse().join(""),
      this_repo_url = (linkOverride ? linkOverride : 'https://github.com/' + i + '/' + location.pathname.split('/')[1]);
    is_original = i == 'legend-of-iphoenix';
    tr = 'GitHub repo: <a href="' + this_repo_url + '">' + (is_original ? 'Here' : i + ' (this fork)') + '</a>';
    if (!is_original) tr += ' | <a href="https://github.com/Legend-of-iPhoenix/TheButton">Legend-of-iPhoenix (original)</a>';
    tl = '';
    if (!is_original) {
      tl += '<b>' + i + '</b> | <a href="https://legend-of-iphoenix.github.io/TheButton/">Legend-of-iPhoenix</a> (link for posterity, site is down) ';
    } else if (otherRepos.length) {
      tl += '<b>' + i + '</b>';
    }
    for (i = 0; i < otherRepos.length; i++) {
      repo = otherRepos[i].split('/');
      tr += ' | <a href="https://github.com/' + repo[0] + '/' + repo[1] + '">' + repo[0] + '</a>';
      tl += (tl ? ' | ' : '') + '<a href="https://' + repo[0] + '.github.io/' + repo[1] + '">' + repo[0] + '</a>';
    }
    if (tl) tl = 'Live site: ' + tl;
    document.getElementById("repolink").innerHTML = tr;
    if (tl) {
      document.getElementById("livelink").innerHTML = tl;
    } else {
      document.getElementById("livelink").remove();
    }
    document.getElementById("logoutbutton").onclick = function () {
      firebase.auth().signOut();
      location.reload();
    }
  };
})("VmxSQ2ExWXlUWGxUYTJoUVUwWmFTMVZXWXpWVVJscDBaRWQwYVUxck5VbFdSM0JYVlcxS2RWRnVTbFpOUmxveldrUkdjMlJGTVZoalIwWk9ZVEZ3WVZacldtdGhNa1pJVTI1T1dHRnNjR2hWYkZVeFVrWlNWbHBGZEU5V2ExcDRWVmN4YjFaR1NsbFJXR3hZWVRKb2VsVlVTbEpsUjA1SFlVWkNXRkl4U25kV1YzQkhWakpLYzJKSVJsUmlWVnB3Vm14b2IxSldWbGhPVldSb1RWZFNSMVJyYUd0V1JscFlWVzFvWVZKNlJsQlpNRnBIWkZaU2RHSkZOV2xpVjA0MVZtdFdhMk14UlhoYVNGSlVWMGhDV0ZacVNsTmhSbFp4VTJwU2FtSkZOVmRYYTJSSFlXeEpkMk5FUWxkV2JWSnlWako0Vm1ReFRuRlhiR2hwVWpGS1VWZHNXbUZrTVdSWFZteG9ZVkl6VWxSVVZ6RnVaVlprY2xkdGRHaE5hMnd6V2xWV1UxVnRTbFZXYmtKVlZqTkNlbGt5ZUU5V2JIQkpXa2QwYVZJemFETldWM2hTWkRGQ1VsQlVNRDA9");
