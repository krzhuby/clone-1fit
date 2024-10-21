import {
  Admin,
  AuthController,
  Gyms,
  Sports,
  SportsGymsController,
  UserSportGymController,
} from "controllers";
import { Router } from "express";
import checkRole from "middlewares/checkRole.middleware";
import passport from "passport";
// import { passportMiddlewareFunc } from "middlewares";

let router: Router = Router();

// ADMIN
router.post("/auth/admin", Admin.useAdminRole);

//
// USER
router
  .get("/auth/google/login", AuthController.getLogin)
  .get(
    "/verify",
    checkRole("admin"),
    passport.authenticate("google"),
    AuthController.createUserLogin
  )
  .post("/auth/register", AuthController.registerUserData)
  .get("/get-me", AuthController.getUserAssociations)

//
// SPORTS
router
  .get("/sport/get-all", Sports.getAllSports)
  .get("/sport/get/:id", Sports.getById)
  .get("/sport/search/", Sports.searchSport)
  .post("/sport/create", checkRole("admin"), Sports.createSports)
  .put("/sport/update/:id", checkRole("admin"), Sports.updateSport)
  .delete("/sport/delete/:id", checkRole("admin"), Sports.deleteSport);

//
// GYMS
router
  .get("/gym/get-all", Gyms.getAllGyms)
  .get("/gym/get/:id", Gyms.getById)
  .get("/gym/search/", Gyms.searchGym)
  .post("/gym/create", checkRole("admin"), Gyms.createGym)
  .put("/gym/update/:id", checkRole("admin"), Gyms.updateGym)
  .delete("/gym/delete/:id", checkRole("admin"), Gyms.deleteGym);

//
// Sport's Gym
router
  .post("/sports-gym/add",checkRole("admin"),SportsGymsController.addSportToGym)
  .delete("/sports-gym/remove",checkRole("admin"),SportsGymsController.removeSportFromGym)
  .get("/gym/:gymId/sports",checkRole("admin"),SportsGymsController.getSportsByGym)
  .get("/sport/:sportId/gyms",checkRole("admin"),SportsGymsController.getGymsBySport);

//
// Add user to Gyms and Sports
router
  .post("/user-sport-gym", UserSportGymController.addUserToGymAndSport)
  .put("/user-sport-gym/:id", UserSportGymController.updateUserAssociation)
  .delete("/user-sport-gym/:id", UserSportGymController.deleteUserAssociation)
  .get("/user-sport-gym", UserSportGymController.getAllUserAssociations)
  .get(
    "/user-sport-gym/user/:userId",
    UserSportGymController.getUserAssociationsByUserId
  );
export default router;
