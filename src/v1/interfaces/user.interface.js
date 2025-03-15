/**
 * @interface User
 * @description Interface for User objects
 */
class IUser {
  /**
   * @type {string} id - Unique identifier for the user
   */
  id;

  /**
   * @type {string} name - Full name of the user
   */
  name;

  /**
   * @type {string} email - Email address of the user
   */
  email;

  /**
   * @type {string} password - Hashed password of the user
   */
  password;

  /**
   * @type {Date} createdAt - Time when the user was created
   */
  createdAt;

  /**
   * @type {Date} updatedAt - Time when the user was last updated
   */
  updatedAt;
}

module.exports = IUser; 