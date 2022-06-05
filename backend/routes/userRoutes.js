const express = require("express");
const { userRegister, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(userRegister);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getAllUser);

router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizedRoles("admin"),updateRole)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser);

module.exports = router;