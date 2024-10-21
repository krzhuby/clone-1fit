import passport from "passport";

const passportMiddlewareFunc = () => {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  });
};

export { passportMiddlewareFunc };
