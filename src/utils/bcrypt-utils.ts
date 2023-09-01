import bcrypt from 'bcrypt';

const encryptPassword = async (request: any) => {
  if (request.payload.password) {
    request.payload = {
      ...request.payload,
      password: await bcrypt.hash(request.payload.password, 10)
    }
  }
  return request;
};

const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export { encryptPassword, verifyPassword };