const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const supabase = require("../config/supabase");

const register = async ({ name, email, password }) => {
  // check existing user
  const { data: existingUser } = await supabase
    .from("User")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const userPayload = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    updatedAt: new Date(),
  };

  const { data, error } = await supabase
    .from("User")
    .insert(userPayload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // generate token
  const token = jwt.sign(
    {
      id: data.id,
      email: data.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  // find user
  const { data: user, error } = await supabase
    .from("User")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    throw new Error("Invalid credentials");
  }

  // compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

module.exports = {
  register,
  login,
};
