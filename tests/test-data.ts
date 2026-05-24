type Credentials = {
  username: string;
  password: string;
};
const validUser: Credentials = {username: "standard_user", password: "secret_sauce"};
const lockedUser: Credentials = {username: "locked_out_user", password: "secret_sauce"};
export { Credentials, validUser, lockedUser };