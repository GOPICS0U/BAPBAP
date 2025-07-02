
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const path = require("path");
require("dotenv").config();

const app = express();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
  returnURL: "https://localhost:3000/auth/steam/return",
  realm: "https://localhost:3000/",
  apiKey: process.env.STEAM_API_KEY
}, (identifier, profile, done) => {
  process.nextTick(() => {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

app.use(session({ secret: "bapbapsecret", saveUninitialized: true, resave: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.get("/auth/steam", passport.authenticate("steam"));
app.get("/auth/steam/return", 
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    const { id, displayName, photos } = req.user;
    const profileHtml = require("fs").readFileSync("public/profile.html", "utf-8")
      .replace("%USERNAME%", displayName)
      .replace("%AVATAR%", photos[2].value)
      .replace("%STEAMID%", id);
    res.send(profileHtml);
  }
);

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
