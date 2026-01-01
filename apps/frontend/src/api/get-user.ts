'use server'

import { cookies } from "next/headers";

export const getUserByToken = async (token: string) => {
  const cookie = await cookies();
  const response = await fetch("http://localhost:8080/api/v1/auth/@me", {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  
  if (response.status !== 200) {
    return null;
  }

  try {
    const user = await response.json();
    
    if (!user) {
      return null;
    };
    
    cookie.set("token", token);
    cookie.set("user", JSON.stringify(user.user));
    cookie.set("auth", JSON.stringify(user.auth));
  
    return user.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserByCookie = async () => {
  const cookie = await cookies();
  const token = cookie.get("token");

  if (!token) {
    return null;
  }

  const response = await fetch("http://localhost:8080/api/v1/auth/@me", {
    headers: {
      authorization: `Bearer ${token.value}`
    } 
  });

  if (response.status !== 200) {
    return null;
  }

  try {
    const user = await response.json();
    
    if (!user) {
      return null;
    };
  
    return user.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getUser = async (token?: string|null) => {
  return token
    ? getUserByToken(token)
    : getUserByCookie();
}