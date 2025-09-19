class User {
  static async findUserByEmail(email) {
    return db('users')
      .where('email', email)
      .select('id', 'name', 'email', 'password_hash', 'role', 'phone')
      .first();
  }

  static async createUser(userData) {
    return db('users')
      .insert(userData)
      .returning(['id', 'name', 'email', 'role', 'phone']);
  }

  static async toJSON(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.created_at
    };
  }
}

export default User;