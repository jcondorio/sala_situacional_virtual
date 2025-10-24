const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jsonResponse } = require("../lib/jsonResponse");
const sequelize = require("sequelize"); // Asegúrate de importar Sequelize
const Sequelize = require("../config/db");
const Usuario = require("../models/usuarioModel");

const loginService = async (userName, password) => {
    try {
      //console.log("loginService",userName,password)
      if (!userName || !password) {
        return {
          status: 400,
          response: jsonResponse(400, {
            error: "Both username and password are required",
          }),
        };
      }
  
      const user = await Usuario.findOne({ where: { usuario: userName } });
  //console.log("user",user);
      const validPassword = await bcrypt.compare(password, user.psw);
  
      if (!validPassword) {
        return {
          status: 401,
          response: jsonResponse(401, { error: "Invalid password" }),
        };
      }
  
      const accessToken = jwt.sign(
        {
          id: user.id_usuario,
          userName: user.usuario
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "4h" }
      );
      const refreshToken = jwt.sign(
        {
            id: user.id_usuario,
            userName: user.usuario
        },
        process.env.REFRESH_TOKEN_SECRET
      );
  
      return {
        status: 200,
        response: jsonResponse(200, {
          accessToken,
          refreshToken,
        }),
      };
    } catch (error) {
      throw error;
    }
  };


  module.exports = {
    loginService,
  };
  