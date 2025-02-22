exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // For ref, Github limits usernames to 39 characters
    username: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(254)", notNull: true, unique: true },
    password: { type: "varchar(72)", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
