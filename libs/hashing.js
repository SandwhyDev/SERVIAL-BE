import bcryptjs from "bcryptjs"

const salt = bcryptjs.genSaltSync(10)

export const hashPassword = (pass) => {
  return bcryptjs.hashSync(pass, salt)
}

export const comparePassword = (pass, hashPass) => {
  return bcryptjs.compareSync(pass, hashPass)
}
